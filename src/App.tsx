import { useEffect, useState } from "react";
import { fetchSymbols } from "./api";
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import TickViewer from "./components/TickViewer";
import type { SymbolInfo } from "./types";

export default function AppComponent() {
  const [symbolList, setSymbolList] = useState<SymbolInfo[]>([]);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);

  useEffect(() => {
    fetchSymbols()
      .then((s) => setSymbolList(s))
      .catch(() => setSymbolList([]));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard (TypeScript frontend)</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-4">
          <OrderForm symbolList={symbolList} />
          <TickViewer symbolList={symbolList} />
        </div>
        <div className="col-span-2">
          <OrdersTable symbolList={symbolList} setIsLiveMode={setIsLiveMode} isLiveMode={isLiveMode} />
        </div>
      </div>
    </div>
  );
}
