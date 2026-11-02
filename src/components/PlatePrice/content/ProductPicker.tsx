import { Autocomplete, TextField } from "@mui/material";
import { productId, productName, type Product } from "../store";
import { useI18n } from "../../../i18n/useI18n";

type ProductPickerProps = {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
  id?: string;
};

export const ProductPicker = ({ products, value, onChange, id }: ProductPickerProps) => {
  const { t } = useI18n();

  return (
    <Autocomplete
      id={id}
      fullWidth
      size="small"
      openOnFocus
      selectOnFocus
      autoHighlight
      blurOnSelect="touch"
      options={products}
      value={products.find(product => productId(product) === value) ?? null}
      getOptionLabel={productName}
      getOptionKey={productId}
      isOptionEqualToValue={(option, selected) => productId(option) === productId(selected)}
      onChange={(_, product) => onChange(product ? productId(product) : "")}
      openText={t("selectProduct")}
      closeText={t("close")}
      clearText={t("clearSelection")}
      noOptionsText={t("noProductsFound")}
      slotProps={{
        popper: { modifiers: [{ name: "preventOverflow", options: { padding: 12 } }] },
        listbox: { sx: { "& .MuiAutocomplete-option": { minHeight: 44, overflowWrap: "anywhere" } } },
      }}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={t("searchProduct")}
          slotProps={{ htmlInput: { ...params.inputProps, "aria-label": t("tableProduct") } }}
        />
      )}
    />
  );
};
