import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { initialStore, useTechnicalDatasheetStore } from "../store";
import { PlatePriceContent } from "./PlatePriceContent";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("uiLanguage", "en");
  localStorage.setItem("products", JSON.stringify([
    ["p1", "Flour", 1, "Kg", [["price1", "Market", 8]]],
    ["p2", "Milk", 1, "L", [["price2", "Market", 5]]],
    ["p3", "Oil", 1, "L", [["price3", "Market", 7], ["price4", "Store", 8]]],
  ]));
  localStorage.setItem("ingredients", JSON.stringify([["i1", "p1", "price1", 250, "g", "r1"]]));
  useTechnicalDatasheetStore.setState({ ...initialStore, selectedSheet: "r1" });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  useTechnicalDatasheetStore.setState(initialStore);
});

describe("ingredient editing", () => {
  it("loads ingredients for the selected recipe and updates them when the shared state changes", () => {
    render(<I18nProvider><PlatePriceContent /></I18nProvider>);
    expect((screen.getByRole("combobox", { name: "Product" }) as HTMLInputElement).value).toBe("Flour");
    expect(screen.getAllByText("$ 2.00")).toHaveLength(2);
    act(() => useTechnicalDatasheetStore.getState().setIngredients([["i1", "p1", "price1", 500, "g", "r1"]]));
    expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("500");
    expect(screen.getAllByText("$ 4.00")).toHaveLength(2);
  });

  it("updates unit and price when choosing a different product, preserving the quantity", () => {
    render(<I18nProvider><PlatePriceContent /></I18nProvider>);
    const product = screen.getByRole("combobox", { name: "Product" });
    fireEvent.focus(product);
    fireEvent.change(product, { target: { value: "Milk" } });
    fireEvent.click(screen.getByRole("option", { name: "Milk" }));
    expect(useTechnicalDatasheetStore.getState().ingredients[0]).toEqual(["i1", "p2", "price2", 250, "L", "r1"]);
    fireEvent.change(product, { target: { value: "Oil" } });
    fireEvent.click(screen.getByRole("option", { name: "Oil" }));
    expect(useTechnicalDatasheetStore.getState().ingredients[0][2]).toBe("");
    fireEvent.change(product, { target: { value: "" } });
    expect(useTechnicalDatasheetStore.getState().ingredients[0]).toEqual(["i1", "", "", 250, "", "r1"]);
    expect(JSON.parse(localStorage.getItem("ingredients")!)[0]).toEqual(["i1", "", "", 250, "", "r1"]);
  });
});
