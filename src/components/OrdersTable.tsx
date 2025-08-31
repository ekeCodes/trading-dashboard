import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../api";
import type { Order, SymbolInfo } from "../types";
import type { FirstDataRenderedEvent, GridReadyEvent } from "ag-grid-community";
import { useGridAutoSize } from "../hooks/useGridAutoSize";

export interface OrdersTableProps {
  symbolList: SymbolInfo[];
  orderSymbol: string;
  setOrderSymbol: React.Dispatch<React.SetStateAction<string>>;
}

export default function OrdersTable(props: OrdersTableProps) {
  const { symbolList, orderSymbol, setOrderSymbol } = props;
  const [activeSymbol, setActiveSymbol] = useState<string>(
    symbolList && symbolList[0] && symbolList[0].symbol ? symbolList[0].symbol : "AAPL"
  );
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [rowData, setRowData] = useState<Order[]>([]);
  const { gridRef, onGridReady } = useGridAutoSize();

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchOrders(activeSymbol);
      setRowData(data);
    } catch (e) {
      setRowData([]);
    }
  }, [activeSymbol]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (isLiveMode && orderSymbol !== "" && orderSymbol === activeSymbol) {
      loadOrders();
    }
    setOrderSymbol("");
  }, [isLiveMode, orderSymbol]);

  const onClickRefresh = useCallback(() => {
    loadOrders();
  }, [loadOrders]);

  const columns = useMemo(
    () => [
      {
        headerName: "ID",
        field: "id",
        sortable: true,
        filter: true,
        minWidth: 70,
      },
      {
        headerName: "Side",
        field: "side",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 80,
      },
      {
        headerName: "Qty",
        field: "qty",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 75,
      },
      {
        headerName: "Price",
        field: "price",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 90,
      },
      {
        headerName: "Timestamp",
        field: "timestamp",
        sortable: true,
        filter: "agTextColumnFilter",
        minWidth: 100,
        valueFormatter: (p: any) => new Date(p.value * 1000).toLocaleString(),
      },
    ],
    []
  );

  return (
    <div className="p-4 border rounded bg-white">
      <div className="flex gap-2 mb-2 items-center flex-wrap">
        <select value={activeSymbol} onChange={(e) => setActiveSymbol(e.target.value)} className="p-2 border">
          {symbolList.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol}
            </option>
          ))}
        </select>
        <button onClick={onClickRefresh} className="px-3 py-1 bg-slate-700 text-white rounded">
          Refresh
        </button>
        <div className="inline-flex items-center">
          <span className="p-1">Live Mode:</span>
          <button
            type="button"
            role="switch"
            aria-checked={isLiveMode}
            className={`toggle toggle--sm ${isLiveMode ? "toggle--on" : ""}`}
            onClick={() => {
              setIsLiveMode((prev) => {
                if (prev === false) onClickRefresh();
                return !prev;
              });
            }}
          >
            <span aria-hidden className={"toggle__knob"} />
          </button>
        </div>

        <div className="sm:ml-auto text-sm text-gray-600">Rows: {rowData.length}</div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          animateRows
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}
