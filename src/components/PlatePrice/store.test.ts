import { afterEach, describe, expect, it } from "vitest";
import { useTechnicalDatasheetStore } from "./store";

const resetStore = () => {
  useTechnicalDatasheetStore.setState({
    selectedSheet: undefined,
    datasheets: [],
    products: [],
    ingredients: [],
  });
  localStorage.clear();
};

describe("technical datasheet store loaders", () => {
  afterEach(resetStore);

  it("migrates object products from localStorage so prices can be mapped", () => {
    localStorage.setItem(
      "products",
      JSON.stringify([
        {
          id: "1",
          name: "Farinha",
          quantity: 5,
          unit: "Kg",
          prices: [{ id: "10", description: "Atacado", value: 18.5 }],
        },
      ])
    );

    useTechnicalDatasheetStore.getState().loadProducts();

    const products = useTechnicalDatasheetStore.getState().products;
    expect(products).toEqual([
      ["1", "Farinha", 5, "Kg", [["10", "Atacado", 18.5]]],
    ]);
    expect(() => products.map((product) => product[4].map((price) => price[0]))).not.toThrow();
    expect(JSON.parse(localStorage.getItem("products") ?? "[]")).toEqual(products);
  });

  it("falls back to legacy receipts key for recipes", () => {
    localStorage.setItem(
      "receipts",
      JSON.stringify([{ id: "r1", name: "Bolo de chocolate" }])
    );

    useTechnicalDatasheetStore.getState().loadDatasheets();

    expect(useTechnicalDatasheetStore.getState().datasheets).toEqual([
      ["r1", "Bolo de chocolate"],
    ]);
  });
});
