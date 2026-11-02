import { useEffect } from "react";
import { useMediaQuery } from "@mui/material";
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

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const ingredientsToShow = ingredients.filter(ingredient => ingredientDatasheetId(ingredient) === selectedSheet);

  useEffect(() => {
    loadIngredients();
    loadProducts();
  }, [loadIngredients, loadProducts]);

  const persistIngredients = (newIngredients: Ingredient[]) => {
    const otherRecipesIngredients = ingredients.filter(i => ingredientDatasheetId(i) !== selectedSheet);

    const newTotalIngredients = [...otherRecipesIngredients, ...newIngredients]
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
        const product = products.find(product => productId(product) === value);
        const prices = product ? productPrices(product) : [];
        return makeIngredient(
          ingredientId(i),
          String(value),
          prices.length === 1 ? priceId(prices[0]) : "",
          ingredientQuantity(i),
          product ? productUnit(product) : "",
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

  const getUnitCategory = (productIdValue: string) => {
    if (!productIdValue) return undefined;

    const product = products.find(p => productId(p) === productIdValue);
    if (!product) return undefined;

    const conversion = CONVERSIONS.find(c => c.abbv === productUnit(product));
    return conversion?.category;
  };

  const totalCost = ingredientsToShow.reduce((sum, ingredient) => sum + (getProductPrice(ingredient) ?? 0), 0);

  if (!selectedSheet)
    return (
      <h3 className="flex justify-center m-10">
        {t("selectDatasheetFirst")}
      </h3>
    );

  return (
    <div className="mx-auto flex max-w-5xl flex-col py-6 px-3 sm:px-4">
      <IngredientSummary
        totalCount={ingredientsToShow.length}
        totalCost={totalCost}
        onAddIngredient={handleAddIngredient}
      />

      {ingredientsToShow.length === 0 ? (
        <div className="w-full max-w-5xl bg-white border border-grape-200 rounded-lg shadow-sm p-6 text-center text-sm text-grape-700 mb-6">
          <div className="text-base font-semibold text-ink mb-1">
            {t("emptyIngredientsTitle")}
          </div>
          <div>{t("emptyIngredientsDescription")}</div>
        </div>
      ) : (
        isDesktop ? (
          <IngredientTableDesktop
            ingredients={ingredientsToShow}
            products={products}
            onChange={handleChange}
            onDelete={handleDeleteIngredient}
            getUnitCategory={getUnitCategory}
            getProductPrice={getProductPrice}
          />

        ) : (
          <IngredientCardsMobile
            ingredients={ingredientsToShow}
            products={products}
            onChange={handleChange}
            onDelete={handleDeleteIngredient}
            getUnitCategory={getUnitCategory}
            getProductPrice={getProductPrice}
          />
        )
      )}
    </div>
  );
};
