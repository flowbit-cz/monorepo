import { HttpError } from "./errors";

/** Limit: at most `limit` requests per key within `windowMs`. */
export interface RateLimitOptions {
    limit: number;
    windowMs: number;
    /** Clock, replaceable in tests. */
    now?: () => number;
}

/**
 * Sliding-window rate limiter in process memory. Enough for one instance. With several replicas
 * the limit applies per instance, so put a shared limiter (WAF / Redis) in front of critical endpoints.
 */
export function createRateLimiter({ limit, windowMs, now = Date.now }: RateLimitOptions) {
    const hits = new Map<string, number[]>();
    return {
        /** Counts a request. It returns `false` once the key is over the limit. */
        consume(key: string): boolean {
            const time = now();
            const recent = (hits.get(key) ?? []).filter((t) => time - t < windowMs);
            const allowed = recent.length < limit;
            if (allowed) recent.push(time);
            hits.set(key, recent);
            return allowed;
        },
        reset(key: string): void {
            hits.delete(key);
        },
    };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;

/** Client IP from reverse-proxy headers (CloudFront / ALB set X-Forwarded-For). */
export function clientIp(headers: Headers): string {
    return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Throws 429 when the key is over the limit. `runHandler` turns it into a response. */
export function assertWithinLimit(limiter: RateLimiter, key: string): void {
    if (!limiter.consume(key)) throw new HttpError(429, "Too many requests.", "RATE_LIMITED");
}
