import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../i18n/I18nProvider";
import { ConfirmDialog } from "./ConfirmDialog";

afterEach(cleanup);

describe("ConfirmDialog", () => {
  it("prefills the name and rejects whitespace before submitting the trimmed value", () => {
    const onConfirm = vi.fn();
    render(<I18nProvider><ConfirmDialog open title="Rename recipe" noText={false} initialValue="Cake" onClose={vi.fn()} onConfirm={onConfirm} /></I18nProvider>);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Cake");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("dialog"));
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "  Chocolate cake  " } });
    fireEvent.submit(screen.getByRole("dialog"));
    expect(onConfirm).toHaveBeenCalledWith("Chocolate cake");
  });

  it("restores the initial value after cancelling and reopening", () => {
    const props = { title: "Rename recipe", noText: false, initialValue: "Cake", onClose: vi.fn(), onConfirm: vi.fn() };
    const { rerender } = render(<I18nProvider><ConfirmDialog {...props} open /></I18nProvider>);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Unsaved" } });
    rerender(<I18nProvider><ConfirmDialog {...props} open={false} /></I18nProvider>);
    rerender(<I18nProvider><ConfirmDialog {...props} open /></I18nProvider>);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Cake");
  });
});
