import type {
  Ingredient,
  Product,
  ProductPrice,
  TechnicalDatasheetRecord,
} from "../components/PlatePrice/store";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string =>
  value == null ? "" : String(value);

const asQuantity = (value: unknown): number | "" => {
  if (value === "" || value == null) return "";
  const parsed = Number(value);
  return Number.isNaN(parsed) ? "" : parsed;
};

export const decodePrice = (raw: unknown): ProductPrice | null => {
  if (Array.isArray(raw)) {
    return [asString(raw[0]), asString(raw[1]), asQuantity(raw[2])];
  }
  if (isRecord(raw)) {
    return [asString(raw.id), asString(raw.description), asQuantity(raw.value)];
  }
  return null;
};

export const decodeProduct = (raw: unknown): Product | null => {
  if (Array.isArray(raw)) {
    const pricesRaw = Array.isArray(raw[4]) ? raw[4] : [];
    return [
      asString(raw[0]),
      asString(raw[1]),
      asQuantity(raw[2]),
      asString(raw[3]),
      pricesRaw
        .map(decodePrice)
        .filter((price): price is ProductPrice => price !== null),
    ];
  }
  if (isRecord(raw)) {
    const pricesRaw = Array.isArray(raw.prices) ? raw.prices : [];
    return [
      asString(raw.id),
      asString(raw.name),
      asQuantity(raw.quantity),
      asString(raw.unit),
      pricesRaw
        .map(decodePrice)
        .filter((price): price is ProductPrice => price !== null),
    ];
  }
  return null;
};

export const decodeProducts = (raw: unknown): Product[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(decodeProduct)
    .filter((product): product is Product => product !== null);
};

export const decodeIngredient = (raw: unknown): Ingredient | null => {
  if (Array.isArray(raw)) {
    return [
      asString(raw[0]),
      asString(raw[1]),
      asString(raw[2]),
      asQuantity(raw[3]),
      asString(raw[4]),
      asString(raw[5]),
    ];
  }
  if (isRecord(raw)) {
    return [
      asString(raw.id),
      asString(raw.productId),
      asString(raw.priceId),
      asQuantity(raw.quantity),
      asString(raw.unit),
      asString(raw.datasheetId),
    ];
  }
  return null;
};

export const decodeIngredients = (raw: unknown): Ingredient[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(decodeIngredient)
    .filter((ingredient): ingredient is Ingredient => ingredient !== null);
};

export const decodeRecipe = (raw: unknown): TechnicalDatasheetRecord | null => {
  if (Array.isArray(raw)) {
    return [asString(raw[0]), asString(raw[1])];
  }
  if (isRecord(raw)) {
    return [asString(raw.id), asString(raw.name)];
  }
  return null;
};

export const decodeRecipes = (raw: unknown): TechnicalDatasheetRecord[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(decodeRecipe)
    .filter((recipe): recipe is TechnicalDatasheetRecord => recipe !== null);
};
