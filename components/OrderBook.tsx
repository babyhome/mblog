"use client"
import React, { useEffect, useState } from "react";
import '@/types/binance';
import { Card } from "primereact/card";

interface Order {
  price: string;
  quantity: string;
}

interface OrderBookProps {
  symbol: string; // e.g. ETHUSDT
}

const BINANCE_WS_URL: string = 'wss://stream.binance.com:9443/ws';
const DEPTH_LIMIT: number = 10;

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({
    bids: [],
    asks: []
  });
  // const [symbol, setSymbol] = useState<string>('btcusdt');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    // เริ่มต้นด้วยการดึงข้อมูล snapshot
    const fetchOrderBookSnapshot = async (): Promise<void> => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=1000`)
        const data: BinanceDepthResponse = await response.json();
        console.log(data);

        setOrderBook({
          bids: data.bids.slice(0, DEPTH_LIMIT).map(([price, quantity]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity),
          })),
          asks: data.asks.slice(0, DEPTH_LIMIT).map(([price, quantity]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity)
          }))
        });
        setLoading(false);

      } catch (err) {
        console.error('Error fetching order book:', err);
      }
    }

    // WebSocket connection
    const ws = new WebSocket(BINANCE_WS_URL);

    ws.onopen = (): void => {
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@depth@100ms`],
        id: 1
      }));
    };

    // ws.onmessage = (event: MessageEvent) => {
    //   const data: any = JSON.parse(event.data);
    //   console.log('onmessage:', data.e);
      
    //   if(data.e === 'depthUpdate') {
    //     setOrderBook(prevOrderBook => {
    //       // อัพเดทราคาเสนอซื้อ (bids)
    //       const newBids = [...prevOrderBook.bids];
    //       data.b.forEach(([price, quantity]) => {
    //         const priceFloat = parseFloat(price);
    //         const quantityFloat = parseFloat(quantity);
    //         const index = newBids.findIndex(bid => bid.price === priceFloat);

    //         if (quantityFloat === 0) {
    //           if (index !== -1) newBids.splice(index, 1);
    //         } else {
    //           if (index !== -1) {
    //             newBids[index].quantity = quantityFloat;
    //           } else {
    //             newBids.push({ price: priceFloat, quantity: quantityFloat });
    //           }
    //         }
    //       });


    //     })
    //   }
    // }
    ws.onmessage = (event: MessageEvent): void => {
      const data: BinanceWebSocketMessage = JSON.parse(event.data);
      
      if (data.e === 'depthUpdate') {
        setOrderBook(prevOrderBook => {
          // อัพเดทราคาเสนอซื้อ (bids)
          const newBids = [...prevOrderBook.bids];
          data.b.forEach(([price, quantity]) => {
            const priceFloat = parseFloat(price);
            const quantityFloat = parseFloat(quantity);
            const index = newBids.findIndex(bid => bid.price === priceFloat);
            
            if (quantityFloat === 0) {
              if (index !== -1) newBids.splice(index, 1);
            } else {
              if (index !== -1) {
                newBids[index].quantity = quantityFloat;
              } else {
                newBids.push({ price: priceFloat, quantity: quantityFloat });
              }
            }
          });
          
          // อัพเดทราคาเสนอขาย (asks)
          const newAsks = [...prevOrderBook.asks];
          data.a.forEach(([price, quantity]) => {
            const priceFloat = parseFloat(price);
            const quantityFloat = parseFloat(quantity);
            const index = newAsks.findIndex(ask => ask.price === priceFloat);
            
            if (quantityFloat === 0) {
              if (index !== -1) newAsks.splice(index, 1);
            } else {
              if (index !== -1) {
                newAsks[index].quantity = quantityFloat;
              } else {
                newAsks.push({ price: priceFloat, quantity: quantityFloat });
              }
            }
          });

          return {
            bids: newBids.sort((a, b) => b.price - a.price).slice(0, DEPTH_LIMIT),
            asks: newAsks.sort((a, b) => a.price - b.price).slice(0, DEPTH_LIMIT)
          };
        });
      }
    };

    fetchOrderBookSnapshot();

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [symbol]);

  const formatPrice = (price: number): string => price.toFixed(2);
  const formatQuantity = (quantity: number): string => quantity.toFixed(6);

  if (loading) {
    return <div className="text-center p-4">Loading Order Book...</div>
  }

  return (
    <div>
      <h2>Order Book: {symbol.toUpperCase()}</h2>
      <Card className="max-w-2xl mx-auto" title={symbol?.toUpperCase()}>
        <h3>Bids</h3>
        <div className="space-y-1">
          {orderBook.bids.map((bid) => (
            <div key={bid.price} className="grid grid-cols-2 text-green-500">
              <span>{formatPrice(bid.price)}</span>
              <span className="text-right">{formatQuantity(bid.quantity)}</span>
            </div>
          ))}
        </div>

        <h3>Asks</h3>
          <div className="space-y-1">
            {orderBook.asks.map((ask) => (
              <div key={ask.price} className="grid grid-cols-2 text-red-500">
                <span>{formatPrice(ask.price)}</span>
                <span className="text-right">{formatQuantity(ask.quantity)}</span>
              </div>
            ))}
          </div>
      </Card>
    </div>
  )
}

export default OrderBook