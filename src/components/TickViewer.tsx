import { useEffect, useRef, useState } from "react";
import MiniChart from "./MiniChart";
import type { SymbolInfo, Tick } from "../types";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4001";

export interface TickViewerProps {
  symbolList: SymbolInfo[];
}
export default function TickViewer(props: TickViewerProps) {
  const { symbolList } = props;
  const [symbol, setSymbol] = useState<string>((symbolList && symbolList[0] && symbolList[0].symbol) || "AAPL");
  const [lastTick, setLastTick] = useState<Tick | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [ticks, setTicks] = useState<Tick[]>([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => console.log("ws open");
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "tick" && msg.data) {
          if (msg.data.symbol === symbol) {
            setLastTick(msg.data);
            setTicks((prev) => [...prev, msg.data].slice(-50));
          }
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, [symbol]);

  useEffect(() => {
    if (!wsRef.current) return;
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", symbol }));
    } else {
      wsRef.current.addEventListener("open", () => wsRef.current!.send(JSON.stringify({ action: "subscribe", symbol })), { once: true });
    }
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "unsubscribe", symbol }));
      }
    };
  }, [symbol]);

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
