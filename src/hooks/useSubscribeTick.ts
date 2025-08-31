import { useEffect, useMemo, useRef, useState } from "react";
import { useSymbolContext } from "../context/SymbolContext";
import type { Tick } from "../types";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";

export function useSubscribeTick(symbolValue: string) {
  const { initialActiveSymbol } = useSymbolContext();
  const symbol = symbolValue || initialActiveSymbol;

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

  return useMemo(() => ({ lastTick, ticks, setTicks }), [lastTick, ticks, setTicks]);
}
