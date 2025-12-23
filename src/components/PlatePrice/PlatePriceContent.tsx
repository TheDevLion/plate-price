import { useEffect, useState } from "react";
import { useIngredients, useProducts, useSelectedSheet, type Ingredient } from "./store";
import { UnitPicker, type Option } from "../../core/UnitPicker";
import { convertValue } from "../../helpers/convert_values";
import { CONVERSIONS } from "../../constants";
import { useI18n } from "../../i18n";

export const PlatePriceContent = () => {
  const { t } = useI18n();
  const { selectedSheet } = useSelectedSheet();
  const { products, setProducts } = useProducts();
  const { ingredients, setIngredients } = useIngredients();

  const [ingredientsToShow, setIngredientsToShow] = useState<Ingredient[]>([]);

  useEffect(() => {
    const savedIngredients = localStorage.getItem("ingredients");
    if (savedIngredients) setIngredients(JSON.parse(savedIngredients));

    const savedProducts = localStorage.getItem("products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    if (ingredients) {
      const receiptIngredients = ingredients.filter(i => i.datasheetId === selectedSheet)
      setIngredientsToShow(receiptIngredients);
    }
  }, [selectedSheet])

  const persistIngredients = (newIngredients: Ingredient[]) => {
    setIngredientsToShow(newIngredients);
    const otherReceiptsIngredients = ingredients.filter(i => i.datasheetId !== selectedSheet);

    const newTotalIngredients = [...otherReceiptsIngredients, ...newIngredients]
    localStorage.setItem("ingredients", JSON.stringify(newTotalIngredients));
    setIngredients(newTotalIngredients)
  };

  const handleAddIngredient = () => {
    if (!selectedSheet) return;

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      productId: "",
      priceId: "",
      quantity: 1,
      unit: "",
      datasheetId: selectedSheet,
    };
    persistIngredients([...ingredientsToShow, newIngredient]);
  };

  const handleDeleteIngredient = (id: string) => {
    persistIngredients(ingredientsToShow.filter((i) => i.id !== id));
  };

  const handleChange = (
    id: string,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = ingredientsToShow.map((i) =>
      i.id === id ? { ...i, [field]: value } : i
    );
    persistIngredients(updated);
  };

  const getProductPrice = (ing: Ingredient) => {
    const product = products.find((p) => p.id === ing.productId);
    const price = product?.prices.find((pr) => pr.id === ing.priceId);

    const inputValue = ing.quantity
    const inputUnit = ing.unit
    const outputUnit = product?.unit
    const parcialResult = convertValue(inputValue, inputUnit, outputUnit ?? "")

    if (parcialResult && product?.quantity)
      return price && price.value && ing.quantity ? price.value * (Number(parcialResult) / product?.quantity) : 0;
  };

  const handleUnitChange = (productId: string, _: React.SyntheticEvent<Element, Event>, value: Option | null) => {
        if (!value) return;
        const unit = value.abbv;
        handleChange(productId, "unit", unit);
    };

  const getUnitCategory = (productId: string) => {
    if (!productId) return undefined;

    const product = products.find(p => p.id === productId);
    if (!product) return undefined;

    const conversion = CONVERSIONS.find(c => c.abbv === product.unit);
    return conversion?.category;
};


  if (!selectedSheet)
    return (
      <h3 className="flex justify-center m-10">
        {t("selectDatasheetFirst")}
      </h3>
    );

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <button
        onClick={handleAddIngredient}
        className="mb-6 bg-grape-600 hover:bg-grape-700 text-white px-4 py-2 rounded shadow"
      >
        {t("addIngredient")}
      </button>

      <table className="min-w-[80%] border border-grape-200 shadow-md rounded-xl overflow-hidden">
        <thead className="bg-grape-50">
          <tr>
            <th className="p-2 border border-grape-200">{t("tableProduct")}</th>
            <th className="p-2 border border-grape-200">{t("tablePriceDescription")}</th>
            <th className="p-2 border border-grape-200 w-[10%]">{t("tableQuantity")}</th>
            <th className="p-2 border border-grape-200 w-[10%]">{t("tableUnit")}</th>
            <th className="p-2 border border-grape-200 w-[10%]">{t("tableTotal")}</th>
            <th className="p-2 border border-grape-200 w-[10%]">{t("tableActions")}</th>
          </tr>
        </thead>
        <tbody>
          {ingredientsToShow.map((i) => (
            <tr key={i.id}>
              <td className="border border-grape-200 p-2">
                <select
                  className="border border-grape-200 rounded p-1 w-full"
                  value={i.productId}
                  onChange={(e) => handleChange(i.id, "productId", e.target.value)}
                >
                  <option value="">{t("selectProduct")}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-grape-200 p-2">
                <select
                  className="border border-grape-200 rounded p-1 w-full"
                  value={i.priceId}
                  onChange={(e) => handleChange(i.id, "priceId", e.target.value)}
                  disabled={!i.productId}
                >
                  <option value="">{t("selectOption")}</option>
                  {products
                    .find((p) => p.id === i.productId)
                    ?.prices.map((pr) => (
                      <option key={pr.id} value={pr.id}>
                        {pr.description} — ${pr.value}
                      </option>
                    ))}
                </select>
              </td>
              <td className="border border-grape-200 p-2">
                <input
                  type="number"
                  className="border border-grape-200 rounded p-1 w-full"
                  value={i.quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange(i.id, "quantity", val === "" ? "" : Number(val))
                  }}
                />
              </td>
              <td className="border border-grape-200 p-2">
                <UnitPicker 
                    abbvVersion 
                    unitState={i.unit}   
                    category={getUnitCategory(i.productId)}
                    handleUnitChange={(e, value) => handleUnitChange(i.id, e, value)}
                />
              </td>
              <td className="border border-grape-200 p-2 text-right font-semibold">
                {getProductPrice(i)?.toFixed(2)}
              </td>
              <td className="border border-grape-200 p-2 text-center">
                <button
                  className="bg-ink hover:bg-black text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteIngredient(i.id)}
                >
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
