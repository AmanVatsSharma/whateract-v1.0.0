"use client";

import { FormEvent, useMemo, useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { defaultWatchlist } from "@/lib/trading/watchlist";
import { isWithinTradingWindow } from "@/lib/trading/time-windows";
import { Instrument, OrderInput, OrderSide, OrderType } from "@/lib/trading/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, Loader2, ShieldCheck, TrendingUp } from "lucide-react";

const watchlist = defaultWatchlist;

/**
 * Dedicated trading surface that demonstrates the instant pending-order UX the
 * user requested. Orders stay visible with a live timer until the broker/API
 * responds, so traders never see their request vanish prematurely.
 */
export default function TradingPage() {
  const [instrument, setInstrument] = useState<Instrument>(watchlist[0]);
  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState<number>(instrument.lotSize);
  const [price, setPrice] = useState<number>(instrument.price);
  const [notes, setNotes] = useState<string>("");
  const { orders, positions, metrics, activeOrderId, closingPositionId, placeOrder, closePosition } =
    useOrders();

  const windowInfo = useMemo(() => isWithinTradingWindow(instrument.exchange), [instrument]);
  const disablePriceInput = orderType === "MARKET";

  /**
   * Ensures the order payload is ready and hands it over to the hook which keeps
   * the pending row shown until the API promise settles.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("[TradingPage] submit", { symbol: instrument.symbol, side, orderType, quantity, price });
    const payload: OrderInput = {
      instrument,
      side,
      orderType,
      quantity,
      price: disablePriceInput ? undefined : price,
      notes,
    };

    await placeOrder(payload);
    setNotes("");
  };

  /**
   * Derived color-coded badge for each order status.
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLIENT_PENDING":
        return <Badge className="bg-amber-500/15 text-amber-500 border border-amber-500/40">Client Pending</Badge>;
      case "PENDING_EXCHANGE":
        return (
          <Badge className="bg-blue-500/15 text-blue-500 border border-blue-500/40">
            Exchange Pending
          </Badge>
        );
      case "CONFIRMED":
        return <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/40">Confirmed</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500/15 text-red-500 border border-red-500/40">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Trading Cockpit
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Orders stay in view as pending until the broker confirms or rejects them.
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Pending: {metrics.pendingCount}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Avg latency: {metrics.avgLatencyMs} ms
          </div>
          {metrics.lastLatencyMs && (
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1">
              <Loader2 className="h-3.5 w-3.5 text-primary" />
              Last fill: {metrics.lastLatencyMs} ms
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-border/70">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Smart Watchlist</CardTitle>
            <CardDescription>Live trading window guardrails for NSE_EQ, NSE_FO, MCX_FO.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {watchlist.map((item) => {
              const info = isWithinTradingWindow(item.exchange);
              return (
                <div
                  key={item.symbol}
                  className={cn(
                    "flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl border transition",
                    instrument.symbol === item.symbol ? "border-primary bg-primary/5" : "border-border/60"
                  )}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{item.symbol}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Badge variant="outline">{item.exchange}</Badge>
                    <span className="font-semibold text-foreground">
                      ₹{item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        item.changePercent >= 0 ? "text-emerald-500" : "text-red-500"
                      )}
                    >
                      {item.changePercent}%
                    </span>
                    <Badge className={info.allowed ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"}>
                      {info.allowed ? "Open" : "Closed"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("[TradingPage] instrument selected", item.symbol);
                        setInstrument(item);
                        setQuantity(item.lotSize);
                        setPrice(item.price);
                      }}
                    >
                      Trade
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Instant Order Ticket</CardTitle>
            <CardDescription>Order stays pinned as pending until the API call responds.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Instrument</Label>
                <Select
                  value={instrument.symbol}
                  onValueChange={(val) => {
                    const next = watchlist.find((item) => item.symbol === val);
                    if (next) {
                      console.log("[TradingPage] instrument select", next.symbol);
                      setInstrument(next);
                      setQuantity(next.lotSize);
                      setPrice(next.price);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchlist.map((item) => (
                      <SelectItem key={item.symbol} value={item.symbol}>
                        {item.symbol} • {item.exchange}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {windowInfo.message}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Side</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["BUY", "SELL"] as OrderSide[]).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={side === option ? "default" : "outline"}
                      onClick={() => {
                        console.log("[TradingPage] side changed", option);
                        setSide(option);
                      }}
                      className={cn(side === option ? "bg-primary text-primary-foreground" : "border-dashed")}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Order Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["MARKET", "LIMIT"] as OrderType[]).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={orderType === option ? "default" : "outline"}
                      onClick={() => {
                        console.log("[TradingPage] orderType changed", option);
                        setOrderType(option);
                      }}
                      className={cn(orderType === option ? "bg-primary text-primary-foreground" : "border-dashed")}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={instrument.lotSize}
                    step={instrument.lotSize}
                    value={quantity}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      console.log("[TradingPage] quantity updated", value);
                      setQuantity(value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={price}
                    disabled={disablePriceInput}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      console.log("[TradingPage] price updated", value);
                      setPrice(value);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  placeholder="Risk alerts, execution instructions..."
                  onChange={(event) => {
                    console.log("[TradingPage] notes updated");
                    setNotes(event.target.value);
                  }}
                />
              </div>

              <Button type="submit" disabled={!!activeOrderId}>
                {activeOrderId ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Waiting for broker...
                  </span>
                ) : (
                  "Place order"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/70">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Live Orders</CardTitle>
            <CardDescription>Optimistic entries stay until API resolution.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground">Place your first order to see the stream.</p>
            )}
            {orders.map((order) => (
              <div key={order.clientOrderId} className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {order.instrument.symbol} • {order.side}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString("en-IN")}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Qty: {order.quantity} @ {order.price ?? "Market"} • Type: {order.orderType}
                </div>
                {order.error && <p className="text-sm text-destructive">Error: {order.error}</p>}
                {order.latencyMs && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Latency: {order.latencyMs} ms
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Open Positions</CardTitle>
            <CardDescription>Closing waits for confirmation just like orders.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {positions.length === 0 && (
              <p className="text-sm text-muted-foreground">No live positions.</p>
            )}
            {positions.map((position) => (
              <div key={position.id} className="p-4 rounded-xl border border-border/60 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {position.instrument.symbol} • {position.side}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg ₹{position.avgPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Badge variant="outline">Qty: {position.quantity}</Badge>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span>
                    MTM:{" "}
                    <span className={position.mtm >= 0 ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                      ₹{position.mtm.toLocaleString("en-IN")}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => closePosition(position.id)}
                    disabled={closingPositionId === position.id}
                  >
                    {closingPositionId === position.id ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Closing...
                      </span>
                    ) : (
                      "Close position"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
