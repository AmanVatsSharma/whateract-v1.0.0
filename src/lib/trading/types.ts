/**
 * Trading domain type definitions that power the order & position flows.
 * Having a single shared contract keeps the UI, hook logic, and API layer
 * perfectly aligned while making it easier to document expectations.
 */

export type Exchange = "NSE_EQ" | "NSE_FO" | "MCX_FO";

export interface TradingWindow {
  readonly label: string;
  readonly startHour: number;
  readonly startMinute: number;
  readonly endHour: number;
  readonly endMinute: number;
}

export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";

export type OrderStatus =
  | "CLIENT_PENDING"
  | "PENDING_EXCHANGE"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

export interface Instrument {
  readonly symbol: string;
  readonly name: string;
  readonly exchange: Exchange;
  readonly segment: string;
  readonly tickSize: number;
  readonly lotSize: number;
  readonly price: number;
  readonly changePercent: number;
}

export interface OrderInput {
  readonly instrument: Instrument;
  readonly side: OrderSide;
  readonly quantity: number;
  readonly orderType: OrderType;
  readonly price?: number;
  readonly notes?: string;
}

export interface ClientOrder extends OrderInput {
  readonly clientOrderId: string;
  readonly status: OrderStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly latencyMs?: number;
  readonly error?: string;
  readonly filledQuantity?: number;
  readonly fillPrice?: number;
}

export interface ServerOrderResponse {
  readonly orderId: string;
  readonly status: OrderStatus;
  readonly filledQuantity: number;
  readonly averagePrice?: number;
  readonly rejectReason?: string;
  readonly serverTimestamp: string;
}

export interface Position {
  readonly id: string;
  readonly instrument: Instrument;
  readonly side: OrderSide;
  readonly quantity: number;
  readonly avgPrice: number;
  readonly mtm: number;
}

export interface TradingWindowValidation {
  readonly allowed: boolean;
  readonly message: string;
  readonly window: TradingWindow;
  readonly nowIst: Date;
}
