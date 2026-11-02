import { Close, Add } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useI18n } from "../../../i18n/useI18n";

type ProductsModalHeaderProps = {
  titleId: string;
  onAddProduct: () => void;
  onClose: () => void;
};

export const ProductsModalHeader = ({ titleId, onAddProduct, onClose }: ProductsModalHeaderProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
      <h2 id={titleId} className="min-w-0 flex-1 text-xl font-semibold">{t("productsManagement")}</h2>
      <IconButton onClick={onClose} aria-label={t("close")} sx={{ order: { sm: 1 } }}>
        <Close />
      </IconButton>
      <Button variant="outlined" startIcon={<Add />} onClick={onAddProduct} sx={{ width: { xs: "100%", sm: "auto" } }}>
        {t("addProduct")}
      </Button>
    </div>
  );
};
