import { useCallback, useState } from "react";
import { useSymbolContext } from "../context/SymbolContext";
import { useSubscribeTick } from "../hooks/useSubscribeTick";
import MiniChart from "./MiniChart";
import SymbolDropdown from "./SymbolsDropdown";

export default function TickViewer() {
  const { initialActiveSymbol } = useSymbolContext();
  const [activeSymbol, setActiveSymbol] = useState<string>(initialActiveSymbol);

  const { lastTick, ticks, setTicks } = useSubscribeTick(activeSymbol);
  const onChange = useCallback((symbol: string) => {
    setActiveSymbol(symbol);
    setTicks([]);
  }, []);

  return (
    <div className="p-3 border rounded bg-white h-full">
      <div className="flex gap-2 mb-2 h-1/4 flex-col sm:flex-wrap">
        <SymbolDropdown value={activeSymbol} onChange={onChange} label="Live Symbol" />
        <div className="ml-0 pl-0 sm:ml-auto ">
          {lastTick ? (
            <div className=" sm:text-right">
              <div className="text-sm text-gray-500">Latest Price</div>
              <div className="text-lg font-semibold">{lastTick.price}</div>
              <div className="text-xs text-gray-500">Updated at: {new Date(lastTick.timestamp * 1000).toLocaleTimeString()}</div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No ticks yet</div>
          )}
        </div>
      </div>
      {ticks.length > 0 && <MiniChart data={ticks.map((t) => ({ x: t.timestamp * 1000, y: t.price }))} />}
    </div>
  );
}
