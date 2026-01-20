import { Close, Add } from "@mui/icons-material";
import { useI18n } from "../../../i18n/useI18n";

type ProductsModalHeaderProps = {
  onAddProduct: () => void;
  onClose: () => void;
};

export const ProductsModalHeader = ({
  onAddProduct,
  onClose,
}: ProductsModalHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="p-6 sm:p-8 border-b border-grape-200 flex flex-col sm:flex-row sm:items-center justify-normal gap-3 sm:gap-5 sticky top-0 bg-white z-10">
      <h2 className="text-2xl font-bold">{t("productsManagement")}</h2>
      <button
        className="bg-grape-600 hover:bg-grape-700 text-white px-3 py-1 rounded flex items-center gap-1"
        onClick={onAddProduct}
      >
        <Add fontSize="small" /> {t("addProduct")}
      </button>
      <button
        className="text-ink-soft hover:text-ink absolute top-1 right-1"
        onClick={onClose}
      >
        <Close />
      </button>
    </div>
  );
};
