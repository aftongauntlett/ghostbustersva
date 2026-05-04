import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const memoryStore = new Map<string, number[]>();

function checkMemoryRateLimit(key: string): { limited: boolean } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (memoryStore.get(key) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= MAX_REQUESTS) return { limited: true };
  timestamps.push(now);
  memoryStore.set(key, timestamps);
  return { limited: false };
}

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "10 m"),
    });
  }
  return limiter;
}

export async function checkRateLimit(key: string): Promise<{ limited: boolean }> {
  try {
    const rl = getLimiter();
    if (!rl) return checkMemoryRateLimit(key);
    const { success } = await rl.limit(key);
    return { limited: !success };
  } catch {
    return checkMemoryRateLimit(key);
  }
}

export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
