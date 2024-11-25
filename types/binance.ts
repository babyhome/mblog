interface OrderBookEntry {
  price: number;
  quantity: number;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface BinanceDepthResponse {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

interface BinanceWebSocketMessage {
  e: string;          // Event type
  E: number;          // Event time
  s: string;          // Symbol
  U: number;          // First update ID in event
  u: number;          // Final update ID in event
  b: [string, string][]; // Bids to be updated
  a: [string, string][]; // Asks to be updated
}