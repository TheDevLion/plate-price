// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./index.css";
import App from "./App.tsx";
import theme from "./theme";
import { I18nProvider } from "./i18n/I18nProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <I18nProvider>
      <App />
    </I18nProvider>
  </ThemeProvider>
  // <StrictMode>
  // </StrictMode>,
)
