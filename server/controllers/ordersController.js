import { loadSymbolMap, readOrdersFile } from "../utils/fileStorage.js";
import { saveOrder } from "../utils/fileStorage.js";

export function getOrders(req, res) {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }
  const upper = String(symbol).toUpperCase();
  const orders = readOrdersFile(upper);
  res.json(orders);
}

export function addOrder(req, res) {
  const { symbol, side, qty, price } = req.body;
  if (!symbol || !side || qty === undefined || price === undefined) {
    return res.status(400).json({ error: "symbol, side, qty, price required" });
  }

  const symbolMap = loadSymbolMap();

  const upperSymbol = String(symbol).toUpperCase();
  if (!symbolMap[upperSymbol]) return res.status(400).json({ error: `Unknown symbol ${symbol}` });

  if (typeof qty !== "number" || qty <= 0) {
    return res.status(400).json({ error: "Qty must be > 0" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "Price must be > 0" });
  }

  const closePrice = symbolMap[upperSymbol].closePrice;
  const min = +(closePrice * 0.8).toFixed(8);
  const max = +(closePrice * 1.2).toFixed(8);
  if (price < min || price > max) {
    return res.status(400).json({
      error: `Price must be within ±20% of ${upperSymbol} closePrice (allowed: ${min} to ${max})`,
    });
  }

  const orders = readOrdersFile(upperSymbol);
  const nextId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
  const timestamp = Math.floor(Date.now() / 1000);
  const order = { id: nextId, symbol: upperSymbol, side, qty, price, timestamp };
  saveOrder(upperSymbol, order);
  res.status(201).json(order);
}
