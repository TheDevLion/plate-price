import { useEffect } from "react";
import type { Option } from "../../../core/UnitPicker";
import { useProducts, type Product } from "../store";
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
        const newProd: Product = {
            id: Date.now().toString(),
            name: "",
            quantity: 1,
            unit: "",
            prices: [],
        };
        setProducts([...products, newProd])
    };

    const handleDeleteProduct = (id: string) => {
        if (!confirm(t("deleteProductConfirm"))) return;
        setProducts(products.filter((p) => p.id !== id));
    };

    const handleAddPrice = (prodId: string) => {
        const newPrice = {
            id: Date.now().toString(),
            description: "",
            value: 0,   
        };
        const updated = products.map((p) =>
            p.id === prodId ? { ...p, prices: [...p.prices, newPrice] } : p
        );
        setProducts(updated)
    };

    const handleChangeProduct = (id: string, field: keyof Product, value: number | string) => {
        const updated = products.map((p) =>
            p.id === id ? { ...p, [field]: value } : p
        );
        setProducts(updated)
    };

    const handleChangePrice = (
        prodId: string,
        priceId: string,
        field: "description" | "value",
        value: string | number
    ) => {
        const updated = products.map((p) =>
            p.id === prodId
                ? {
                    ...p,
                    prices: p.prices.map((pr) =>
                    pr.id === priceId ? { ...pr, [field]: value } : pr
                    ),
                }
                : p
        );
        setProducts(updated)
    };

    const handleDeletePrice = (prodId: string, priceId: string) => {
        const updated = products.map((p) =>
            p.id === prodId
                ? { ...p, prices: p.prices.filter((pr) => pr.id !== priceId) }
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
