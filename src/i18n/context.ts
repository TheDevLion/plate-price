import { createContext } from "react";

export const STORAGE_KEY = "uiLanguage";

export const translations = {
  en: {
    appTitle: "Plate Price",
    headerTitle: "Technical Datasheet",
    selectRecipePlaceholder: "Select a recipe",
    recipeName: "Recipe name",
    addRecipe: "Add recipe",
    editRecipe: "Edit recipe",
    deleteRecipe: "Delete recipe",
    confirmAddTitle: "New recipe",
    confirmEditTitle: "Rename recipe",
    confirmDeleteTitle: "Are you sure you want to delete this recipe?",
    shareTooltip: "Share this datasheet",
    share: "Share",
    copied: "Copied!",
    manageProducts: "Manage Products",
    selectDatasheetFirst: "Select a technical datasheet first.",
    addIngredient: "Add ingredient",
    totalIngredients: "Total ingredients",
    totalCost: "Total cost",
    currencyPrefix: "$",
    emptyIngredientsTitle: "No ingredients yet",
    emptyIngredientsDescription:
      "Add products first, then click Add Ingredient to start this datasheet.",
    tableProduct: "Product",
    tablePriceDescription: "Price/Description",
    tableQuantity: "Qtd.",
    tableUnit: "Unit",
    tableTotal: "Total",
    tableActions: "Actions",
    selectProduct: "Select product",
    searchProduct: "Search products",
    noProductsFound: "No products found",
    clearSelection: "Clear selection",
    selectOption: "Select option",
    searchUnit: "Search",
    noUnitsFound: "No units found",
    delete: "Delete",
    productsManagement: "Products Management",
    addProduct: "Add Product",
    deleteProductConfirm: "Delete this product?",
    tableName: "Name",
    tableQtyShort: "Qnt.",
    tablePrices: "Prices",
    description: "Description",
    addPrice: "Add price",
    save: "Save",
    cancel: "Cancel",
    ok: "OK",
    languageToggle: "EN/PT",
    close: "Close",
    discard: "Discard changes",
    discardChangesTitle: "Discard unsaved changes?",
    discardChangesDescription: "Your product changes have not been saved.",
    unsavedChanges: "Unsaved changes",
    saveAndClose: "Save and close",
    saveError: "Could not save on this device. Keep this window open and try again.",
    emptyProductsTitle: "No products yet",
    emptyProductsDescription: "Add a product, its package size and a purchase price.",
    emptyPrices: "Add a purchase price to use this product in a recipe.",
    deleteProduct: "Delete product",
    deletePrice: "Delete price",
    priceValue: "Price",
    volume: "Volume",
    weight: "Weight",
    random: "Other units",
  },
  pt: {
    appTitle: "Plate Price",
    headerTitle: "Ficha Técnica",
    selectRecipePlaceholder: "Selecionar ficha",
    recipeName: "Nome da ficha",
    addRecipe: "Adicionar ficha",
    editRecipe: "Editar ficha",
    deleteRecipe: "Excluir ficha",
    confirmAddTitle: "Nova ficha",
    confirmEditTitle: "Renomear ficha",
    confirmDeleteTitle: "Excluir esta ficha?",
    shareTooltip: "Compartilhar esta ficha",
    share: "Compartilhar",
    copied: "Copiado!",
    manageProducts: "Gerenciar Produtos",
    selectDatasheetFirst: "Selecione uma ficha técnica primeiro.",
    addIngredient: "Adicionar ingrediente",
    totalIngredients: "Total de ingredientes",
    totalCost: "Custo total",
    currencyPrefix: "R$",
    emptyIngredientsTitle: "Nenhum ingrediente ainda",
    emptyIngredientsDescription:
      "Adicione produtos primeiro e depois clique em Adicionar Ingrediente.",
    tableProduct: "Produto",
    tablePriceDescription: "Preço / descrição",
    tableQuantity: "Qtd.",
    tableUnit: "Unidade",
    tableTotal: "Total",
    tableActions: "Ações",
    selectProduct: "Selecionar produto",
    searchProduct: "Buscar produto",
    noProductsFound: "Nenhum produto encontrado",
    clearSelection: "Limpar seleção",
    selectOption: "Selecionar opção",
    searchUnit: "Buscar",
    noUnitsFound: "Nenhuma unidade encontrada",
    delete: "Excluir",
    productsManagement: "Gerenciamento de Produtos",
    addProduct: "Adicionar Produto",
    deleteProductConfirm: "Excluir este produto?",
    tableName: "Nome",
    tableQtyShort: "Qtd.",
    tablePrices: "Preços",
    description: "Descrição",
    addPrice: "Adicionar preço",
    save: "Salvar",
    cancel: "Cancelar",
    ok: "OK",
    languageToggle: "PT/EN",
    close: "Fechar",
    discard: "Descartar alterações",
    discardChangesTitle: "Descartar alterações não salvas?",
    discardChangesDescription: "As alterações nos produtos ainda não foram salvas.",
    unsavedChanges: "Alterações não salvas",
    saveAndClose: "Salvar e fechar",
    saveError: "Não foi possível salvar neste dispositivo. Mantenha esta janela aberta e tente novamente.",
    emptyProductsTitle: "Nenhum produto cadastrado",
    emptyProductsDescription: "Adicione um produto, a quantidade da embalagem e um preço de compra.",
    emptyPrices: "Adicione um preço de compra para usar este produto na ficha.",
    deleteProduct: "Excluir produto",
    deletePrice: "Excluir preço",
    priceValue: "Preço",
    volume: "Volume",
    weight: "Peso",
    random: "Outras unidades",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

export const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "pt") return stored;
  const browserLanguage = window.navigator.language.toLowerCase();
  return browserLanguage.startsWith("pt") ? "pt" : "en";
};

