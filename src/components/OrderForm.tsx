import React, { useCallback, useMemo, useState } from "react";
import { postOrder } from "../api";
import { useSymbolContext } from "../context/SymbolContext";
import SymbolDropdown from "./SymbolsDropdown";
import type { OrderPayload, SymbolInfo } from "../types";

export default function OrderForm() {
  const { initialActiveSymbol, symbols, setActiveOrderSymbol } = useSymbolContext();
  const [activeSymbol, setActiveSymbol] = useState<OrderPayload>({ symbol: initialActiveSymbol, price: 0, qty: 1, side: "BUY" });
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const symbolMeta = useMemo(() => {
    return symbols.find((s) => s.symbol === (activeSymbol.symbol || initialActiveSymbol));
  }, [symbols, activeSymbol, initialActiveSymbol]);

  const validate = useCallback(() => {
    const { symbol, qty, price } = activeSymbol;
    if (!(symbol || initialActiveSymbol)) return "Symbol required";
    if (!qty || qty <= 0) return "Qty must be > 0";
    const p = Number(price);
    if (!price || isNaN(p) || p <= 0) return "Price must be > 0";
    const meta = symbolMeta;
    if (meta) {
      const cp = meta.closePrice;
      const min = cp * 0.8;
      const max = cp * 1.2;
      if (p < min || p > max) return `Price must be within ±20% of ${meta.symbol} closePrice (${min.toFixed(2)} - ${max.toFixed(2)})`;
    }
    return null;
  }, [activeSymbol, initialActiveSymbol, symbolMeta]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const err = validate();
      if (err) {
        setMsg({ type: "error", text: err });
        return;
      }
      try {
        const order = await postOrder({
          ...activeSymbol,
          symbol: activeSymbol.symbol || initialActiveSymbol,
        });
        setActiveOrderSymbol(activeSymbol.symbol || initialActiveSymbol);
        setMsg({ type: "success", text: `Order placed (id: ${order.id})` });
      } catch (err: any) {
        setMsg({ type: "error", text: err.message || String(err) });
      }
    },
    [activeSymbol, initialActiveSymbol, setActiveOrderSymbol, validate]
  );

  const onChange = useCallback((symbol: string) => {
    setActiveSymbol((prev) => ({ ...prev, symbol }));
  }, []);

  return (
    <form onSubmit={submit} className="p-4 border rounded bg-white h-full">
      <h2 className="font-semibold mb-2">Place Order</h2>
      <div className="mb-2">
        <SymbolDropdown label="Symbol" value={activeSymbol.symbol} onChange={onChange} />
      </div>
      <div className="mb-2 flex gap-2">
        <label className="flex-1">
          <div className="text-sm">Side</div>
          <select
            value={activeSymbol.side}
            onChange={(e) => setActiveSymbol((prev) => ({ ...prev, side: e.target.value as "BUY" | "SELL" }))}
            className="w-full p-2 border rounded-md"
          >
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </label>
        <label className="flex-1">
          <div className="text-sm">Qty</div>
          <input
            type="number"
            value={activeSymbol.qty}
            onChange={(e) => setActiveSymbol((prev) => ({ ...prev, qty: Number(e.target.value) }))}
            className="w-full p-2 border rounded-md"
          />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-sm">Price</label>
        <input
          aria-label="Price"
          type="number"
          step="0.0001"
          value={activeSymbol.price}
          onChange={(e) => setActiveSymbol((prev) => ({ ...prev, price: Number(e.target.value) }))}
          className="w-full p-2 border rounded-md"
        />
        {symbolMeta && (
          <div className="text-xs text-gray-600 mt-1">
            Allowed: {((symbolMeta.closePrice ?? 0) * 0.8).toFixed(2)} — {((symbolMeta.closePrice ?? 0) * 1.2).toFixed(2)}
          </div>
        )}
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
        Submit Order
      </button>
      {msg && (
        <div className={`mt-2 p-2 rounded ${msg.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {msg.text}
        </div>
      )}
    </form>
  );
}
