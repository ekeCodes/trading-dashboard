import { useEffect, useState } from "react";
import type { SymbolInfo } from "../types";
import { fetchSymbols } from "../api";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
const EMPTY_ARRAY: SymbolInfo[] = [];
export function useFetchSymbolList() {
  const [symbolList, setSymbolList] = useState<SymbolInfo[]>(EMPTY_ARRAY);

  useEffect(() => {
    fetchSymbols()
      .then((s) => setSymbolList(s))
      .catch(() => setSymbolList(EMPTY_ARRAY));

    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "symbolsUpdated") {
        setSymbolList(data.symbols);
      }
    };
  }, []);

  return symbolList;
}
