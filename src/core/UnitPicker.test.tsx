import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import { UnitPicker } from "./UnitPicker";

afterEach(cleanup);

describe("UnitPicker", () => {
  it("selects a unit without a text input and filters incompatible units", () => {
    const onChange = vi.fn();
    render(<I18nProvider><UnitPicker unitState="g" category="weight" onChange={onChange} /></I18nProvider>);

    expect(screen.queryByRole("textbox")).toBeNull();
    fireEvent.mouseDown(screen.getByRole("combobox"));
    expect(screen.queryByRole("option", { name: /Liter/ })).toBeNull();
    fireEvent.click(screen.getByRole("option", { name: /Kilogram/ }));
    expect(onChange).toHaveBeenCalledWith("Kg");
  });

  it("opens by keyboard and preserves a stored unit outside the current category", () => {
    render(<I18nProvider><UnitPicker unitState="L" category="weight" onChange={vi.fn()} /></I18nProvider>);
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /Liter/ }).getAttribute("aria-selected")).toBe("true");
  });
});
