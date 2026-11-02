import { Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { UnitPicker } from "../../../core/UnitPicker";
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
  getUnitCategory: (productId: string) => string | undefined;
  getProductPrice: (ingredient: Ingredient) => number | undefined;
};

export const IngredientTableDesktop = ({
  ingredients,
  products,
  onChange,
  onDelete,
  getUnitCategory,
  getProductPrice,
}: IngredientTableDesktopProps) => {
  const { t } = useI18n();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-grape-100 bg-white">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-grape-50 text-left text-grape-800">
          <tr>
            <th scope="col" className="p-3 w-[24%] truncate">
              {t("tableProduct")}
            </th>
            <th scope="col" className="p-3 w-[28%] truncate">
              {t("tablePriceDescription")}
            </th>
            <th scope="col" className="p-3 w-[12%] truncate">
              {t("tableQuantity")}
            </th>
            <th scope="col" className="p-3 w-[12%] truncate">
              {t("tableUnit")}
            </th>
            <th scope="col" className="p-3 w-[16%] truncate">
              {t("tableTotal")}
            </th>
            <th scope="col" className="p-3 w-[8%] truncate">
              {t("tableActions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredientId(ingredient)}>
              <td className="border-t border-grape-100 p-3 truncate">
                <select
                  className="ui-control w-full truncate"
                  aria-label={t("tableProduct")}
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
              <td className="border-t border-grape-100 p-3 truncate">
                <select
                  className="ui-control w-full truncate"
                  aria-label={t("tablePriceDescription")}
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
              <td className="border-t border-grape-100 p-3 truncate">
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  aria-label={t("tableQuantity")}
                  className="ui-control w-full tabular-nums"
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
              <td className="border-t border-grape-100 p-3 truncate">
                <UnitPicker
                  unitState={ingredientUnit(ingredient)}
                  category={getUnitCategory(ingredientProductId(ingredient))}
                  onChange={unit => onChange(ingredientId(ingredient), "unit", unit)}
                  disabled={!ingredientProductId(ingredient)}
                />
              </td>
              <td className="border-t border-grape-100 p-3 text-right font-semibold tabular-nums truncate">
                <span className="block truncate">
                  {t("currencyPrefix")}{" "}
                  {Number.isFinite(getProductPrice(ingredient))
                    ? getProductPrice(ingredient)!.toFixed(2)
                    : "0.00"}
                </span>
              </td>
              <td className="border-t border-grape-100 p-3 text-center truncate">
                <Tooltip title={t("delete")}>
                  <IconButton color="error" aria-label={t("delete")} onClick={() => onDelete(ingredientId(ingredient))}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
