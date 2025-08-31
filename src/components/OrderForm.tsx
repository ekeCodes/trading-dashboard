import React, { useState } from "react";
import { postOrder } from "../api";
import type { SymbolInfo } from "../types";

export interface OrderFormProps {
  symbolList: SymbolInfo[];
  setOrderSymbol: React.Dispatch<React.SetStateAction<string>>;
}

export default function OrderForm(props: OrderFormProps) {
  const { symbolList, setOrderSymbol } = props;
  const [symbol, setSymbol] = useState<string>(symbolList && symbolList[0] && symbolList[0].symbol ? symbolList[0].symbol : "AAPL");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<string>("");
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  function symbolMeta() {
    return symbolList.find((s) => s.symbol === symbol);
  }

  function validate() {
    if (!symbol) return "Symbol required";
    if (!qty || qty <= 0) return "Qty must be > 0";
    const p = Number(price);
    if (!price || isNaN(p) || p <= 0) return "Price must be > 0";
    const meta = symbolMeta();
    if (meta) {
      const cp = meta.closePrice;
      const min = cp * 0.8;
      const max = cp * 1.2;
      if (p < min || p > max) return `Price must be within ±20% of ${symbol} closePrice (${min.toFixed(2)} - ${max.toFixed(2)})`;
    }
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setMsg({ type: "error", text: err });
      return;
    }
    try {
      const order = await postOrder({
        symbol,
        side,
        qty,
        price: Number(price),
      });
      setOrderSymbol(symbol);
      setMsg({ type: "success", text: `Order placed (id: ${order.id})` });
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || String(err) });
    }
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded bg-white">
      <h2 className="font-semibold mb-2">Place Order</h2>
      <div className="mb-2">
        <label className="block text-sm">Symbol</label>
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full p-2 border">
          {symbolList.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol} — {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2 flex gap-2">
        <label className="flex-1">
          <div className="text-sm">Side</div>
          <select value={side} onChange={(e) => setSide(e.target.value as "BUY" | "SELL")} className="w-full p-2 border">
            <option>BUY</option>
            <option>SELL</option>
          </select>
        </label>
        <label className="flex-1">
          <div className="text-sm">Qty</div>
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full p-2 border" />
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-sm">Price</label>
        <input
          aria-label="Price"
          type="number"
          step="0.0001"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border"
        />
        {symbolMeta() && (
          <div className="text-xs text-gray-600 mt-1">
            Allowed: {((symbolMeta()?.closePrice ?? 0) * 0.8).toFixed(2)} — {((symbolMeta()?.closePrice ?? 0) * 1.2).toFixed(2)}
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
