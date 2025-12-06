import { Exchange, TradingWindow, TradingWindowValidation } from "@/lib/trading/types";

/**
 * All trading window definitions are centralized here so UI, validation, and
 * docs never drift apart. Times are always interpreted in IST (Asia/Kolkata).
 */
export const tradingWindows: Record<Exchange, TradingWindow> = {
  NSE_EQ: {
    label: "NSE Cash (EQ)",
    startHour: 9,
    startMinute: 15,
    endHour: 15,
    endMinute: 30,
  },
  NSE_FO: {
    label: "NSE F&O",
    startHour: 9,
    startMinute: 15,
    endHour: 15,
    endMinute: 30,
  },
  MCX_FO: {
    label: "MCX F&O",
    startHour: 9,
    startMinute: 0,
    endHour: 23,
    endMinute: 55,
  },
};

const IST_OFFSET_MINUTES = 330; // UTC+5:30

/**
 * Convert the provided date to IST without relying on browser locale quirks.
 */
export function getIstDate(base: Date = new Date()): Date {
  const utcMillis = base.getTime() + base.getTimezoneOffset() * 60_000;
  return new Date(utcMillis + IST_OFFSET_MINUTES * 60_000);
}

/**
 * Calculate whether the provided exchange is currently tradable.
 */
export function isWithinTradingWindow(
  exchange: Exchange,
  now: Date = new Date()
): TradingWindowValidation {
  const istNow = getIstDate(now);
  const window = tradingWindows[exchange];
  const minutesFromMidnight = istNow.getHours() * 60 + istNow.getMinutes();
  const startMinutes = window.startHour * 60 + window.startMinute;
  const endMinutes = window.endHour * 60 + window.endMinute;
  const allowed = minutesFromMidnight >= startMinutes && minutesFromMidnight <= endMinutes;

  const message = allowed
    ? `${window.label} window open until ${formatIstTime(window.endHour, window.endMinute)}`
    : `${window.label} window closed. Opens at ${formatIstTime(window.startHour, window.startMinute)} and closes at ${formatIstTime(
        window.endHour,
        window.endMinute
      )}`;

  console.log("[TradingWindows] validation result", {
    exchange,
    allowed,
    istTime: istNow.toISOString(),
    window,
  });

  return { allowed, message, window, nowIst: istNow };
}

/**
 * Helper string formatter for HH:mm output.
 */
function formatIstTime(hours: number, minutes: number): string {
  const paddedHours = `${hours}`.padStart(2, "0");
  const paddedMinutes = `${minutes}`.padStart(2, "0");
  return `${paddedHours}:${paddedMinutes} IST`;
}
