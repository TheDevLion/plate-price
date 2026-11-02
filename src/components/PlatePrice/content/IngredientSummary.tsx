import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useI18n } from "../../../i18n/useI18n";

type IngredientSummaryProps = {
  totalCount: number;
  totalCost: number;
  onAddIngredient: () => void;
};

export const IngredientSummary = ({
  totalCount,
  totalCost,
  onAddIngredient,
}: IngredientSummaryProps) => {
  const { t } = useI18n();

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <Button variant="contained" startIcon={<Add />} onClick={onAddIngredient}>
        {t("addIngredient")}
      </Button>
      <div className="flex flex-wrap items-center gap-6">
        <div className="text-sm text-grape-700">
          {t("totalIngredients")}: <span className="font-semibold tabular-nums text-ink">{totalCount}</span>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-grape-700">{t("totalCost")}</div>
          <div className="text-2xl font-semibold tabular-nums text-ink">{t("currencyPrefix")} {totalCost.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
