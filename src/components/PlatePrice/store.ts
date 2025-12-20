import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { STORE_APP_KEYS } from "../../constants";

//----------------      Basic Types
export type TechnicalDatasheetRecord = {
    id: string,
    name: string
}

export type Product = {
  id: string;
  name: string;
  quantity: number | "";
  unit: string;
  prices: ProductPrice[];
};

export type ProductPrice = {
    id: string;
    description: string;
    value: number | "";
}

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
}

export type TechnicalDatasheetStore = TechnicalDatasheetState & TechnicalDatasheetActions;


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
        localStorage.setItem(STORE_APP_KEYS.receipts, JSON.stringify(datasheets));
        return newState
    }),
    setProducts: (products: Product[]) => set((state) => ({...state, products })),
    setIngredients: (ingredients: Ingredient[]) => set((state) => ({...state, ingredients }))
}));



//----------------      Selectors and Hooks
export const selectSelectedSheet = ({ selectedSheet, setSelectedSheet }: TechnicalDatasheetStore) => ({ selectedSheet, setSelectedSheet })
export const useSelectedSheet = () => useTechnicalDatasheetStore(useShallow(selectSelectedSheet))

export const selectDatasheets = ({ datasheets, setDatasheets }: TechnicalDatasheetStore) => ({datasheets, setDatasheets})
export const useDatasheets = () => useTechnicalDatasheetStore(useShallow(selectDatasheets))

export const selectProducts = ({ products, setProducts }: TechnicalDatasheetStore) => ({products, setProducts})
export const useProducts = () => useTechnicalDatasheetStore(useShallow(selectProducts))

export const selectIngredients = ({ ingredients, setIngredients }: TechnicalDatasheetStore) => ({ingredients, setIngredients})
export const useIngredients = () => useTechnicalDatasheetStore(useShallow(selectIngredients))