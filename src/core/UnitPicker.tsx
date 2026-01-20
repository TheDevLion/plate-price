import Autocomplete from "@mui/material/Autocomplete";
import { CONVERSIONS } from "../constants";
import TextField from "@mui/material/TextField";
import { Popper, type PopperProps } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


const CustomPopper = (props: PopperProps) => (
  <Popper
    {...props}
    modifiers={[
      {
        name: "offset",
        options: {
          offset: [0, 5], // deslocamento vertical do menu
        },
      },
    ]}
    sx={{
      width: "30% !important", // força largura personalizada
      zIndex: 1300, // mantém o popper acima de modais se necessário
    }}
  />
);

export type Option = {
  title: string;
  abbv: string;
  category: string;
};

type UnitPickerProps = {
    unitState?: string;
    category?: string;
    handleUnitChange?:  (_: React.SyntheticEvent<Element, Event>, value: Option | null) => void;
    abbvVersion: boolean;
}
export const UnitPicker = ({unitState, category, handleUnitChange, abbvVersion} : UnitPickerProps) => {
    const buildAutocompleteOptions = (): Option[] => {
        let units = CONVERSIONS;

        if (category) {
            // filtro por categoria do produto
            units = units.filter(u => u.category === category);
        }

        // mantém unitState disponível para conversão direta
        const selectedUnitObj = CONVERSIONS.find(c => c.abbv === unitState);
        if (selectedUnitObj && !units.some(u => u.abbv === selectedUnitObj.abbv)) {
            // se a unidade selecionada não está no filtro de categoria, adiciona no topo
            units = [selectedUnitObj, ...units];
        }

        return units.map(unit => ({
            title:  `(${unit.abbv.replace("_", " ")}) - ${unit.name}`,
            abbv: unit.abbv,
            category: unit.category
        }));
    };


    const options = buildAutocompleteOptions();
    const selectedUnitOption = options.find(o => o.abbv === unitState) || null;
    
    return <Autocomplete
                onChange={handleUnitChange}
                options={options}
                groupBy={(option: Option) => option.category}
                getOptionLabel={(option) => option.abbv.replace("_", " ")}
                value={selectedUnitOption}
                renderInput={(params) => <TextField 
                    {...params}
                    />}
                renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    return <li
                        key={key}
                        {...rest} 
                        className="px-3 py-2 text-xs cursor-pointer hover:bg-grape-100">
                        {option.title}
                    </li>;
                }}
                className="w-[100%]"
                popupIcon={abbvVersion ? null : <ArrowDropDownIcon />}
                PopperComponent={CustomPopper}
                sx={{
                    // ===== Label =====
                    "& .MuiInputLabel-root": {
                        top: "50%",
                        transform: "translate(12px, -50%)", // centraliza verticalmente quando vazio
                        transition: "all 0.2s ease-in-out",
                        pointerEvents: "none",
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                        transform: "translate(12px, -9px) scale(0.75)", // sobe quando há valor/foco
                    },

                    // ===== Input =====
                    "& .MuiOutlinedInput-input": {
                        paddingTop: "0",   // remove o padding extra
                        paddingBottom: "0",
                        height: "1.4375em", // altura padrão do texto MUI
                        display: "flex",
                        alignItems: "center", // texto centralizado verticalmente
                    },

                    // ===== Container =====
                    "& .MuiOutlinedInput-root": {
                        alignItems: "center",
                        padding: 0,
                        paddingRight: abbvVersion ? "0 !important" : undefined,
                        "& fieldset": {
                            borderColor: "#d3b8ff",
                        },
                        "&:hover fieldset": {
                            borderColor: "#b089ff",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#7438f0",
                        },
                    },
                }}
                ListboxProps={{
                    style: {
                    backgroundColor: "#fff",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    padding: "0.25rem 0",
                    fontSize: "0.85rem",
                    color: "#351b74",
                    },
                }}
                
            />
}
