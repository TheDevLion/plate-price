import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useI18n } from "../../../i18n/useI18n";

type ProductsModalFooterProps = {
  onClose: () => void;
  isDirty: boolean;
};

export const ProductsModalFooter = ({ onClose, isDirty }: ProductsModalFooterProps) => {
  const { t } = useI18n();

  return (
    <div className="product-modal-footer grid shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2 px-4 py-3 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:px-6">
      {isDirty && <span className="col-span-2 mr-auto text-sm text-grape-700" role="status">{t("unsavedChanges")}</span>}
      <Button color="secondary" onClick={onClose}>{t("close")}</Button>
      <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
        {t("saveAndClose")}
      </Button>
    </div>
  );
};
