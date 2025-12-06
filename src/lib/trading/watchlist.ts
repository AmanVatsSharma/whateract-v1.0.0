import { Instrument } from "@/lib/trading/types";

/**
 * Static watchlist we can surface in the UI while the backend wiring catches up.
 * Each instrument intentionally covers NSE_EQ, NSE_FO, and MCX_FO to demonstrate
 * the exchange-specific behaviours and trading windows.
 */
export const defaultWatchlist: Instrument[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE_EQ",
    segment: "Largecap",
    tickSize: 0.05,
    lotSize: 1,
    price: 2815.4,
    changePercent: 0.84,
  },
  {
    symbol: "NIFTY24DECFUT",
    name: "NIFTY Dec Futures",
    exchange: "NSE_FO",
    segment: "Index Futures",
    tickSize: 0.05,
    lotSize: 50,
    price: 23215.5,
    changePercent: -0.12,
  },
  {
    symbol: "CRUDEOIL24NOVFUT",
    name: "MCX Crude Oil Nov",
    exchange: "MCX_FO",
    segment: "Commodity Futures",
    tickSize: 1,
    lotSize: 100,
    price: 6645,
    changePercent: 1.1,
  },
];
