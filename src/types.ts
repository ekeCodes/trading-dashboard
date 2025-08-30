export type SymbolInfo = {
  symbol: string;
  name: string;
  market: string;
  closePrice: number;
}

export type Order = {
  id: number;
  symbol: string;
  side: 'BUY'|'SELL';
  qty: number;
  price: number;
  timestamp: number;
}

export type Tick = {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}
