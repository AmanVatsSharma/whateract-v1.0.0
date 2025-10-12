import { createLogger } from "@/lib/logger";

const logger = createLogger("mocks");

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type MockHandler<T> = () => Promise<T> | T;

export class MockRegistry {
  private routes = new Map<string, MockHandler<unknown>>();

  register<T>(method: string, path: string, handler: MockHandler<T>): void {
    const key = `${method.toUpperCase()} ${path}`;
    logger.info("register", key);
    this.routes.set(key, handler as MockHandler<unknown>);
  }

  async handle(method: string, path: string): Promise<unknown> {
    const key = `${method.toUpperCase()} ${path}`;
    const handler = this.routes.get(key);
    if (!handler) throw new Error(`No mock for ${key}`);
    logger.debug("hit", key);
    return handler();
  }
}

export const mocks = new MockRegistry();

// Example fixtures
mocks.register("GET", "/conversations", async () => {
  await delay(300);
  return {
    data: [
      {
        id: "conv_1",
        name: "Jane Cooper",
        lastMessage: "Can you share the catalog?",
        unread: 2,
        priority: "high",
        tags: ["VIP", "Return"],
      },
      {
        id: "conv_2",
        name: "Devon Lane",
        lastMessage: "Thanks!",
        unread: 0,
        priority: "low",
        tags: ["New"],
      },
    ],
  };
});

mocks.register("GET", "/campaigns", async () => {
  await delay(400);
  return {
    data: [
      {
        id: "cmp_1",
        name: "Diwali Blast",
        status: "Active",
        sent: 12000,
        delivered: 11500,
        read: 9800,
        responded: 2100,
        conversionRate: 17.5,
        roi: 280,
      },
      {
        id: "cmp_2",
        name: "Winter Sale",
        status: "Draft",
        sent: 0,
        delivered: 0,
        read: 0,
        responded: 0,
        conversionRate: 0,
        roi: 0,
      },
      {
        id: "cmp_3",
        name: "Feedback Survey",
        status: "Scheduled",
        sent: 0,
        delivered: 0,
        read: 0,
        responded: 0,
        conversionRate: 0,
        roi: 0,
      },
    ],
  };
});
