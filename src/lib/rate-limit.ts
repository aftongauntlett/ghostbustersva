/**
 * Rate limiting utility.
 * Uses Upstash Redis in production; falls back to an in-memory map for local dev.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

// In-memory fallback (not durable across restarts — acceptable for local dev)
const memoryStore = new Map<string, number[]>();

async function checkMemoryRateLimit(key: string): Promise<{ limited: boolean }> {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (memoryStore.get(key) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= MAX_REQUESTS) {
    return { limited: true };
  }
  timestamps.push(now);
  memoryStore.set(key, timestamps);
  return { limited: false };
}

async function checkUpstashRateLimit(key: string): Promise<{ limited: boolean }> {
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const redis = new Redis({
    url: import.meta.env.UPSTASH_REDIS_REST_URL!,
    token: import.meta.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "10 m"),
  });

  const result = await ratelimit.limit(key);
  return { limited: !result.success };
}

export async function checkRateLimit(key: string): Promise<{ limited: boolean }> {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      return await checkUpstashRateLimit(key);
    } catch (err) {
      console.error({ event: "rate_limit_upstash_error", err });
      // Fall through to memory fallback on error
    }
  }

  return checkMemoryRateLimit(key);
}

export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

