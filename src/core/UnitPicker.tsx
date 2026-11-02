import { ListSubheader, MenuItem, Select } from "@mui/material";
import { CONVERSIONS } from "../constants";
import { useI18n } from "../i18n/useI18n";

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
    <Select
      fullWidth
      size="small"
      displayEmpty
      disabled={disabled}
      value={selectedUnit?.abbv ?? ""}
      onChange={event => onChange(event.target.value)}
      inputProps={{ "aria-label": t("tableUnit") }}
      renderValue={value => value ? value.replace("_", " ") : <span className="text-grape-700">{t("selectOption")}</span>}
      MenuProps={{
        slotProps: {
          paper: { sx: { maxHeight: 320, minWidth: 220, maxWidth: "calc(100vw - 32px)" } },
        },
      }}
    >
      {units.flatMap((unit, index) => [
        ...(!index || units[index - 1].category !== unit.category
          ? [<ListSubheader key={unit.category}>{t(unit.category as "volume" | "weight" | "random")}</ListSubheader>]
          : []),
        <MenuItem key={unit.abbv} value={unit.abbv}>
          <span className="w-12 shrink-0 font-semibold">{unit.abbv.replace("_", " ")}</span>
          <span>{unit.name}</span>
        </MenuItem>,
      ])}
    </Select>
  );
};
