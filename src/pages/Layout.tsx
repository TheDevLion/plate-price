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
    <div className="min-h-screen flex flex-col">
      
      <nav className="bg-grape-50 shadow-md">
        <ul className="relative flex flex-col items-center gap-2 bg-gradient-to-br from-grape-500 to-ink px-3 py-2 sm:flex-row sm:justify-center">          
          <img src={tabIcon} className="w-[48px] sm:w-[60px]"/>
          <li>
            <Link
              to="/"
              className="text-white font-medium hover:text-grape-100 active:text-grape-200 transition-colors"
            >
              {t("appTitle")}
            </Link>
          </li>
          <li className="absolute left-3 top-2 sm:hidden">
            <button
              className="bg-grape-100 hover:bg-white text-ink p-1 rounded border border-grape-200 shadow-sm"
              onClick={toggleFullscreen}
              type="button"
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen"
            >
              <FullscreenIcon fontSize="small" />
            </button>
          </li>
          <li className="absolute right-3 top-2">
            <button
              className="bg-grape-100 hover:bg-white text-ink text-xs font-semibold px-2 py-1 rounded border border-grape-200 shadow-sm"
              onClick={toggleLanguage}
              type="button"
            >
              {language === "en" ? "PT" : "EN"}
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-2">
        <Outlet />
      </main>
    </div>
  );
};
