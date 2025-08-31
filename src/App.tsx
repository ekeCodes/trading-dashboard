import { useState } from "react";
import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import TickViewer from "./components/TickViewer";
import { useFetchSymbolList } from "./hooks/useFetchSymbolList";

export default function AppComponent() {
  const [orderSymbol, setOrderSymbol] = useState<string>("");
  const symbolList = useFetchSymbolList();

  return (
    <div className="bg-gray-100 flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard</h1>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="order-1">
          <TickViewer symbolList={symbolList} />
        </div>
        <div className="order-2">
          <OrderForm symbolList={symbolList} setOrderSymbol={setOrderSymbol} />
        </div>
        <div className="lg:col-span-2 order-3">
          <OrdersTable symbolList={symbolList} setOrderSymbol={setOrderSymbol} orderSymbol={orderSymbol} />
        </div>
      </div>
    </div>
  );
}
