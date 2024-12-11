"use client"
import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { MultiSelect } from "primereact/multiselect";
import { useForm } from "react-hook-form";
import { draftMode } from "next/headers";

type Props = {}

interface TickerResponse {
    symbol: string;
    priceChange:  string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    lastPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

interface RootObject {
    timezone: string;
    serverTime: number;
    rateLimits: RateLimit[];
    exchangeFilters: any[];
    symbols: Symbol[];
}
interface Symbol {
    symbol: string;
    status: string;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quotePrecision: number;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: string[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    otoAllowed: boolean;
    quoteOrderQtyMarketAllowed: boolean;
    allowTrailingStop: boolean;
    cancelReplaceAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: Filter[];
    permissions: any[];
    permissionSets: string[][];
    defaultSelfTradePreventionMode: string;
    allowedSelfTradePreventionModes: string[];
}
interface Filter {
    filterType: string;
    minPrice?: string;
    maxPrice?: string;
    tickSize?: string;
    minQty?: string;
    maxQty?: string;
    stepSize?: string;
    limit?: number;
    minTrailingAboveDelta?: number;
    maxTrailingAboveDelta?: number;
    minTrailingBelowDelta?: number;
    maxTrailingBelowDelta?: number;
    bidMultiplierUp?: string;
    bidMultiplierDown?: string;
    askMultiplierUp?: string;
    askMultiplierDown?: string;
    avgPriceMins?: number;
    minNotional?: string;
    applyMinToMarket?: boolean;
    maxNotional?: string;
    applyMaxToMarket?: boolean;
    maxNumOrders?: number;
    maxNumAlgoOrders?: number;
}
interface RateLimit {
    rateLimitType: string;
    interval: string;
    intervalNum: number;
    limit: number;
}

export default function pages({}: Props) {

    const [tickers, setTickers] = useState<Map<string, TickerResponse>>();
    const [response, setResponse] = useState<any[]>([]);
    const [selectedSymbol, setSelectedSymbol] = useState([]);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchTickerBinance = async () => {
            try {
                const response = await fetch(`https://api.binance.com/api/v3/ticker?symbols=["BTCUSDT","ETHUSDT","ETHBTC","PENDLEUSDT"]&windowSize=1m`);
                const data = await response.json();
                // console.log(typeof(data), data);
                setResponse(data);

                let tickerResponses = new Map<string, TickerResponse>();
                data?.map((item: TickerResponse) => {
                    tickerResponses.set(item.symbol, item);
                });
                setTickers(tickerResponses);

                console.log(tickerResponses);

            } catch (err) {
                console.log("Error fetching data ticker:", err);
            }
        }

        const fetchInfosBinance = async () => {
            try {
                const resp = await fetch(`https://api.binance.com/api/v3/exchangeInfo?symbols=["BTCUSDT","BNBBTC","ETHUSDT","BNBUSDT"]`, {
                    method: "GET",
                })
                const json = await resp.json();
                console.log(typeof(json), json.symbols);
                setResponse(json.symbols);
            } catch (err) {
                console.error("Error fetch", err);
            }
            
        }

        fetchInfosBinance();

        return () => {
            console.log('return');
            
        };
    }, []);

    const handleSelectedItems = (e: any) => {
        console.log(e);
        setSelectedSymbol(e.value)
    }

    return (
        <div className="container text-center flex flex-col justify-center">
            <h2 className="font-bold text-lg">DND Kit</h2>
            <div className="text-center">
                {response?.map((t) => (
                    // <div key={t.symbol}>{JSON.stringify(t)}</div>
                    <div key={t.symbol}>
                        <p>{t.symbol} {t.openPrice}</p>
                        <p>{tickers && JSON.stringify(tickers.get(t.symbol))}</p>
                    </div>
                ))}
            </div>
            <div className="card flex justify-center">
                <MultiSelect 
                    value={selectedSymbol} 
                    onChange={(e) => handleSelectedItems(e)} 
                    options={response} 
                    optionLabel="symbol" 
                    optionValue="symbol" 
                    placeholder="Select symbols" 
                    className="w-full md:w-20rem border-spacing-1 border-collapse border-2 p-2" />
            </div>
        </div>
    )
}