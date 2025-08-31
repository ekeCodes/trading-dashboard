import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../api";
import { useSymbolContext } from "../context/SymbolContext";
import { useGridAutoSize } from "../hooks/useGridAutoSize";
import type { Order } from "../types";
import SymbolDropdown from "./SymbolsDropdown";

export default function OrdersTable() {
  const { initialActiveSymbol, activeOrderSymbol, setActiveOrderSymbol } = useSymbolContext();
  const [activeSymbol, setActiveSymbol] = useState<string>(initialActiveSymbol);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [rowData, setRowData] = useState<Order[]>([]);
  const { gridRef, onGridReady } = useGridAutoSize();

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchOrders(activeSymbol || initialActiveSymbol);
      setRowData(data);
    } catch (e) {
      setRowData([]);
    }
  }, [activeSymbol, initialActiveSymbol]);

  useEffect(() => {
    (activeSymbol || initialActiveSymbol) && loadOrders();
  }, [activeSymbol, initialActiveSymbol]);

  useEffect(() => {
    if (isLiveMode && activeOrderSymbol !== "" && activeOrderSymbol === (activeSymbol || initialActiveSymbol)) {
      loadOrders();
    }
    setActiveOrderSymbol("");
  }, [isLiveMode, activeOrderSymbol]);

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

  const onChange = useCallback((symbol: string) => {
    setActiveSymbol(symbol);
  }, []);
  return (
    <div className="p-4 border rounded bg-white">
      <div className="flex gap-2 mb-2 items-center flex-wrap">
        <SymbolDropdown value={activeSymbol} onChange={onChange} />
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
