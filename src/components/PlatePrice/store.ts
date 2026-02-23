import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { STORE_APP_KEYS } from "../../constants";
import { loadFromStorage, saveToStorage } from "../../core/storage";

//----------------      Basic Types
export type TechnicalDatasheetRecord = [string, string];
export const makeReceipt = (id: string, name: string): TechnicalDatasheetRecord => [id, name];
export const receiptId = (receipt: TechnicalDatasheetRecord) => receipt[0];
export const receiptName = (receipt: TechnicalDatasheetRecord) => receipt[1];

export type ProductPrice = [string, string, number | ""];
export const makePrice = (id: string, description: string, value: number | ""): ProductPrice => [
  id,
  description,
  value,
];
export const priceId = (price: ProductPrice) => price[0];
export const priceDescription = (price: ProductPrice) => price[1];
export const priceValue = (price: ProductPrice) => price[2];

export type Product = [string, string, number | "", string, ProductPrice[]];
export const makeProduct = (
  id: string,
  name: string,
  quantity: number | "",
  unit: string,
  prices: ProductPrice[]
): Product => [id, name, quantity, unit, prices];
export const productId = (product: Product) => product[0];
export const productName = (product: Product) => product[1];
export const productQuantity = (product: Product) => product[2];
export const productUnit = (product: Product) => product[3];
export const productPrices = (product: Product) => product[4];

export type Ingredient = {
  id: string;
  productId: string;
  priceId: string;
  quantity: number | "";
  unit: string;
  datasheetId: string;
};


//----------------      Store Types
export type TechnicalDatasheetState = {
    selectedSheet?: string;
    datasheets: TechnicalDatasheetRecord[];
    products: Product[];
    ingredients: Ingredient[];
}

export type TechnicalDatasheetActions = {
    setSelectedSheet: (sheetId?: Partial<TechnicalDatasheetState['selectedSheet']> ) => void;
    setDatasheets: (datasheets: TechnicalDatasheetRecord[]) => void;
    setProducts: (products: Product[]) => void;
    setIngredients: (ingredients: Ingredient[]) => void;
    loadDatasheets: () => void;
    loadProducts: () => void;
    loadIngredients: () => void;
    saveProducts: (products: Product[]) => void;
    saveIngredients: (ingredients: Ingredient[]) => void;
}

export type TechnicalDatasheetStore = TechnicalDatasheetState & TechnicalDatasheetActions;

const decodeReceipts = (raw: unknown): TechnicalDatasheetRecord[] =>
  Array.isArray(raw) ? (raw as TechnicalDatasheetRecord[]) : [];


//----------------      Store
export const initialStore: TechnicalDatasheetState = {
    selectedSheet: undefined,
    datasheets: [],
    products: [],
    ingredients: [],
}

export const useTechnicalDatasheetStore = create<TechnicalDatasheetStore>()((set) => ({
    ...initialStore,
    setSelectedSheet: (sheetId?: string) => set((state) => ({...state, selectedSheet: sheetId})),
    setDatasheets: (datasheets: TechnicalDatasheetRecord[]) => set((state) => {
        const newState = {...state, datasheets }
        saveToStorage(STORE_APP_KEYS.receipts, datasheets);
        return newState
    }),
    setProducts: (products: Product[]) => set((state) => ({...state, products })),
    setIngredients: (ingredients: Ingredient[]) => set((state) => ({...state, ingredients })),
    loadDatasheets: () => set((state) => ({
        ...state,
        datasheets: decodeReceipts(loadFromStorage<unknown>(STORE_APP_KEYS.receipts, [])),
    })),
    loadProducts: () => set((state) => ({
        ...state,
        products: loadFromStorage<Product[]>(STORE_APP_KEYS.products, []),
    })),
    loadIngredients: () => set((state) => ({
        ...state,
        ingredients: loadFromStorage<Ingredient[]>(STORE_APP_KEYS.ingredients, []),
    })),
    saveProducts: (products: Product[]) => saveToStorage(STORE_APP_KEYS.products, products),
    saveIngredients: (ingredients: Ingredient[]) => saveToStorage(STORE_APP_KEYS.ingredients, ingredients),
}));



//----------------      Selectors and Hooks
export const selectSelectedSheet = ({ selectedSheet, setSelectedSheet }: TechnicalDatasheetStore) => ({ selectedSheet, setSelectedSheet })
export const useSelectedSheet = () => useTechnicalDatasheetStore(useShallow(selectSelectedSheet))

export const selectDatasheets = ({ datasheets, setDatasheets, loadDatasheets }: TechnicalDatasheetStore) => ({
  datasheets,
  setDatasheets,
  loadDatasheets,
})
export const useDatasheets = () => useTechnicalDatasheetStore(useShallow(selectDatasheets))

export const selectProducts = ({ products, setProducts, loadProducts, saveProducts }: TechnicalDatasheetStore) => ({
  products,
  setProducts,
  loadProducts,
  saveProducts,
})
export const useProducts = () => useTechnicalDatasheetStore(useShallow(selectProducts))

export const selectIngredients = ({ ingredients, setIngredients, loadIngredients, saveIngredients }: TechnicalDatasheetStore) => ({
  ingredients,
  setIngredients,
  loadIngredients,
  saveIngredients,
})
export const useIngredients = () => useTechnicalDatasheetStore(useShallow(selectIngredients))
