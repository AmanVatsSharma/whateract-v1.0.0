import { apiClient } from "@/lib/api-client";
import { OrderInput, ServerOrderResponse } from "@/lib/trading/types";
import { isWithinTradingWindow } from "@/lib/trading/time-windows";

const API_TIMEOUT_MS = 15_000;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

/**
 * Sleep helper used by the mock fallback so we can simulate realistic latency.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Small helper that wraps axios requests with an AbortController driven timeout.
 */
async function postWithTimeout<T>(url: string, payload: unknown, label: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    console.log(`[OrderService] aborting ${label} after ${API_TIMEOUT_MS}ms`);
    controller.abort();
  }, API_TIMEOUT_MS);

  try {
    return await apiClient.post<T>(url, payload, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Core HTTP call for placing orders. We only resolve when the API responds so
 * the UI can keep showing the pending order chip for as long as necessary.
 */
export async function placeOrderRequest(input: OrderInput): Promise<ServerOrderResponse> {
  console.log("[OrderService] placeOrderRequest invoked", { instrument: input.instrument.symbol, side: input.side });
  const validation = isWithinTradingWindow(input.instrument.exchange);
  if (!validation.allowed) {
    console.log("[OrderService] blocked by trading window", validation);
    throw new Error(validation.message);
  }

  if (USE_MOCKS) {
    return simulateOrderResponse(input);
  }

  try {
    const response = await postWithTimeout<ServerOrderResponse>(
      "/orders",
      {
        instrument: input.instrument.symbol,
        exchange: input.instrument.exchange,
        side: input.side,
        quantity: input.quantity,
        orderType: input.orderType,
        price: input.price,
        notes: input.notes,
      },
      "placeOrder"
    );

    console.log("[OrderService] placeOrderRequest success", response.data);
    return response.data;
  } catch (error) {
    console.error("[OrderService] placeOrderRequest failed", error);
    throw error instanceof Error ? error : new Error("Order placement failed");
  }
}

/**
 * Close position endpoint wrapper.
 */
export async function closePositionRequest(positionId: string): Promise<ServerOrderResponse> {
  console.log("[OrderService] closePositionRequest invoked", { positionId });

  if (USE_MOCKS) {
    return simulateCloseResponse(positionId);
  }

  try {
    const response = await postWithTimeout<ServerOrderResponse>(
      "/positions/close",
      { positionId },
      "closePosition"
    );
    console.log("[OrderService] closePositionRequest success", response.data);
    return response.data;
  } catch (error) {
    console.error("[OrderService] closePositionRequest failed", error);
    throw error instanceof Error ? error : new Error("Close position failed");
  }
}

/**
 * Mocked order response generator that still respects the real trading window
 * validation so dev builds mimic production behaviour.
 */
async function simulateOrderResponse(input: OrderInput): Promise<ServerOrderResponse> {
  const baseLatency = Math.floor(Math.random() * 1200) + 600;
  console.log("[OrderService] simulateOrderResponse sleeping", { baseLatency });
  await sleep(baseLatency);
  const isRejected = Math.random() < 0.05;

  if (isRejected) {
    return {
      orderId: `rej_${crypto.randomUUID()}`,
      status: "REJECTED",
      filledQuantity: 0,
      rejectReason: "Simulated rejection",
      serverTimestamp: new Date().toISOString(),
    };
  }

  return {
    orderId: `ord_${crypto.randomUUID()}`,
    status: "CONFIRMED",
    filledQuantity: input.quantity,
    averagePrice: input.price ?? input.instrument.price,
    serverTimestamp: new Date().toISOString(),
  };
}

/**
 * Mock close position response with a slightly longer delay to mimic risk checks.
 */
async function simulateCloseResponse(positionId: string): Promise<ServerOrderResponse> {
  const baseLatency = Math.floor(Math.random() * 800) + 900;
  console.log("[OrderService] simulateCloseResponse sleeping", { baseLatency });
  await sleep(baseLatency);
  return {
    orderId: `cls_${positionId}`,
    status: "CONFIRMED",
    filledQuantity: 0,
    serverTimestamp: new Date().toISOString(),
  };
}
