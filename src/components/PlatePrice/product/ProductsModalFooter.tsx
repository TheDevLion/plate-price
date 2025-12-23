import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useI18n } from "../../../i18n/useI18n";

type ProductsModalFooterProps = {
  onSave: () => void;
};

export const ProductsModalFooter = ({ onSave }: ProductsModalFooterProps) => {
  const { t } = useI18n();

  return (
    <div className="p-4 sm:p-6 border-t border-grape-200 sticky bottom-0 bg-white z-10 flex justify-end">
      <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
        {t("save")}
      </Button>
    </div>
  );
};
