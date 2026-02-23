import { useEffect, useMemo, useState } from "react";
import { useIngredients, useProducts, useSelectedSheet, type Ingredient } from "../store";
import { getNextId } from "../../../helpers/idCounter";
import type { Option } from "../../../core/UnitPicker";
import { convertValue } from "../../../helpers/convert_values";
import { CONVERSIONS } from "../../../constants";
import { useI18n } from "../../../i18n/useI18n";
import { IngredientSummary } from "./IngredientSummary";
import { IngredientTableDesktop } from "./IngredientTableDesktop";
import { IngredientCardsMobile } from "./IngredientCardsMobile";

export const PlatePriceContent = () => {
  const { t } = useI18n();
  const { selectedSheet } = useSelectedSheet();
  const { products, loadProducts } = useProducts();
  const { ingredients, setIngredients, loadIngredients, saveIngredients } = useIngredients();

  const [ingredientsToShow, setIngredientsToShow] = useState<Ingredient[]>([]);

  useEffect(() => {
    loadIngredients();
    loadProducts();
  }, [loadIngredients, loadProducts]);

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
    saveIngredients(newTotalIngredients);
    setIngredients(newTotalIngredients)
  };

  const handleAddIngredient = () => {
    if (!selectedSheet) return;

    const newIngredient: Ingredient = {
      id: getNextId(),
      productId: "",
      priceId: "",
      quantity: 1,
      unit: "",
      datasheetId: selectedSheet,
    };
    persistIngredients([newIngredient, ...ingredientsToShow]);
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

  const totalCost = useMemo(() => {
    return ingredientsToShow.reduce((sum, ingredient) => {
      const value = getProductPrice(ingredient);
      return sum + (value ?? 0);
    }, 0);
  }, [ingredientsToShow, products]);


  if (!selectedSheet)
    return (
      <h3 className="flex justify-center m-10">
        {t("selectDatasheetFirst")}
      </h3>
    );

  return (
    <div className="flex flex-col items-center justify-center py-8 px-2">
      <IngredientSummary
        totalCount={ingredientsToShow.length}
        totalCost={totalCost}
        onAddIngredient={handleAddIngredient}
      />

      {ingredientsToShow.length === 0 ? (
        <div className="w-full max-w-5xl bg-white border border-grape-200 rounded-lg shadow-sm p-6 text-center text-sm text-ink-600 mb-6">
          <div className="text-base font-semibold text-ink mb-1">
            {t("emptyIngredientsTitle")}
          </div>
          <div>{t("emptyIngredientsDescription")}</div>
        </div>
      ) : (
        <>
          <IngredientTableDesktop
            ingredients={ingredientsToShow}
            products={products}
            onChange={handleChange}
            onDelete={handleDeleteIngredient}
            onUnitChange={handleUnitChange}
            getUnitCategory={getUnitCategory}
            getProductPrice={getProductPrice}
          />

          <IngredientCardsMobile
            ingredients={ingredientsToShow}
            products={products}
            onChange={handleChange}
            onDelete={handleDeleteIngredient}
            onUnitChange={handleUnitChange}
            getUnitCategory={getUnitCategory}
            getProductPrice={getProductPrice}
          />
        </>
      )}
    </div>
  );
};
