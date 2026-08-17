import { describe, expect, it } from "vitest";
import {
  decodeIngredient,
  decodeIngredients,
  decodePrice,
  decodeProduct,
  decodeProducts,
  decodeRecipe,
  decodeRecipes,
} from "./decode_store";

describe("decode_store", () => {
  it("converts legacy object products into tuples with prices", () => {
    const products = decodeProducts([
      {
        id: "p1",
        name: "Farinha",
        quantity: 5,
        unit: "Kg",
        prices: [{ id: "pr1", description: "Atacado", value: 20 }],
      },
    ]);

    expect(products).toEqual([["p1", "Farinha", 5, "Kg", [["pr1", "Atacado", 20]]]]);
    expect(products[0][4].map((price) => price[1])).toEqual(["Atacado"]);
  });

  it("keeps already-migrated tuple products", () => {
    const tuple = ["p1", "Sugar", 1, "Kg", [["pr1", "Local", 8]]] as const;
    expect(decodeProducts([tuple])).toEqual([
      ["p1", "Sugar", 1, "Kg", [["pr1", "Local", 8]]],
    ]);
  });

  it("defaults missing prices so Manage Products can render", () => {
    expect(decodeProduct({ id: "p1", name: "Ovo", quantity: 12, unit: "unit" })).toEqual([
      "p1",
      "Ovo",
      12,
      "unit",
      [],
    ]);
    expect(decodeProduct(["p2", "Leite", 1, "L"])).toEqual(["p2", "Leite", 1, "L", []]);
  });

  it("returns an empty list for invalid product payloads", () => {
    expect(decodeProducts(undefined)).toEqual([]);
    expect(decodeProducts(null)).toEqual([]);
    expect(decodeProducts({ products: [] })).toEqual([]);
    expect(decodePrice("nope")).toBeNull();
    expect(decodeProduct("nope")).toBeNull();
  });

  it("converts legacy ingredients and recipes", () => {
    expect(
      decodeIngredient({
        id: "i1",
        productId: "p1",
        priceId: "pr1",
        quantity: 2,
        unit: "g",
        datasheetId: "r1",
      })
    ).toEqual(["i1", "p1", "pr1", 2, "g", "r1"]);

    expect(decodeIngredients([["i2", "p2", "pr2", 1, "Kg", "r2"]])).toEqual([
      ["i2", "p2", "pr2", 1, "Kg", "r2"],
    ]);

    expect(decodeRecipe({ id: "r1", name: "Bolo" })).toEqual(["r1", "Bolo"]);
    expect(decodeRecipes([["r2", "Pao"]])).toEqual([["r2", "Pao"]]);
  });
});
