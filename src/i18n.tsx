import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "uiLanguage";

const translations = {
  en: {
    appTitle: "Plate Price",
    headerTitle: "Technical Datasheet",
    selectReceiptPlaceholder: "-- Select Receipt --",
    addReceipt: "Add receipt",
    editReceipt: "Edit receipt",
    deleteReceipt: "Delete receipt",
    confirmAddTitle: "Enter the name for the new receipt:",
    confirmEditTitle: "Enter the new name for the receipt:",
    confirmDeleteTitle: "Are you sure you want to delete this receipt?",
    shareTooltip: "Share this datasheet",
    share: "Share",
    copied: "Copied!",
    manageProducts: "Manage Products",
    selectDatasheetFirst: "Select a technical datasheet first.",
    addIngredient: "+ Add Ingredient",
    totalIngredients: "Total ingredients",
    totalCost: "Total cost",
    currencyPrefix: "$",
    tableProduct: "Product",
    tablePriceDescription: "Price/Description",
    tableQuantity: "Qtd.",
    tableUnit: "Unit",
    tableTotal: "Total",
    tableActions: "Actions",
    selectProduct: "Select product",
    selectOption: "Select option",
    delete: "Delete",
    productsManagement: "Products Management",
    addProduct: "Add Product",
    deleteProductConfirm: "Delete this product?",
    tableName: "Name",
    tableQtyShort: "Qnt.",
    tablePrices: "Prices",
    description: "Description",
    addPrice: "+ Price",
    save: "Save",
    cancel: "Cancel",
    ok: "OK",
    languageToggle: "EN/PT",
  },
  pt: {
    appTitle: "Plate Price",
    headerTitle: "Ficha Técnica",
    selectReceiptPlaceholder: "-- Selecionar ficha --",
    addReceipt: "Adicionar ficha",
    editReceipt: "Editar ficha",
    deleteReceipt: "Excluir ficha",
    confirmAddTitle: "Digite o nome da nova ficha:",
    confirmEditTitle: "Digite o novo nome da ficha:",
    confirmDeleteTitle: "Tem certeza que deseja excluir esta ficha ?",
    shareTooltip: "Compartilhar esta ficha",
    share: "Compartilhar",
    copied: "Copiado!",
    manageProducts: "Gerenciar Produtos",
    selectDatasheetFirst: "Selecione uma ficha técnica primeiro.",
    addIngredient: "+ Adicionar Ingrediente",
    totalIngredients: "Total de ingredientes",
    totalCost: "Custo total",
    currencyPrefix: "R$",
    tableProduct: "Produto",
    tablePriceDescription: "Preco/Descricao",
    tableQuantity: "Qtd.",
    tableUnit: "Unidade",
    tableTotal: "Total",
    tableActions: "Ações",
    selectProduct: "Selecionar produto",
    selectOption: "Selecionar opção",
    delete: "Excluir",
    productsManagement: "Gerenciamento de Produtos",
    addProduct: "Adicionar Produto",
    deleteProductConfirm: "Excluir este produto?",
    tableName: "Nome",
    tableQtyShort: "Qtd.",
    tablePrices: "Precos",
    description: "Descricao",
    addPrice: "+ Preco",
    save: "Salvar",
    cancel: "Cancelar",
    ok: "OK",
    languageToggle: "PT/EN",
  },
} as const;

export type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "pt") return stored;
  const browserLanguage = window.navigator.language.toLowerCase();
  return browserLanguage.startsWith("pt") ? "pt" : "en";
};

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

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
