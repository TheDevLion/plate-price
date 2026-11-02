import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7438f0",
      light: "#8f5cff",
      dark: "#5f2ad3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0b0b0f",
      light: "#1b1b24",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f6f0ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0b0b0f",
      secondary: "#351b74",
    },
    divider: "#e3d7ff",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        color: "primary",
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 44,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: 44, minHeight: 44 },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: { "@media (max-width: 639px), (pointer: coarse)": { fontSize: "1rem" } },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "@media (max-width: 639px), (pointer: coarse)": {
            "& .MuiAutocomplete-input": { minWidth: 0 },
            "& .MuiAutocomplete-endAdornment": { right: 4 },
            "&.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root": { paddingRight: 52 },
            "&.MuiAutocomplete-hasClearIcon.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root": { paddingRight: 96 },
          },
        },
        listbox: {
          maxHeight: 320,
          "@media (max-width: 639px), (max-height: 480px)": { maxHeight: "min(320px, 40dvh)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 44,
          fontSize: "0.875rem",
          backgroundColor: theme.palette.background.paper,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { minHeight: 44, fontSize: "0.875rem", "@media (min-width: 600px)": { minHeight: 44 } },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
