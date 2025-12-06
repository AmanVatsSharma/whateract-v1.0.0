"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { closePositionRequest, placeOrderRequest } from "@/lib/trading/order-service";
import { ClientOrder, OrderInput, Position } from "@/lib/trading/types";
import { useToast } from "@/hooks/use-toast";

const initialPositions: Position[] = [
  {
    id: "pos_reliance",
    instrument: {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      exchange: "NSE_EQ",
      segment: "Largecap",
      tickSize: 0.05,
      lotSize: 1,
      price: 2815.4,
      changePercent: 0.84,
    },
    side: "BUY",
    quantity: 125,
    avgPrice: 2688.5,
    mtm: 1584.0,
  },
  {
    id: "pos_crudeoil",
    instrument: {
      symbol: "CRUDEOIL24NOVFUT",
      name: "MCX Crude Oil Nov",
      exchange: "MCX_FO",
      segment: "Commodity Futures",
      tickSize: 1,
      lotSize: 100,
      price: 6645,
      changePercent: 1.1,
    },
    side: "SELL",
    quantity: 200,
    avgPrice: 6712,
    mtm: 13400,
  },
];

const MAX_LATENCY_SAMPLES = 25;

interface OrderMetrics {
  pendingCount: number;
  avgLatencyMs: number;
  lastLatencyMs: number | null;
}

/**
 * Central hook that keeps optimistic orders pinned in the UI while the backend
 * confirms the trade. It never drops the card until the API response arrives,
 * eliminating the 2s drop-out that users reported earlier.
 */
export function useOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [latencySamples, setLatencySamples] = useState<number[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [closingPositionId, setClosingPositionId] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useOrders] state changed", { ordersCount: orders.length, positionsCount: positions.length });
  }, [orders, positions]);

  const metrics: OrderMetrics = useMemo(() => {
    const pendingCount = orders.filter((order) =>
      order.status === "CLIENT_PENDING" || order.status === "PENDING_EXCHANGE"
    ).length;
    const lastLatencyMs = latencySamples[0] ?? null;
    const avgLatencyMs =
      latencySamples.length === 0
        ? 0
        : Math.round(latencySamples.reduce((sum, sample) => sum + sample, 0) / latencySamples.length);
    return { pendingCount, avgLatencyMs, lastLatencyMs };
  }, [orders, latencySamples]);

  /**
   * Record the most recent latency samples so we can surface UX metrics.
   */
  const trackLatency = useCallback((latency: number) => {
    console.log("[useOrders] recording latency", { latency });
    setLatencySamples((prev) => {
      const next = [latency, ...prev];
      return next.slice(0, MAX_LATENCY_SAMPLES);
    });
  }, []);

  /**
   * Small helper that keeps the optimistic order array immutable.
   */
  const updateOrder = useCallback((orderId: string, patch: Partial<ClientOrder>) => {
    setOrders((prev) =>
      prev.map((order) => (order.clientOrderId === orderId ? { ...order, ...patch } : order))
    );
  }, []);

  /**
   * Optimistic order submitter that leaves the row visible until the API call
   * settles, giving users the instant feedback they asked for.
   */
  const placeOrder = useCallback(
    async (input: OrderInput) => {
      console.log("[useOrders] placeOrder triggered", { symbol: input.instrument.symbol, side: input.side });
      const clientOrderId = crypto.randomUUID();
      const nowIso = new Date().toISOString();
      const optimisticOrder: ClientOrder = {
        ...input,
        clientOrderId,
        status: "CLIENT_PENDING",
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setActiveOrderId(clientOrderId);
      setOrders((prev) => [optimisticOrder, ...prev]);

      try {
        const start = performance.now?.() ?? Date.now();
        const serverResponse = await placeOrderRequest(input);
        const latency = Math.round((performance.now?.() ?? Date.now()) - start);
        trackLatency(latency);

        const status = serverResponse.status === "CONFIRMED" ? "CONFIRMED" : "PENDING_EXCHANGE";
        console.log("[useOrders] server response", { serverResponse, latency });

        updateOrder(clientOrderId, {
          status,
          updatedAt: serverResponse.serverTimestamp,
          filledQuantity: serverResponse.filledQuantity,
          fillPrice: serverResponse.averagePrice ?? input.price,
          latencyMs: latency,
          error: serverResponse.rejectReason,
        });

        if (serverResponse.status === "CONFIRMED") {
          setPositions((prev) => {
            const existing = prev.find((pos) => pos.instrument.symbol === input.instrument.symbol);
            if (!existing) {
              return [
                {
                  id: `pos_${input.instrument.symbol}`,
                  instrument: input.instrument,
                  side: input.side,
                  quantity: input.quantity,
                  avgPrice: serverResponse.averagePrice ?? input.price ?? input.instrument.price,
                  mtm: 0,
                },
                ...prev,
              ];
            }

            const quantityDelta = input.side === "BUY" ? input.quantity : -input.quantity;
            const newQuantity = Math.max(existing.quantity + quantityDelta, 0);
            const nextPositions = prev.map((pos) =>
              pos.id === existing.id
                ? {
                    ...pos,
                    quantity: newQuantity,
                    avgPrice: serverResponse.averagePrice ?? pos.avgPrice,
                  }
                : pos
            );
            return nextPositions;
          });

          toast({
            title: "Order confirmed",
            description: `${input.instrument.symbol} ${input.side} ${input.quantity} @ ${
              serverResponse.averagePrice ?? input.price ?? input.instrument.price
            }`,
          });
        } else {
          toast({
            title: "Order pending exchange",
            description: `${input.instrument.symbol} still awaiting exchange ack`,
          });
        }
      } catch (error) {
        console.error("[useOrders] placeOrder failed", error);
        const message = error instanceof Error ? error.message : "Order placement failed";
        updateOrder(clientOrderId, {
          status: "REJECTED",
          updatedAt: new Date().toISOString(),
          error: message,
        });

        toast({
          title: "Order failed",
          description: message,
          variant: "destructive",
        });

        throw error;
      } finally {
        setActiveOrderId(null);
      }
    },
    [toast, trackLatency, updateOrder]
  );

  /**
   * Close position flow mirrors the order placement UX so the pending pill
   * remains visible until the broker acknowledges the exit.
   */
  const closePosition = useCallback(
    async (positionId: string) => {
      console.log("[useOrders] closePosition triggered", { positionId });
      setClosingPositionId(positionId);
      const position = positions.find((pos) => pos.id === positionId);
      if (!position) {
        console.warn("[useOrders] attempted to close missing position", { positionId });
        setClosingPositionId(null);
        return;
      }

      try {
        const start = performance.now?.() ?? Date.now();
        const response = await closePositionRequest(positionId);
        const latency = Math.round((performance.now?.() ?? Date.now()) - start);
        trackLatency(latency);
        console.log("[useOrders] closePosition success", { response, latency });

        setPositions((prev) => prev.filter((pos) => pos.id !== positionId));
        toast({
          title: "Position closed",
          description: `${position.instrument.symbol} exited successfully`,
        });
      } catch (error) {
        console.error("[useOrders] closePosition failed", error);
        const message = error instanceof Error ? error.message : "Close position failed";
        toast({
          title: "Close position failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setClosingPositionId(null);
      }
    },
    [positions, toast, trackLatency]
  );

  return {
    orders,
    positions,
    metrics,
    activeOrderId,
    closingPositionId,
    placeOrder,
    closePosition,
  };
}
