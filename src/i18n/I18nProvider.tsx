import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  I18nContext,
  STORAGE_KEY,
  getInitialLanguage,
  translations,
  type Language,
  type TranslationKey,
} from "./context";

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  };

  const toggleLanguage = () =>
    setLanguage(language === "en" ? "pt" : "en");

  const t = useMemo(() => {
    return (key: TranslationKey) =>
      translations[language][key] ?? translations.en[key] ?? key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
