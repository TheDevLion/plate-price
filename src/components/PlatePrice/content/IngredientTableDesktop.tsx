import type { SyntheticEvent } from "react";
import { UnitPicker, type Option } from "../../../core/UnitPicker";
import type { Ingredient, Product } from "../store";
import {
  productId,
  productName,
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
import { useI18n } from "../../../i18n/useI18n";

type IngredientTableDesktopProps = {
  ingredients: Ingredient[];
  products: Product[];
  onChange: (id: string, field: "productId" | "priceId" | "quantity" | "unit", value: string | number) => void;
  onDelete: (id: string) => void;
  onUnitChange: (
    id: string,
    event: SyntheticEvent<Element, Event>,
    value: Option | null
  ) => void;
  getUnitCategory: (productId: string) => string | undefined;
  getProductPrice: (ingredient: Ingredient) => number | undefined;
};

export const IngredientTableDesktop = ({
  ingredients,
  products,
  onChange,
  onDelete,
  onUnitChange,
  getUnitCategory,
  getProductPrice,
}: IngredientTableDesktopProps) => {
  const { t } = useI18n();

  return (
    <div className="w-full overflow-x-auto hidden sm:block">
      <table className="min-w-[640px] table-fixed border border-grape-200 shadow-md rounded-xl overflow-hidden text-xs sm:text-sm">
        <thead className="bg-grape-50">
          <tr>
            <th className="p-2 border border-grape-200 w-[26%] truncate">
              {t("tableProduct")}
            </th>
            <th className="p-2 border border-grape-200 w-[28%] truncate">
              {t("tablePriceDescription")}
            </th>
            <th className="p-2 border border-grape-200 w-[10%] truncate">
              {t("tableQuantity")}
            </th>
            <th className="p-2 border border-grape-200 w-[10%] truncate">
              {t("tableUnit")}
            </th>
            <th className="p-2 border border-grape-200 w-[12%] truncate">
              {t("tableTotal")}
            </th>
            <th className="p-2 border border-grape-200 w-[14%] truncate">
              {t("tableActions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredientId(ingredient)}>
              <td className="border border-grape-200 p-2 truncate">
                <select
                  className="border border-grape-200 rounded p-1 w-full min-w-0 truncate"
                  value={ingredientProductId(ingredient)}
                  onChange={(e) =>
                    onChange(ingredientId(ingredient), "productId", e.target.value)
                  }
                >
                  <option value="">{t("selectProduct")}</option>
                  {products.map((product) => (
                    <option key={productId(product)} value={productId(product)}>
                      {productName(product)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-grape-200 p-2 truncate">
                <select
                  className="border border-grape-200 rounded p-1 w-full min-w-0 truncate"
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
              </td>
              <td className="border border-grape-200 p-2 truncate">
                <input
                  type="number"
                  className="border border-grape-200 rounded p-1 w-full min-w-0"
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
              </td>
              <td className="border border-grape-200 p-2 truncate">
                <UnitPicker
                  abbvVersion
                  unitState={ingredientUnit(ingredient)}
                  category={getUnitCategory(ingredientProductId(ingredient))}
                  handleUnitChange={(e, value) =>
                    onUnitChange(ingredientId(ingredient), e, value)
                  }
                />
              </td>
              <td className="border border-grape-200 p-2 text-right font-semibold truncate">
                <span className="block truncate">
                  {t("currencyPrefix")}{" "}
                  {Number.isFinite(getProductPrice(ingredient))
                    ? getProductPrice(ingredient)!.toFixed(2)
                    : "0.00"}
                </span>
              </td>
              <td className="border border-grape-200 p-2 text-center truncate">
                <button
                  className="bg-ink hover:bg-black text-white px-2 py-1 rounded"
                  onClick={() => onDelete(ingredientId(ingredient))}
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
