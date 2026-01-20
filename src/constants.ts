export const STORE_APP_KEYS = {
  receipts: "receipts",
  products: "products",
  ingredients: "ingredients"
};

export const CONVERSIONS = [
  // Volume
  { name: "Fluid Ounce", abbv: "fl_oz", conv_rate: 1, category: "volume" },
  { name: "Gallon", abbv: "gal", conv_rate: 128, category: "volume" },
  { name: "Milliliter", abbv: "mL", conv_rate: 0.0338140227, category: "volume" },
  { name: "Liter", abbv: "L", conv_rate: 33.8140227, category: "volume" },
  { name: "Quart", abbv: "qt", conv_rate: 32, category: "volume" },
  { name: "Tablespoon", abbv: "tbsp", conv_rate: 0.5, category: "volume" },

  // Weight
  { name: "Gram", abbv: "g", conv_rate: 1, category: "weight" },
  { name: "Kilogram", abbv: "Kg", conv_rate: 1000, category: "weight" },
  { name: "Milligram", abbv: "mg", conv_rate: 0.001, category: "weight" },
  { name: "Ounce", abbv: "oz", conv_rate: 28.3495, category: "weight" },
  { name: "Pound", abbv: "lb", conv_rate: 453.592, category: "weight" },

  // Random
  { name: "Box", abbv: "box", conv_rate: 1, category: "random"},
  { name: "Unit", abbv: "unit", conv_rate: 1, category: "random"},
];

