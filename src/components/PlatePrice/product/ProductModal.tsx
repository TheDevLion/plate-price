import { useId, useState, type FormEvent } from "react";
import { Alert, Dialog, DialogContent } from "@mui/material";
import { ConfirmDialog } from "../../../design_system/ConfirmDialog";
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
    const { products: savedProducts, setProducts: commitProducts, saveProducts } = useProducts();
    const [products, setProducts] = useState(savedProducts);
    const [confirmDiscard, setConfirmDiscard] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string>();
    const [saveError, setSaveError] = useState(false);
    const titleId = useId();
    const isDirty = JSON.stringify(products) !== JSON.stringify(savedProducts);

    const handleClose = () => {
        if (isDirty) setConfirmDiscard(true);
        else onClose();
    };

    const saveChanges = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!saveProducts(products)) {
            setSaveError(true);
            return;
        }
        commitProducts(products);
        onClose();
    };

    const handleAddProduct = () => {
        const newProd: Product = makeProduct(getNextId(), "", 1, "", []);
        setProducts([...products, newProd])
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter((p) => productId(p) !== id));
        setProductToDelete(undefined);
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




    return (
        <>
            <Dialog
                open
                onClose={handleClose}
                fullWidth
                maxWidth="lg"
                aria-labelledby={titleId}
                slotProps={{ paper: { component: "form", onSubmit: saveChanges, sx: { m: { xs: 1, sm: 4 }, width: { xs: "calc(100% - 16px)", sm: "calc(100% - 64px)" }, maxHeight: "90dvh" } } }}
            >
                <ProductsModalHeader titleId={titleId} onAddProduct={handleAddProduct} onClose={handleClose} />
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                    {saveError && <Alert severity="error" sx={{ mb: 2 }}>{t("saveError")}</Alert>}
                    <ProductsTable
                        products={products}
                        onAddPrice={handleAddPrice}
                        onDeleteProduct={setProductToDelete}
                        onDeletePrice={handleDeletePrice}
                        onChangeProduct={handleChangeProduct}
                        onChangePrice={handleChangePrice}
                    />
                </DialogContent>
                <ProductsModalFooter onClose={handleClose} isDirty={isDirty} />
            </Dialog>
            <ConfirmDialog
                open={confirmDiscard}
                title={t("discardChangesTitle")}
                description={t("discardChangesDescription")}
                confirmLabel={t("discard")}
                noText
                onClose={() => setConfirmDiscard(false)}
                onConfirm={onClose}
            />
            <ConfirmDialog
                open={!!productToDelete}
                title={t("deleteProductConfirm")}
                description={products.find(product => productId(product) === productToDelete)?.[1]}
                noText
                onClose={() => setProductToDelete(undefined)}
                onConfirm={() => { if (productToDelete) handleDeleteProduct(productToDelete); }}
            />
        </>
    );
};
