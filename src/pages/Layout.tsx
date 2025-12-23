import { Outlet, Link } from "react-router-dom";
import tabIcon from "../assets/tab-icon.svg";
import { useI18n } from "../i18n";

export const Layout = () => {
  const { t, language, toggleLanguage } = useI18n();

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
          <li className="sm:absolute sm:right-3">
            <button
              className="bg-ink hover:bg-black text-white text-xs font-semibold px-2 py-1 rounded"
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
