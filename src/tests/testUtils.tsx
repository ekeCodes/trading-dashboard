import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import { SymbolContext, type SymbolContextType } from "../context/SymbolContext";

export const initialMockContextData = {
  symbols: [{ symbol: "AAPL", closePrice: 150, name: "Apple Inc.", market: "NASDAQ" }],
  setSymbols: vi.fn(),
  initialActiveSymbol: "AAPL",
  setInitialActiveSymbol: vi.fn(),
  activeOrderSymbol: "",
  setActiveOrderSymbol: vi.fn(),
};

export function renderWithContext(ui: React.ReactElement, overrideContextData: Partial<SymbolContextType> = {}) {
  return render(<SymbolContext.Provider value={{ ...initialMockContextData, ...overrideContextData }}>{ui}</SymbolContext.Provider>);
}
