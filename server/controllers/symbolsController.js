import { loadSymbols, saveSymbols, loadSymbolMap } from "../utils/fileStorage.js";
import { broadcast } from "../webSocket.js";

export function getSymbols(req, res) {
  let SYMBOLS = loadSymbols();
  res.json(SYMBOLS);
}

export function addSymbol(req, res) {
  let SYMBOLS = loadSymbols();
  let symbolMap = loadSymbolMap();
  const { symbol, closePrice, name, market } = req.body;

  if (!symbol || closePrice === undefined || !name || !market) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const upperSymbol = String(symbol).toUpperCase();
  if (symbolMap[upperSymbol]) {
    return res.status(400).json({ error: `Symbol ${upperSymbol} already exists` });
  }

  if (typeof closePrice !== "number" || closePrice <= 0) {
    return res.status(400).json({ error: "closePrice must be > 0" });
  }

  const symbolObj = { symbol: upperSymbol, closePrice, name, market };
  SYMBOLS.push(symbolObj);
  saveSymbols(SYMBOLS);
  symbolMap[upperSymbol] = symbolObj;

  broadcast({ type: "symbolsUpdated", newSymbol: symbolObj });

  res.status(201).json(symbolObj);
}
