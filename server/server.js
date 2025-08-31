const express = require("express");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const DATA_DIR = path.join(__dirname, "orders");
const SYMBOLS_FILE = path.join(__dirname, "symbols/symbols.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadSymbols() {
  const raw = fs.readFileSync(SYMBOLS_FILE);
  return JSON.parse(raw);
}
const SYMBOLS = loadSymbols();
const symbolMap = Object.fromEntries(SYMBOLS.map((s) => [s.symbol, s]));

function readOrdersFile(symbol) {
  const file = path.join(DATA_DIR, `${symbol}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file);
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading orders file for", symbol, e);
    return [];
  }
}

function appendOrder(symbol, order) {
  const file = path.join(DATA_DIR, `${symbol}.json`);
  const arr = readOrdersFile(symbol);
  arr.push(order);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

function appendSymbol(symbolObj) {
  SYMBOLS.push(symbolObj);
  fs.writeFileSync(SYMBOLS_FILE, JSON.stringify(SYMBOLS, null, 2));
  symbolMap[symbolObj.symbol] = symbolObj;
}

function broadcast(msg) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(msg));
    }
  });
}

app.get("/api/symbols", (req, res) => {
  res.json(SYMBOLS);
});

app.post("/api/admin/add-symbol", (req, res) => {
  const { symbol, closePrice, name, market } = req.body;
  if ((!symbol || closePrice === undefined, !name || !market)) {
    return res.status(400).json({ error: "Missing Fields" });
  }
  const upperSymbol = String(symbol).toUpperCase();
  if (symbolMap[upperSymbol]) {
    return res.status(400).json({ error: `Symbol ${upperSymbol} already exists` });
  }
  if (typeof closePrice !== "number" || closePrice <= 0) {
    return res.status(400).json({ error: "closePrice must be > 0" });
  }
  const symbolObj = { symbol: upperSymbol, closePrice, name, market };
  appendSymbol(symbolObj);
  broadcast({ type: "symbolsUpdated", symbols: SYMBOLS });
  res.status(201).json(symbolObj);
});

app.get("/api/orders", (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "symbol required" });
  const upper = String(symbol).toUpperCase();
  const orders = readOrdersFile(upper);
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const { symbol, side, qty, price } = req.body;
  if (!symbol || !side || qty === undefined || price === undefined) {
    return res.status(400).json({ error: "symbol, side, qty, price required" });
  }
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
  appendOrder(upperSymbol, order);
  res.status(201).json(order);
});

const server = app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.subscribed = new Set();

  ws.on("message", (message) => {
    try {
      const msg = JSON.parse(message);
      if (msg.action === "subscribe" && msg.symbol) {
        const s = String(msg.symbol).toUpperCase();
        if (symbolMap[s]) {
          ws.subscribed.add(s);
          ws.send(JSON.stringify({ subscribed: Array.from(ws.subscribed) }));
        } else {
          ws.send(JSON.stringify({ error: `Unknown symbol ${msg.symbol}` }));
        }
      } else if (msg.action === "unsubscribe" && msg.symbol) {
        ws.subscribed.delete(String(msg.symbol).toUpperCase());
        ws.send(JSON.stringify({ subscribed: Array.from(ws.subscribed) }));
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  ws.on("close", () => {
    ws.subscribed.clear();
  });
});

function randBetween(a, b) {
  return Math.random() * (b - a) + a;
}

function sendTicks() {
  wss.clients.forEach((ws) => {
    if (ws.readyState !== WebSocket.OPEN) return;
    ws.subscribed.forEach((sym) => {
      const sObj = symbolMap[sym];
      if (!sObj) return;
      const min = sObj.closePrice * 0.95;
      const max = sObj.closePrice * 1.05;
      const price = +randBetween(min, max).toFixed(8);
      const volume = Math.floor(randBetween(1, 500));
      const timestamp = Math.floor(Date.now() / 1000);
      const tick = { symbol: sym, price, volume, timestamp };
      ws.send(JSON.stringify({ type: "tick", data: tick }));
    });
  });
  setTimeout(sendTicks, Math.floor(randBetween(1000, 2000)));
}

setTimeout(sendTicks, 1000);

module.exports = { app, server, wss, readOrdersFile, appendOrder, appendSymbol };
