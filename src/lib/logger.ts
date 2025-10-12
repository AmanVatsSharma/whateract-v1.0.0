export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

const levelPriority: Record<LogLevel, number> = {
  silent: 5,
  error: 4,
  warn: 3,
  info: 2,
  debug: 1,
};

function getEnvLevel(): LogLevel {
  if (typeof window === "undefined") return "info";
  const level = (process.env.NEXT_PUBLIC_LOG_LEVEL || "info").toLowerCase();
  if (["silent", "error", "warn", "info", "debug"].includes(level)) {
    return level as LogLevel;
  }
  return "info";
}

export class Logger {
  private namespace: string;
  private level: LogLevel;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.level = getEnvLevel();
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    return levelPriority[messageLevel] >= levelPriority[this.level];
  }

  private format(args: unknown[]): unknown[] {
    return [
      `%c[${this.namespace}]`,
      "color:#A78BFA;font-weight:bold",
      ...args,
    ];
  }

  debug(...args: unknown[]): void {
    if (!this.shouldLog("debug")) return;
    // eslint-disable-next-line no-console
    console.debug(...this.format(args));
  }

  info(...args: unknown[]): void {
    if (!this.shouldLog("info")) return;
    // eslint-disable-next-line no-console
    console.info(...this.format(args));
  }

  warn(...args: unknown[]): void {
    if (!this.shouldLog("warn")) return;
    // eslint-disable-next-line no-console
    console.warn(...this.format(args));
  }

  error(...args: unknown[]): void {
    if (!this.shouldLog("error")) return;
    // eslint-disable-next-line no-console
    console.error(...this.format(args));
  }
}

export const createLogger = (ns: string) => new Logger(ns);
