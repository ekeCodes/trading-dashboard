import { useEffect, useMemo, useState } from "react";
import { fetchSymbols } from "../api";
import type { SymbolInfo } from "../types";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
const EMPTY_ARRAY: SymbolInfo[] = [];

export function useInitializeSymbolContext() {
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
  const [initialActiveSymbol, setInitialActiveSymbol] = useState<string>("");

  useEffect(() => {
    fetchSymbols()
      .then((s) => {
        setSymbols(s);
        setInitialActiveSymbol(s[0]?.symbol || "");
      })
      .catch(() => setSymbols(EMPTY_ARRAY));

    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "symbolsUpdated") {
        setSymbols((prev) => {
          const isNewSymbol = !prev.find((s) => s.symbol === data.newSymbol.symbol);
          if (isNewSymbol) return [...prev, data.newSymbol];
          return prev;
        });
      }
    };
  }, []);

  return useMemo(() => {
    return { symbols, setSymbols, initialActiveSymbol, setInitialActiveSymbol };
  }, [symbols, setSymbols]);
}
