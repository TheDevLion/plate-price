import { useEffect, useMemo, useState } from "react";
import {
  useIngredients,
  useProducts,
  useSelectedSheet,
  type Ingredient,
  productId,
  productPrices,
  productQuantity,
  productUnit,
  priceId,
  priceValue,
  makeIngredient,
  ingredientDatasheetId,
  ingredientId,
  ingredientPriceId,
  ingredientProductId,
  ingredientQuantity,
  ingredientUnit,
} from "../store";
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
      const receiptIngredients = ingredients.filter(i => ingredientDatasheetId(i) === selectedSheet)
      setIngredientsToShow(receiptIngredients);
    }
  }, [selectedSheet])

  const persistIngredients = (newIngredients: Ingredient[]) => {
    setIngredientsToShow(newIngredients);
    const otherReceiptsIngredients = ingredients.filter(i => ingredientDatasheetId(i) !== selectedSheet);

    const newTotalIngredients = [...otherReceiptsIngredients, ...newIngredients]
    saveIngredients(newTotalIngredients);
    setIngredients(newTotalIngredients)
  };

  const handleAddIngredient = () => {
    if (!selectedSheet) return;

    const newIngredient: Ingredient = makeIngredient(
      getNextId(),
      "",
      "",
      1,
      "",
      selectedSheet
    );
    persistIngredients([newIngredient, ...ingredientsToShow]);
  };

  const handleDeleteIngredient = (id: string) => {
    persistIngredients(ingredientsToShow.filter((i) => ingredientId(i) !== id));
  };

  const handleChange = (
    id: string,
    field: "productId" | "priceId" | "quantity" | "unit",
    value: string | number
  ) => {
    const updated = ingredientsToShow.map((i) => {
      if (ingredientId(i) !== id) return i;
      if (field === "productId") {
        return makeIngredient(
          ingredientId(i),
          String(value),
          ingredientPriceId(i),
          ingredientQuantity(i),
          ingredientUnit(i),
          ingredientDatasheetId(i)
        );
      }
      if (field === "priceId") {
        return makeIngredient(
          ingredientId(i),
          ingredientProductId(i),
          String(value),
          ingredientQuantity(i),
          ingredientUnit(i),
          ingredientDatasheetId(i)
        );
      }
      if (field === "quantity") {
        return makeIngredient(
          ingredientId(i),
          ingredientProductId(i),
          ingredientPriceId(i),
          value as number | "",
          ingredientUnit(i),
          ingredientDatasheetId(i)
        );
      }
      return makeIngredient(
        ingredientId(i),
        ingredientProductId(i),
        ingredientPriceId(i),
        ingredientQuantity(i),
        String(value),
        ingredientDatasheetId(i)
      );
    });
    persistIngredients(updated);
  };

  const getProductPrice = (ing: Ingredient) => {
    const product = products.find((p) => productId(p) === ingredientProductId(ing));
    const price = product
      ? productPrices(product).find((pr) => priceId(pr) === ingredientPriceId(ing))
      : undefined;

    const inputValue = ingredientQuantity(ing)
    const inputUnit = ingredientUnit(ing)
    const outputUnit = product ? productUnit(product) : undefined
    const parcialResult = convertValue(inputValue, inputUnit, outputUnit ?? "")

    if (parcialResult && product) {
      const qty = Number(productQuantity(product));
      if (!qty) return 0;
      const priceNum = price ? Number(priceValue(price)) : 0;
      const ingQty = Number(ingredientQuantity(ing));
      return price && priceNum && ingQty
        ? priceNum * (Number(parcialResult) / qty)
        : 0;
    }
  };

  const handleUnitChange = (productIdValue: string, _: React.SyntheticEvent<Element, Event>, value: Option | null) => {
        if (!value) return;
        const unit = value.abbv;
        handleChange(productIdValue, "unit", unit);
    };

  const getUnitCategory = (productIdValue: string) => {
    if (!productIdValue) return undefined;

    const product = products.find(p => productId(p) === productIdValue);
    if (!product) return undefined;

    const conversion = CONVERSIONS.find(c => c.abbv === productUnit(product));
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
