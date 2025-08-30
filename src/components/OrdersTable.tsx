import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../api";
import type { Order, SymbolInfo } from "../types";

export interface OrdersTableProps {
  symbolList: SymbolInfo[];
  isLiveMode: boolean;
  setIsLiveMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrdersTable(props: OrdersTableProps) {
  const { symbolList, setIsLiveMode, isLiveMode } = props;
  const [activeSymbol, setActiveSymbol] = useState<string>(symbolList[0]?.symbol || "AAPL");
  const [rowData, setRowData] = useState<Order[]>([]);

  useEffect(() => {
    if (activeSymbol) loadOrders();
  }, [activeSymbol]);

  async function loadOrders() {
    try {
      const data = await fetchOrders(activeSymbol);
      setRowData(data);
    } catch (e) {
      setRowData([]);
    }
  }

  const columns = useMemo(
    () => [
      {
        headerName: "ID",
        field: "id",
        sortable: true,
        filter: true,
        width: 90,
      },
      {
        headerName: "Side",
        field: "side",
        sortable: true,
        filter: "agTextColumnFilter",
        width: 100,
      },
      {
        headerName: "Qty",
        field: "qty",
        sortable: true,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "Price",
        field: "price",
        sortable: true,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "Timestamp",
        field: "timestamp",
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: (p: any) => new Date(p.value * 1000).toLocaleString(),
      },
    ],
    []
  );

  return (
    <div className="p-4 border rounded bg-white">
      <div className="flex gap-2 mb-2 items-center flex-column">
        <select value={activeSymbol} onChange={(e) => setActiveSymbol(e.target.value)} className="p-2 border">
          {symbolList.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol}
            </option>
          ))}
        </select>
        <button onClick={loadOrders} className="px-3 py-1 bg-slate-700 text-white rounded">
          Refresh
        </button>
        <div className="flex align-items-center">
          <span className="p-1">Live Mode:</span>
          <button
            type="button"
            role="switch"
            aria-checked={isLiveMode}
            className={`toggle toggle--sm ${isLiveMode ? "toggle--on" : ""}`}
            onClick={() => setIsLiveMode((prev) => !prev)}
          >
            <span aria-hidden className={"toggle__knob"} />
          </button>
        </div>

        <div className="ml-auto text-sm text-gray-600">Rows: {rowData.length}</div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact rowData={rowData} columnDefs={columns} defaultColDef={{ resizable: true, sortable: true, filter: true }} animateRows />
      </div>
    </div>
  );
}
