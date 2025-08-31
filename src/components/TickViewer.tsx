import { useState } from "react";
import { useSubscribeTick } from "../hooks/useSubscribeTick";
import type { SymbolInfo } from "../types";
import MiniChart from "./MiniChart";

export interface TickViewerProps {
  symbolList: SymbolInfo[];
}
export default function TickViewer(props: TickViewerProps) {
  const { symbolList } = props;

  const [symbol, setSymbol] = useState<string>((symbolList && symbolList[0] && symbolList[0].symbol) || "AAPL");

  const { lastTick, ticks, setTicks } = useSubscribeTick(symbol);

  return (
    <div className="p-3 border rounded bg-white">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm">Live Symbol</label>
        <select
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
            setTicks([]);
          }}
          className="p-1 border"
        >
          {symbolList &&
            symbolList.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol}
              </option>
            ))}
        </select>
        <div className="ml-auto">
          {lastTick ? (
            <div className="text-right">
              <div className="text-sm text-gray-500">Last</div>
              <div className="text-lg font-semibold">{lastTick.price}</div>
              <div className="text-xs text-gray-500">{new Date(lastTick.timestamp * 1000).toLocaleTimeString()}</div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No ticks yet</div>
          )}
        </div>
      </div>
      <MiniChart data={ticks.map((t) => ({ x: t.timestamp * 1000, y: t.price }))} />
    </div>
  );
}
