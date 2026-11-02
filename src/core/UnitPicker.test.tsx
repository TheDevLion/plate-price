import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import { UnitPicker } from "./UnitPicker";

afterEach(cleanup);

describe("UnitPicker", () => {
  it("searches by name and selects a compatible unit with the keyboard", () => {
    const onChange = vi.fn();
    render(<I18nProvider><UnitPicker unitState="g" category="weight" onChange={onChange} /></I18nProvider>);
    const input = screen.getByRole("combobox");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "kilo" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Kilogram/ })).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("Kg");
  });

  it("searches by abbreviation without allowing units outside the category", () => {
    render(<I18nProvider><UnitPicker unitState="L" category="volume" onChange={vi.fn()} /></I18nProvider>);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "fl oz" } });
    expect(screen.getByRole("option", { name: /Fluid Ounce/ })).toBeTruthy();
    fireEvent.change(input, { target: { value: "kilogram" } });
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("does not save arbitrary text and restores the selected unit on blur", () => {
    const onChange = vi.fn();
    render(<I18nProvider><UnitPicker unitState="g" onChange={onChange} /></I18nProvider>);
    const input = screen.getByRole("combobox") as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "unknown unit" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.blur(input);
    expect(onChange).not.toHaveBeenCalled();
    expect(input.value).toBe("g");
  });

  it("preserves a stored unit outside the current category", () => {
    render(<I18nProvider><UnitPicker unitState="L" category="weight" onChange={vi.fn()} /></I18nProvider>);
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /Liter/ }).getAttribute("aria-selected")).toBe("true");
  });
});
