import { useState, useEffect } from "react";
import { Card } from 'primereact/card'
import OrderBook from "@/components/OrderBook";

type Props = {}

export default function pages({}: Props) {
  return (
    <div className="w-full h-full text-center">
      <div className="w-full">Binance Order Book</div>
      <OrderBook symbol="ETHUSDT" />
    </div>
  )
}

