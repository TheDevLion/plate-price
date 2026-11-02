import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../../i18n/I18nProvider";
import { initialStore, makeProduct, useTechnicalDatasheetStore } from "../store";
import { ProductsModal } from "./ProductModal";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("uiLanguage", "en");
  useTechnicalDatasheetStore.setState({ ...initialStore, products: [makeProduct("p1", "Flour", 1, "Kg", [])] });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  useTechnicalDatasheetStore.setState(initialStore);
});

describe("ProductsModal", () => {
  it("keeps edits in a draft and confirms closing without changing saved products", () => {
    const onClose = vi.fn();
    render(<I18nProvider><ProductsModal onClose={onClose} /></I18nProvider>);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Unsaved flour" } });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    const confirmation = screen.getByRole("dialog", { name: "Discard unsaved changes?" });
    fireEvent.click(within(confirmation).getByRole("button", { name: "Discard changes" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(useTechnicalDatasheetStore.getState().products[0][1]).toBe("Flour");
  });

  it("saves the draft to storage and shared state before closing", () => {
    const onClose = vi.fn();
    render(<I18nProvider><ProductsModal onClose={onClose} /></I18nProvider>);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Rice flour" } });
    fireEvent.click(screen.getByRole("button", { name: "Save and close" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(useTechnicalDatasheetStore.getState().products[0][1]).toBe("Rice flour");
    expect(JSON.parse(localStorage.getItem("products")!)[0][1]).toBe("Rice flour");
  });

  it("keeps the draft open and reports a storage failure", () => {
    const onClose = vi.fn();
    render(<I18nProvider><ProductsModal onClose={onClose} /></I18nProvider>);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Rice flour" } });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota exceeded"); });
    fireEvent.click(screen.getByRole("button", { name: "Save and close" }));
    expect(screen.getByRole("alert").textContent).toContain("Could not save");
    expect(onClose).not.toHaveBeenCalled();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Rice flour");
    expect(useTechnicalDatasheetStore.getState().products[0][1]).toBe("Flour");
  });
});
