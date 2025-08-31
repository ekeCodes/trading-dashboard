import OrderForm from "./components/OrderForm";
import OrdersTable from "./components/OrdersTable";
import TickViewer from "./components/TickViewer";

export default function AppComponent() {
  return (
    <div className="bg-gray-100 flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard</h1>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="order-1">
          <TickViewer />
        </div>
        <div className="order-2">
          <OrderForm />
        </div>
        <div className="lg:col-span-2 order-3">
          <OrdersTable />
        </div>
      </div>
    </div>
  );
}
