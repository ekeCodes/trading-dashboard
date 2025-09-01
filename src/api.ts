import type { OrderPayload } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchSymbols() {
  const res = await fetch(`${API_BASE}/api/symbols`);
  return res.json();
}

export async function fetchOrders(symbol: string) {
  const res = await fetch(`${API_BASE}/api/orders?symbol=${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function postOrder(payload: OrderPayload) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to post order");
  return data;
}
