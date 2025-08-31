import type { GridReadyEvent } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

export function useGridAutoSize() {
  const gridRef = useRef<AgGridReact>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  useEffect(() => {
    const resizeHandler = () => gridRef.current?.api.sizeColumnsToFit();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  });

  return useMemo(() => {
    return { gridRef, onGridReady };
  }, [gridRef, onGridReady]);
}
