import { createContext, useContext, useState, type ReactNode } from "react";
import { useInitializeSymbolContext } from "../hooks/useInitializeSymbolContext";
import type { SymbolInfo } from "../types";

type SymbolContextType = {
  symbols: SymbolInfo[];
  setSymbols: React.Dispatch<React.SetStateAction<SymbolInfo[]>>;
  initialActiveSymbol: string;
  setInitialActiveSymbol: React.Dispatch<React.SetStateAction<string>>;
  activeOrderSymbol: string;
  setActiveOrderSymbol: React.Dispatch<React.SetStateAction<string>>;
};

const SymbolContext = createContext<SymbolContextType | undefined>(undefined);

export const SymbolProvider = ({ children }: { children: ReactNode }) => {
  const { symbols, setSymbols, initialActiveSymbol, setInitialActiveSymbol } = useInitializeSymbolContext();
  const [activeOrderSymbol, setActiveOrderSymbol] = useState<string>("");

  return (
    <SymbolContext.Provider
      value={{ symbols, setSymbols, initialActiveSymbol, setInitialActiveSymbol, activeOrderSymbol, setActiveOrderSymbol }}
    >
      {children}
    </SymbolContext.Provider>
  );
};

export const useSymbolContext = () => {
  const context = useContext(SymbolContext);
  if (!context) {
    throw new Error("App is not wrapped with SymbolProvider");
  }
  return context;
};
