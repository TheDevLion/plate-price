import { Delete } from "@mui/icons-material";
import type { SyntheticEvent } from "react";
import { UnitPicker, type Option } from "../../../core/UnitPicker";
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
  onChangePrice: (
    productId: string,
    priceId: string,
    field: "description" | "value",
    value: string | number
  ) => void;
  onUnitChange: (
    productId: string,
    event: SyntheticEvent<Element, Event>,
    value: Option | null
  ) => void;
};

export const ProductsTable = ({
  products,
  onAddPrice,
  onDeleteProduct,
  onDeletePrice,
  onChangeProduct,
  onChangePrice,
  onUnitChange,
}: ProductsTableProps) => {
  const { t } = useI18n();

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[760px] w-full border border-grape-200 mb-10 text-xs sm:text-sm">
        <thead className="bg-grape-50">
          <tr>
            <th className="border border-grape-200 p-2">{t("tableName")}</th>
            <th className="border border-grape-200 p-2 w-[10%]">{t("tableQtyShort")}</th>
            <th className="border border-grape-200 p-2 w-[10%]">{t("tableUnit")}</th>
            <th className="border border-grape-200 p-2">{t("tablePrices")}</th>
            <th className="border border-grape-200 p-2 w-[20%]">{t("tableActions")}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={productId(product)}>
              <td className="border border-grape-200 p-2">
                <input
                  className="border border-grape-200 p-1 w-full"
                  value={productName(product)}
                  onChange={(e) => onChangeProduct(productId(product), "name", e.target.value)}
                />
              </td>
              <td className="border border-grape-200 p-2">
                <input
                  type="number"
                  className="border border-grape-200 p-1 w-full"
                  value={productQuantity(product)}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeProduct(
                      productId(product),
                      "quantity",
                      val === "" ? "" : Number(val)
                    );
                  }}
                />
              </td>
              <td className="border border-grape-200 p-1">
                <UnitPicker
                  abbvVersion
                  unitState={productUnit(product)}
                  handleUnitChange={(e, value) => onUnitChange(productId(product), e, value)}
                />
              </td>
              <td className="border border-grape-200 p-2 align-top">
                {productPrices(product).map((price) => (
                  <div key={priceId(price)} className="flex gap-1 mt-1">
                    <input
                      placeholder={t("description")}
                      className="border border-grape-200 rounded p-1 flex-1"
                      value={priceDescription(price)}
                      onChange={(e) =>
                        onChangePrice(productId(product), priceId(price), "description", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="border border-grape-200 rounded p-1 w-24"
                      value={priceValue(price)}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChangePrice(
                          productId(product),
                          priceId(price),
                          "value",
                          val === "" ? "" : Number(val)
                        );
                      }}
                    />
                    <button
                      className="bg-ink hover:bg-black text-white rounded px-2"
                      onClick={() => onDeletePrice(productId(product), priceId(price))}
                    >
                      <Delete fontSize="small" />
                    </button>
                  </div>
                ))}
              </td>
              <td className="border border-grape-200 p-2 text-center justify-center">
                <button
                  className="bg-grape-600 hover:bg-grape-700 text-white p-2 rounded mr-1"
                  onClick={() => onAddPrice(productId(product))}
                >
                  {t("addPrice")}
                </button>
                <button
                  className="bg-ink hover:bg-black text-white p-2 rounded"
                  onClick={() => onDeleteProduct(productId(product))}
                >
                  <Delete fontSize="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
