import { describe, expect, it } from "vitest";
import { HttpError } from "./errors";
import { assertWithinLimit, clientIp, createRateLimiter } from "./rateLimit";

describe("createRateLimiter", () => {
    it("allows up to the limit within the window, then frees up", () => {
        let time = 0;
        const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });
        expect([limiter.consume("ip"), limiter.consume("ip"), limiter.consume("ip")]).toEqual([true, true, false]);
        expect(limiter.consume("other")).toBe(true);
        time = 1000;
        expect(limiter.consume("ip")).toBe(true);
    });

    it("resets a key", () => {
        const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
        limiter.consume("ip");
        limiter.reset("ip");
        expect(limiter.consume("ip")).toBe(true);
    });
});

describe("assertWithinLimit", () => {
    it("throws 429 over the limit", () => {
        const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
        assertWithinLimit(limiter, "ip");
        expect(() => assertWithinLimit(limiter, "ip")).toThrow(HttpError);
    });
});

describe("clientIp", () => {
    it("reads the first forwarded address, then x-real-ip", () => {
        expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
        expect(clientIp(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
        expect(clientIp(new Headers())).toBe("unknown");
    });
});
