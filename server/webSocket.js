import { WebSocketServer } from "ws";
import { loadSymbolMap, loadSymbols } from "./utils/fileStorage.js";

let wss;

function randBetween(a, b) {
  return Math.random() * (b - a) + a;
}

function generateTickPrice(closePrice) {
  const min = closePrice * 0.95;
  const max = closePrice * 1.05;
  const price = +randBetween(min, max).toFixed(8);
  return price;
}

export function setupWebSocket(server) {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    ws.subscribed = new Set();

    ws.on("message", (message) => {
      try {
        const { action, symbol } = JSON.parse(message);
        if (action === "subscribe" && symbol) {
          const s = String(symbol).toUpperCase();
          const symbolMap = loadSymbolMap();
          if (symbolMap[s]) {
            ws.subscribed.add(s);
            ws.send(JSON.stringify({ subscribed: Array.from(ws.subscribed) }));
          } else {
            ws.send(JSON.stringify({ error: `Unknown symbol ${symbol}` }));
          }
        } else if (action === "unsubscribe" && symbol) {
          ws.subscribed.delete(String(symbol).toUpperCase());
          ws.send(JSON.stringify({ subscribed: Array.from(ws.subscribed) }));
        }
      } catch (e) {
        console.error("Invalid WebSocket message", e);
      }
    });

    ws.on("close", () => {
      ws.subscribed.clear();
    });
  });
}

function sendTicks() {
  wss.clients.forEach((ws) => {
    if (ws.readyState !== WebSocket.OPEN) return;
    ws.subscribed.forEach((sym) => {
      const symbolMap = loadSymbolMap();
      const symbolObj = symbolMap[sym];
      if (!symbolObj) return;
      const price = generateTickPrice(symbolObj.closePrice);
      const volume = Math.floor(randBetween(1, 500));
      const timestamp = Math.floor(Date.now() / 1000);
      const tick = { symbol: sym, price, volume, timestamp };
      ws.send(JSON.stringify({ type: "tick", data: tick }));
    });
  });
  setTimeout(sendTicks, Math.floor(randBetween(1000, 2000)));
}

setTimeout(sendTicks, 1000);

export function broadcast(msg) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(msg));
    }
  });
}
