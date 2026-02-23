import { useEffect } from "react";
import type { Option } from "../../../core/UnitPicker";
import {
  useProducts,
  type Product,
  makeProduct,
  makePrice,
  productId,
  productName,
  productPrices,
  productQuantity,
  productUnit,
  priceId,
  priceDescription,
  priceValue,
} from "../store";
import { getNextId } from "../../../helpers/idCounter";
import { useI18n } from "../../../i18n/useI18n";
import { ProductsModalHeader } from "./ProductsModalHeader";
import { ProductsTable } from "./ProductsTable";
import { ProductsModalFooter } from "./ProductsModalFooter";


type Props = {
  onClose: () => void;
};

export const ProductsModal = ({ onClose }: Props) => {
    const { t } = useI18n();
    const { products, setProducts, loadProducts, saveProducts } = useProducts()

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    
    const saveChanges = () => {
        saveProducts(products);
    };

    const handleAddProduct = () => {
        const newProd: Product = makeProduct(getNextId(), "", 1, "", []);
        setProducts([...products, newProd])
    };

    const handleDeleteProduct = (id: string) => {
        if (!confirm(t("deleteProductConfirm"))) return;
        setProducts(products.filter((p) => productId(p) !== id));
    };

    const handleAddPrice = (prodId: string) => {
        const newPrice = makePrice(getNextId(), "", 0);
        const updated = products.map((p) =>
            productId(p) === prodId ? makeProduct(
              productId(p),
              productName(p),
              productQuantity(p),
              productUnit(p),
              [...productPrices(p), newPrice]
            ) : p
        );
        setProducts(updated)
    };

    const handleChangeProduct = (id: string, field: "name" | "quantity" | "unit", value: number | string) => {
        const updated = products.map((p) => {
            if (productId(p) !== id) return p;
            if (field === "name") {
                return makeProduct(productId(p), String(value), productQuantity(p), productUnit(p), productPrices(p));
            }
            if (field === "quantity") {
                return makeProduct(productId(p), productName(p), value as number | "", productUnit(p), productPrices(p));
            }
            return makeProduct(productId(p), productName(p), productQuantity(p), String(value), productPrices(p));
        });
        setProducts(updated)
    };

    const handleChangePrice = (
        prodId: string,
        priceIdValue: string,
        field: "description" | "value",
        value: string | number
    ) => {
        const updated = products.map((p) => {
            if (productId(p) !== prodId) return p;
            const nextPrices = productPrices(p).map((pr) => {
                if (priceId(pr) !== priceIdValue) return pr;
                if (field === "description") {
                    return makePrice(priceId(pr), String(value), priceValue(pr));
                }
                return makePrice(priceId(pr), priceDescription(pr), value as number | "");
            });
            return makeProduct(productId(p), productName(p), productQuantity(p), productUnit(p), nextPrices);
        });
        setProducts(updated)
    };

    const handleDeletePrice = (prodId: string, priceIdValue: string) => {
        const updated = products.map((p) =>
            productId(p) === prodId
                ? makeProduct(
                    productId(p),
                    productName(p),
                    productQuantity(p),
                    productUnit(p),
                    productPrices(p).filter((pr) => priceId(pr) !== priceIdValue)
                  )
                : p
        );
       setProducts(updated)
    };

    const handleUnitChange = (productId: string, _: React.SyntheticEvent<Element, Event>, value: Option | null) => {
        if (!value) return;
        const unit = value.abbv;
        handleChangeProduct(productId, "unit", unit);
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
            <div className="bg-white w-[95%] sm:w-5/6 max-h-[90vh] rounded-lg shadow-lg relative flex flex-col">
                
                <ProductsModalHeader onAddProduct={handleAddProduct} onClose={onClose} />

                <div className="flex-1 overflow-auto p-4 sm:p-6">
                <ProductsTable
                    products={products}
                    onAddPrice={handleAddPrice}
                    onDeleteProduct={handleDeleteProduct}
                    onDeletePrice={handleDeletePrice}
                    onChangeProduct={handleChangeProduct}
                    onChangePrice={handleChangePrice}
                    onUnitChange={handleUnitChange}
                />
                </div>

                <ProductsModalFooter onSave={saveChanges} />

            </div>
        </div>

    );
};
