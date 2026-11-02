import { Outlet, Link } from "react-router-dom";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import tabIcon from "../assets/tab-icon.svg";
import { useI18n } from "../i18n/useI18n";

export const Layout = () => {
  const { t, language, toggleLanguage } = useI18n();

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.documentElement.requestFullscreen();
  };

  return (
    <div className="min-h-dvh flex flex-col sm:min-h-screen">
      
      <nav className="bg-grape-50 shadow-md">
        <ul className="relative flex items-center gap-2 bg-gradient-to-br from-grape-500 to-ink px-3 py-2 sm:justify-center">
          {document.fullscreenEnabled && (
            <li className="shrink-0 sm:hidden">
              <button
                className="min-h-11 min-w-11 bg-grape-100 hover:bg-white text-ink p-1 rounded border border-grape-200 shadow-sm"
                onClick={toggleFullscreen}
                type="button"
                aria-label={t("toggleFullscreen")}
                title={t("toggleFullscreen")}
              >
                <FullscreenIcon fontSize="small" />
              </button>
            </li>
          )}
          <li className="shrink-0"><img src={tabIcon} alt="" className="w-8 sm:w-[60px]" /></li>
          <li className="min-w-0 flex-1 sm:flex-none">
            <Link
              to="/"
              className="text-white font-medium hover:text-grape-100 active:text-grape-200 transition-colors"
            >
              {t("appTitle")}
            </Link>
          </li>
          <li className="shrink-0 sm:absolute sm:right-3 sm:top-2">
            <button
              className="min-h-11 min-w-11 bg-grape-100 hover:bg-white text-ink text-xs font-semibold px-2 py-1 rounded border border-grape-200 shadow-sm sm:min-h-0 sm:min-w-0"
              onClick={toggleLanguage}
              type="button"
              aria-label={language === "en" ? "Mudar para português" : "Switch to English"}
            >
              {language === "en" ? "PT" : "EN"}
            </button>
          </li>
        </ul>
      </nav>

      <main className="min-w-0 flex-1 sm:p-2">
        <Outlet />
      </main>
    </div>
  );
};
