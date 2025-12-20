import { useEffect } from "react";
import { Close, Add, Delete } from "@mui/icons-material";
import { UnitPicker, type Option } from "../../core/UnitPicker";
import { useProducts, type Product } from "./store";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";


type Props = {
  onClose: () => void;
};

export const ProductsModal = ({ onClose }: Props) => {
    const { products, setProducts } = useProducts()

    useEffect(() => {
        const saved = localStorage.getItem("products");
        if (saved) setProducts(JSON.parse(saved));
    }, []);

    
    const saveChanges = () => {
        localStorage.setItem("products", JSON.stringify(products));
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
        if (!confirm("Delete this product?")) return;
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-5/6 max-h-[90vh] rounded-lg shadow-lg relative flex flex-col">
                
                {/* Header fixo */}
                <div className="p-8 border-b border-gray-200 flex items-center justify-normal gap-5 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold">Products Management</h2>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1"
                        onClick={handleAddProduct}
                    >
                        <Add fontSize="small" /> Add Product
                    </button>
                    <button
                        className="text-gray-600 hover:text-black absolute top-1 right-1"
                        onClick={onClose}
                    >
                        <Close />
                    </button>
                </div>

                {/* Conteúdo scrollável */}
                <div className="flex-1 overflow-auto p-6">

                <table className="w-full border border-gray-300 mb-10">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2 w-[10%]">Qnt.</th>
                        <th className="border p-2 w-[10%]">Unit</th>
                        <th className="border p-2">Prices</th>
                        <th className="border p-2 w-[20%]">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                        <td className="border p-2">
                            <input
                            className="border p-1 w-full"
                            value={p.name}
                            onChange={(e) =>
                                handleChangeProduct(p.id, "name", e.target.value)
                            }
                            />
                        </td>
                        <td className="border p-2">
                            <input
                            type="number"
                            className="border p-1 w-full"
                            value={p.quantity}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChangeProduct(p.id, "quantity", val === "" ? "" : Number(val));
                            }}
                            />
                        </td>
                        <td className="border p-1">
                            <UnitPicker 
                                abbvVersion 
                                unitState={p.unit}   
                                handleUnitChange={(e, value) => handleUnitChange(p.id, e, value)}
                            />
                        </td>
                        <td className="border p-2 align-top">
                            {p.prices.map((pr) => (
                            <div key={pr.id} className="flex gap-1 mt-1">
                                <input
                                placeholder="Description"
                                className="border rounded p-1 flex-1"
                                value={pr.description}
                                onChange={(e) =>
                                    handleChangePrice(p.id, pr.id, "description", e.target.value)
                                }
                                />
                                <input
                                type="number"
                                className="border rounded p-1 w-24"
                                value={pr.value}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleChangePrice(p.id, pr.id, "value", val === "" ? "" : Number(val))
                                }}
                                />
                                <button
                                className="bg-red-600 text-white rounded px-2"
                                onClick={() => handleDeletePrice(p.id, pr.id)}
                                >
                                <Delete fontSize="small" />
                                </button>
                            </div>
                            ))}
                        </td>
                        <td className="border p-2 text-center justify-center">
                            <button
                            className="bg-green-600 text-white p-2 rounded mr-1"
                            onClick={() => handleAddPrice(p.id)}
                            >
                            + Price
                            </button>
                            <button
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                            onClick={() => handleDeleteProduct(p.id)}
                            >
                            <Delete fontSize="small" />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* Footer fixo */}
                <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white z-10 flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={saveChanges}
                    sx={{ textTransform: "none" }}
                >
                    Save
                </Button>
                </div>

            </div>
        </div>

    );
};
