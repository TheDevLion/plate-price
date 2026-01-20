import type { SyntheticEvent } from "react";
import { UnitPicker, type Option } from "../../../core/UnitPicker";
import type { Ingredient, Product } from "../store";
import { FieldBlock } from "../../../design_system/FieldBlock";
import { useI18n } from "../../../i18n/useI18n";

type IngredientCardsMobileProps = {
  ingredients: Ingredient[];
  products: Product[];
  onChange: (id: string, field: keyof Ingredient, value: string | number) => void;
  onDelete: (id: string) => void;
  onUnitChange: (
    id: string,
    event: SyntheticEvent<Element, Event>,
    value: Option | null
  ) => void;
  getUnitCategory: (productId: string) => string | undefined;
  getProductPrice: (ingredient: Ingredient) => number | undefined;
};

export const IngredientCardsMobile = ({
  ingredients,
  products,
  onChange,
  onDelete,
  onUnitChange,
  getUnitCategory,
  getProductPrice,
}: IngredientCardsMobileProps) => {
  const { t } = useI18n();

  return (
    <div className="w-full sm:hidden space-y-3">
      {ingredients.map((ingredient) => (
        <div
          key={ingredient.id}
          className="border border-grape-200 rounded-lg bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 gap-2 p-3">
            <FieldBlock label={t("tableProduct")}>
              <select
                className="border border-grape-200 rounded p-2 w-full text-sm"
                value={ingredient.productId}
                onChange={(e) =>
                  onChange(ingredient.id, "productId", e.target.value)
                }
              >
                <option value="">{t("selectProduct")}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </FieldBlock>

            <FieldBlock label={t("tablePriceDescription")}>
              <select
                className="border border-grape-200 rounded p-2 w-full text-sm"
                value={ingredient.priceId}
                onChange={(e) =>
                  onChange(ingredient.id, "priceId", e.target.value)
                }
                disabled={!ingredient.productId}
              >
                <option value="">{t("selectOption")}</option>
                {products
                  .find((product) => product.id === ingredient.productId)
                  ?.prices.map((price) => (
                    <option key={price.id} value={price.id}>
                      {price.description} — {t("currencyPrefix")} {price.value}
                    </option>
                  ))}
              </select>
            </FieldBlock>
          </div>

          <div className="border-t border-grape-200 grid grid-cols-4 gap-2 p-3 items-center">
            <FieldBlock label={t("tableQuantity")} className="flex flex-col items-center">
              <input
                type="number"
                className="border border-grape-200 rounded p-2 w-full text-sm"
                value={ingredient.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(
                    ingredient.id,
                    "quantity",
                    val === "" ? "" : Number(val)
                  );
                }}
              />
            </FieldBlock>
            <FieldBlock label={t("tableUnit")} className="flex flex-col items-center">
              <UnitPicker
                abbvVersion
                unitState={ingredient.unit}
                category={getUnitCategory(ingredient.productId)}
                handleUnitChange={(e, value) =>
                  onUnitChange(ingredient.id, e, value)
                }
              />
            </FieldBlock>

            <FieldBlock label={t("tableTotal")} className="flex flex-col items-center">
              <div className="text-sm font-semibold">
                {t("currencyPrefix")}{" "}
                {Number.isFinite(getProductPrice(ingredient))
                  ? getProductPrice(ingredient)!.toFixed(2)
                  : "0.00"}
              </div>
            </FieldBlock>

            <FieldBlock label={t("tableActions")} className="flex flex-col items-center">
              <button
                className="bg-ink hover:bg-black text-white px-2 py-1 rounded text-xs w-full"
                onClick={() => onDelete(ingredient.id)}
              >
                {t("delete")}
              </button>
            </FieldBlock>
          </div>
        </div>
      ))}
    </div>
  );
};
