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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
      <Button variant="contained" startIcon={<Add />} onClick={onAddIngredient}>
        {t("addIngredient")}
      </Button>
      <div className="grid grid-cols-2 items-center gap-3 sm:flex sm:flex-wrap sm:gap-6">
        <div className="min-w-0 text-sm text-grape-700">
          {t("totalIngredients")}: <span className="font-semibold tabular-nums text-ink">{totalCount}</span>
        </div>
        <div className="min-w-0 text-right">
          <div className="text-xs font-medium text-grape-700">{t("totalCost")}</div>
          <div className="break-words text-xl font-semibold tabular-nums text-ink sm:text-2xl">{t("currencyPrefix")} {totalCost.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
