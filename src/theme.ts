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
        },
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
