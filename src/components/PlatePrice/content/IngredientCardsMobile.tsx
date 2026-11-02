import { ProductPicker } from "./ProductPicker";
import { Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import { UnitPicker } from "../../../core/UnitPicker";
import type { Ingredient, Product } from "../store";
import {
  productId,
  productPrices,
  priceId,
  priceDescription,
  priceValue,
  ingredientId,
  ingredientProductId,
  ingredientPriceId,
  ingredientQuantity,
  ingredientUnit,
} from "../store";
import { FieldBlock } from "../../../design_system/FieldBlock";
import { useI18n } from "../../../i18n/useI18n";

type IngredientCardsMobileProps = {
  ingredients: Ingredient[];
  products: Product[];
  onChange: (id: string, field: "productId" | "priceId" | "quantity" | "unit", value: string | number) => void;
  onDelete: (id: string) => void;
  getUnitCategory: (productId: string) => string | undefined;
  getProductPrice: (ingredient: Ingredient) => number | undefined;
};

export const IngredientCardsMobile = ({
  ingredients,
  products,
  onChange,
  onDelete,
  getUnitCategory,
  getProductPrice,
}: IngredientCardsMobileProps) => {
  const { t } = useI18n();

  return (
    <div className="w-full space-y-4">
      {ingredients.map((ingredient) => (
        <div
          key={ingredientId(ingredient)}
          className="border border-grape-100 rounded-xl bg-white"
        >
          <div className="grid grid-cols-1 gap-3 p-4">
            <FieldBlock label={t("tableProduct")} htmlFor={`ingredient-product-${ingredientId(ingredient)}`}>
              <ProductPicker
                id={`ingredient-product-${ingredientId(ingredient)}`}
                products={products}
                value={ingredientProductId(ingredient)}
                onChange={id => onChange(ingredientId(ingredient), "productId", id)}
              />
            </FieldBlock>

            <FieldBlock label={t("tablePriceDescription")} htmlFor={`ingredient-price-${ingredientId(ingredient)}`}>
              <select
                className="ui-control w-full"
                id={`ingredient-price-${ingredientId(ingredient)}`}
                value={ingredientPriceId(ingredient)}
                onChange={(e) =>
                  onChange(ingredientId(ingredient), "priceId", e.target.value)
                }
                disabled={!ingredientProductId(ingredient)}
              >
                <option value="">{t("selectOption")}</option>
                {(() => {
                  const selectedProduct = products.find(
                    (product) => productId(product) === ingredientProductId(ingredient)
                  );
                  if (!selectedProduct) return null;
                  return productPrices(selectedProduct).map((price) => (
                    <option key={priceId(price)} value={priceId(price)}>
                      {priceDescription(price)} - {t("currencyPrefix")} {priceValue(price)}
                    </option>
                  ));
                })()}
              </select>
            </FieldBlock>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            <FieldBlock label={t("tableQuantity")} htmlFor={`ingredient-quantity-${ingredientId(ingredient)}`}>
              <input
                type="number"
                id={`ingredient-quantity-${ingredientId(ingredient)}`}
                min="0"
                step="any"
                inputMode="decimal"
                className="ui-control w-full"
                value={ingredientQuantity(ingredient)}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(
                    ingredientId(ingredient),
                    "quantity",
                    val === "" ? "" : Number(val)
                  );
                }}
              />
            </FieldBlock>
            <FieldBlock label={t("tableUnit")} className="min-w-0">
              <UnitPicker
                unitState={ingredientUnit(ingredient)}
                category={getUnitCategory(ingredientProductId(ingredient))}
                onChange={unit => onChange(ingredientId(ingredient), "unit", unit)}
                disabled={!ingredientProductId(ingredient)}
              />
            </FieldBlock>

          </div>
          <div className="flex items-center justify-between gap-3 border-t border-grape-100 px-4 py-3">
            <FieldBlock label={t("tableTotal")}>
              <div className="break-words text-lg font-semibold tabular-nums">
                {t("currencyPrefix")}{" "}
                {Number.isFinite(getProductPrice(ingredient))
                  ? getProductPrice(ingredient)!.toFixed(2)
                  : "0.00"}
              </div>
            </FieldBlock>

            <Button color="error" startIcon={<Delete fontSize="small" />} onClick={() => onDelete(ingredientId(ingredient))} sx={{ flexShrink: 0 }}>
              {t("delete")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
