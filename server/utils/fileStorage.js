import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "orders");
const SYMBOLS_FILE = path.join(process.cwd(), "symbols", "symbols.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export function loadSymbols() {
  const raw = fs.readFileSync(SYMBOLS_FILE);
  return JSON.parse(raw);
}

export function loadSymbolMap() {
  const symbols = loadSymbols();
  return Object.fromEntries(symbols.map((s) => [s.symbol, s]));
}
export function saveSymbols(symbols) {
  fs.writeFileSync(SYMBOLS_FILE, JSON.stringify(symbols, null, 2));
}

export function readOrdersFile(symbol) {
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

export function saveOrder(symbol, order) {
  const file = path.join(DATA_DIR, `${symbol}.json`);
  const arr = readOrdersFile(symbol);
  arr.push(order);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}
