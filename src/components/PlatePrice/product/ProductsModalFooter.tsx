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
    <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-3 sm:px-6">
      {isDirty && <span className="mr-auto text-sm text-grape-700" role="status">{t("unsavedChanges")}</span>}
      <Button color="secondary" onClick={onClose}>{t("close")}</Button>
      <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
        {t("saveAndClose")}
      </Button>
    </div>
  );
};
