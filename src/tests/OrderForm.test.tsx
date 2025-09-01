import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import OrderForm from "../components/OrderForm";
import type { SymbolContextType } from "../context/SymbolContext";
import { renderWithContext } from "./testUtils";

const mockContextData: SymbolContextType = {
  symbols: [{ symbol: "EKETest", closePrice: 150, name: "Eke Test", market: "INDIA" }],
  setSymbols: vi.fn(),
  initialActiveSymbol: "EKETest",
  setInitialActiveSymbol: vi.fn(),
  activeOrderSymbol: "",
  setActiveOrderSymbol: vi.fn(),
};

describe("OrderForm validation", () => {
  test("shows error if form is submitted empty", () => {
    renderWithContext(<OrderForm />, { initialActiveSymbol: "" });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText("Symbol required")).toBeInTheDocument();
  });

  test("shows error if price is missing", () => {
    renderWithContext(<OrderForm />);
    fireEvent.change(screen.getByTestId("symbol-selector-option"), { target: { value: "AAPL" } });
    fireEvent.change(screen.getByTestId("quantity-input"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/Price must be > 0/)).toBeInTheDocument();
  });

  test("shows error if price is not in range", () => {
    renderWithContext(<OrderForm />, mockContextData);
    fireEvent.change(screen.getByTestId("price-input"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(`Price must be within ±20% of EKETest closePrice (120.00 - 180.00)`)).toBeInTheDocument();
  });

  test("submits successfully if all fields filled", () => {
    renderWithContext(<OrderForm />);
    fireEvent.change(screen.getByTestId("symbol-selector-option"), { target: { value: "AAPL" } });
    fireEvent.change(screen.getByTestId("price-input"), { target: { value: "160" } });
    fireEvent.change(screen.getByTestId("quantity-input"), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });
});
