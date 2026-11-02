import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { UnitPicker } from "../../../core/UnitPicker";
import type { Product } from "../store";
import {
  productId,
  productName,
  productPrices,
  productQuantity,
  productUnit,
  priceId,
  priceDescription,
  priceValue,
} from "../store";
import { useI18n } from "../../../i18n/useI18n";

type ProductsTableProps = {
  products: Product[];
  onAddPrice: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDeletePrice: (productId: string, priceId: string) => void;
  onChangeProduct: (id: string, field: "name" | "quantity" | "unit", value: number | string) => void;
  onChangePrice: (productId: string, priceId: string, field: "description" | "value", value: string | number) => void;
};

export const ProductsTable = ({ products, onAddPrice, onDeleteProduct, onDeletePrice, onChangeProduct, onChangePrice }: ProductsTableProps) => {
  const { t } = useI18n();

  if (products.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <h3 className="mb-2 font-semibold">{t("emptyProductsTitle")}</h3>
        <p className="text-sm text-grape-700">{t("emptyProductsDescription")}</p>
      </div>
    );
  }

  return (
    <table className="block w-full text-sm lg:table lg:table-fixed">
      <thead className="hidden bg-grape-50 text-left text-grape-800 lg:table-header-group">
        <tr>
          <th scope="col" className="w-[23%] p-3">{t("tableName")}</th>
          <th scope="col" className="w-[12%] p-3">{t("tableQtyShort")}</th>
          <th scope="col" className="w-[12%] p-3">{t("tableUnit")}</th>
          <th scope="col" className="p-3">{t("tablePrices")}</th>
          <th scope="col" className="w-20 p-3">{t("tableActions")}</th>
        </tr>
      </thead>
      <tbody className="block space-y-4 lg:table-row-group lg:space-y-0">
        {products.map(product => (
          <tr key={productId(product)} className="grid grid-cols-2 gap-3 rounded-xl border border-grape-100 p-3 lg:table-row lg:border-x-0 lg:border-t-0">
            <td className="col-span-2 min-w-0 align-top lg:p-3">
              <label htmlFor={`product-name-${productId(product)}`} className="mb-1 block text-xs font-medium text-grape-700 lg:sr-only">{t("tableName")}</label>
              <input
                id={`product-name-${productId(product)}`}
                className="ui-control w-full"
                value={productName(product)}
                onChange={event => onChangeProduct(productId(product), "name", event.target.value)}
              />
            </td>
            <td className="min-w-0 align-top lg:p-3">
              <label htmlFor={`product-quantity-${productId(product)}`} className="mb-1 block text-xs font-medium text-grape-700 lg:sr-only">{t("tableQuantity")}</label>
              <input
                id={`product-quantity-${productId(product)}`}
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                className="ui-control w-full tabular-nums"
                value={productQuantity(product)}
                onChange={event => onChangeProduct(productId(product), "quantity", event.target.value === "" ? "" : Number(event.target.value))}
              />
            </td>
            <td className="min-w-0 align-top lg:p-3">
              <span className="mb-1 block text-xs font-medium text-grape-700 lg:hidden">{t("tableUnit")}</span>
              <UnitPicker unitState={productUnit(product)} onChange={unit => onChangeProduct(productId(product), "unit", unit)} />
            </td>
            <td className="col-span-2 min-w-0 align-top lg:p-3">
              <span className="mb-1 block text-xs font-medium text-grape-700 lg:hidden">{t("tablePrices")}</span>
              <div className="space-y-2">
                {productPrices(product).map(price => (
                  <div key={priceId(price)} className="grid grid-cols-[minmax(0,1fr)_6rem_44px] items-center gap-2">
                    <input
                      aria-label={t("description")}
                      placeholder={t("description")}
                      className="ui-control w-full"
                      value={priceDescription(price)}
                      onChange={event => onChangePrice(productId(product), priceId(price), "description", event.target.value)}
                    />
                    <input
                      aria-label={`${t("priceValue")} (${t("currencyPrefix")})`}
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      className="ui-control w-full tabular-nums"
                      value={priceValue(price)}
                      onChange={event => onChangePrice(productId(product), priceId(price), "value", event.target.value === "" ? "" : Number(event.target.value))}
                    />
                    <Tooltip title={t("deletePrice")}>
                      <IconButton color="error" aria-label={t("deletePrice")} onClick={() => onDeletePrice(productId(product), priceId(price))}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
                {productPrices(product).length === 0 && <p className="text-sm text-grape-700">{t("emptyPrices")}</p>}
                <Button startIcon={<Add />} onClick={() => onAddPrice(productId(product))}>{t("addPrice")}</Button>
              </div>
            </td>
            <td className="col-span-2 text-right align-top lg:p-3 lg:text-center">
              <Tooltip title={t("deleteProduct")}>
                <IconButton color="error" aria-label={`${t("deleteProduct")}: ${productName(product)}`} onClick={() => onDeleteProduct(productId(product))}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
