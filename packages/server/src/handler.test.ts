import { describe, expect, it, vi } from "vitest";
import { HttpError } from "./errors";
import { createRunHandler, json } from "./handler";
import type { Logger } from "./logger";

const logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() } satisfies Logger;

describe("runHandler", () => {
    const runHandler = createRunHandler(logger);

    it("returns the handler response", async () => {
        const response = await runHandler(async () => json({ ok: true }, 201));
        expect(response.status).toBe(201);
        await expect(response.json()).resolves.toEqual({ ok: true });
    });

    it("maps known errors without logging them", async () => {
        const response = await runHandler(async () => {
            throw new HttpError(404, "Not found", "NOT_FOUND");
        });
        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ message: "Not found", code: "NOT_FOUND" });
        expect(logger.error).not.toHaveBeenCalled();
    });

    it("logs unexpected errors and hides them", async () => {
        const response = await runHandler(async () => {
            throw new Error("secret");
        });
        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({ message: "Internal server error.", code: "INTERNAL" });
        expect(logger.error).toHaveBeenCalledOnce();
    });

    it("works without a logger and accepts ResponseInit", async () => {
        const response = await createRunHandler()(async () => json({ a: 1 }, { status: 202, headers: { "x-a": "1" } }));
        expect(response.status).toBe(202);
        expect(response.headers.get("x-a")).toBe("1");
    });
});
