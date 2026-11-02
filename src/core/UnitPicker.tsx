import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { CONVERSIONS } from "../constants";
import { useI18n } from "../i18n/useI18n";

type Unit = (typeof CONVERSIONS)[number];
const filterUnits = createFilterOptions<Unit>({
  stringify: unit => `${unit.abbv.replace("_", " ")} ${unit.name}`,
  trim: true,
});

type UnitPickerProps = {
  unitState?: string;
  category?: string;
  onChange: (unit: string) => void;
  disabled?: boolean;
};

export const UnitPicker = ({ unitState = "", category, onChange, disabled }: UnitPickerProps) => {
  const { t } = useI18n();
  // mantém unitState disponível para conversão direta
  const units = CONVERSIONS.filter(unit => !category || unit.category === category || unit.abbv === unitState);
  const selectedUnit = units.find(unit => unit.abbv === unitState);

  return (
    <Autocomplete<Unit, false, boolean>
      fullWidth
      size="small"
      openOnFocus
      selectOnFocus
      autoHighlight
      disableClearable
      blurOnSelect="touch"
      disabled={disabled}
      options={units}
      value={selectedUnit ?? null}
      onChange={(_, unit) => { if (unit) onChange(unit.abbv); }}
      getOptionLabel={unit => unit.abbv.replace("_", " ")}
      isOptionEqualToValue={(option, value) => option.abbv === value.abbv}
      filterOptions={filterUnits}
      groupBy={unit => t(unit.category as "volume" | "weight" | "random")}
      openText={t("selectOption")}
      closeText={t("close")}
      noOptionsText={t("noUnitsFound")}
      slotProps={{
        popper: { style: { minWidth: 220, maxWidth: "calc(100vw - 32px)" } },
        listbox: { sx: { maxHeight: 320, "& .MuiAutocomplete-option": { minHeight: 44 }, "& .MuiAutocomplete-groupLabel": { position: "static" } } },
      }}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={t("searchUnit")}
          slotProps={{ htmlInput: { ...params.inputProps, "aria-label": t("tableUnit") } }}
        />
      )}
      renderOption={(props, unit) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <span className="w-12 shrink-0 font-semibold">{unit.abbv.replace("_", " ")}</span>
            <span>{unit.name}</span>
          </li>
        );
      }}
    />
  );
};
