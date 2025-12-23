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
    <div className="w-full max-w-5xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 mb-6">
      <button
        onClick={onAddIngredient}
        className="bg-grape-600 hover:bg-grape-700 text-white px-4 py-2 rounded shadow"
      >
        {t("addIngredient")}
      </button>
      <div className="flex flex-wrap gap-3 text-sm justify-center sm:justify-end">
        <div className="bg-white border border-grape-200 rounded-md px-3 py-2 shadow-sm">
          <span className="text-grape-700">{t("totalIngredients")}:</span>{" "}
          <span className="font-semibold">{totalCount}</span>
        </div>
        <div className="bg-white border border-grape-200 rounded-md px-3 py-2 shadow-sm">
          <span className="text-grape-700">{t("totalCost")}:</span>{" "}
          <span className="font-semibold">
            {t("currencyPrefix")} {totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
