import { useState } from "react";
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import TickViewer from "./components/TickViewer";
import { useFetchSymbolList } from "./hooks/useFetchSymbolList";

export default function AppComponent() {
  const [orderSymbol, setOrderSymbol] = useState<string>("");
  const symbolList = useFetchSymbolList();

  console.log("symbolList", symbolList);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard (TypeScript frontend)</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-4">
          <OrderForm symbolList={symbolList} setOrderSymbol={setOrderSymbol} />
          <TickViewer symbolList={symbolList} />
        </div>
        <div className="col-span-2">
          <OrdersTable symbolList={symbolList} setOrderSymbol={setOrderSymbol} orderSymbol={orderSymbol} />
        </div>
      </div>
    </div>
  );
}
