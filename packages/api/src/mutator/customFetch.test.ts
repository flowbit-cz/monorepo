import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, isApiError } from "./ApiError";
import { configureApi, resetApiConfig } from "./config";
import { customFetch, isServerMocking, joinUrl } from "./customFetch";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => configureApi({ baseUrl: "https://api.test/v1" }));
afterEach(() => {
    server.resetHandlers();
    resetApiConfig();
});
afterAll(() => server.close());

describe("joinUrl", () => {
    it.each([
        ["https://api.test/v1", "/offers", "https://api.test/v1/offers"],
        ["https://api.test/v1/", "offers", "https://api.test/v1/offers"],
        ["https://api.test/v1//", "//offers", "https://api.test/v1/offers"],
        ["https://api.test", "https://other.test/x", "https://other.test/x"],
    ])("%s + %s", (base, path, expected) => {
        expect(joinUrl(base, path)).toBe(expected);
    });
});

describe("customFetch", () => {
    it("returns parsed JSON and sends configured headers", async () => {
        configureApi({ headers: () => ({ "X-Market": "de" }) });
        server.use(
            http.get("https://api.test/v1/offers", ({ request }) =>
                HttpResponse.json({ market: request.headers.get("x-market"), accept: request.headers.get("accept") }),
            ),
        );
        await expect(customFetch("/offers")).resolves.toEqual({ market: "de", accept: "application/json" });
    });

    it("sets Content-Type for requests with a body", async () => {
        server.use(
            http.post("https://api.test/v1/echo", async ({ request }) =>
                HttpResponse.json({ type: request.headers.get("content-type"), body: await request.json() }),
            ),
        );
        await expect(customFetch("/echo", { method: "POST", body: JSON.stringify({ a: 1 }) })).resolves.toEqual({
            type: "application/json",
            body: { a: 1 },
        });
    });

    it("returns undefined for 204 and empty bodies", async () => {
        server.use(
            http.delete("https://api.test/v1/x", () => new HttpResponse(null, { status: 204 })),
            http.get("https://api.test/v1/empty", () => new HttpResponse("", { status: 200 })),
        );
        await expect(customFetch("/x", { method: "DELETE" })).resolves.toBeUndefined();
        await expect(customFetch("/empty")).resolves.toBeUndefined();
    });

    it("throws ApiError with problem details", async () => {
        server.use(
            http.get("https://api.test/v1/offers/missing", () =>
                HttpResponse.json(
                    { title: "Not Found", status: 404, detail: "Offer missing", code: "OFFER_NOT_FOUND" },
                    { status: 404 },
                ),
            ),
        );
        const error = await customFetch("/offers/missing").catch((e: unknown) => e);
        expect(isApiError(error, 404)).toBe(true);
        expect(error).toMatchObject({
            message: "Offer missing",
            problem: { code: "OFFER_NOT_FOUND" },
            url: "https://api.test/v1/offers/missing",
        });
    });

    it("falls back to the status text when the error body isn't JSON", async () => {
        server.use(
            http.get(
                "https://api.test/v1/boom",
                () => new HttpResponse("oops", { status: 502, statusText: "Bad Gateway" }),
            ),
        );
        const error = (await customFetch("/boom").catch((e: unknown) => e)) as ApiError;
        expect(error).toBeInstanceOf(ApiError);
        expect(error.problem).toEqual({ title: "Bad Gateway", status: 502 });
        expect(isApiError(error, 404)).toBe(false);
    });
});

describe("mock mode", () => {
    it("answers from the MSW handlers without a network when API_MOCKING=enabled", async () => {
        vi.stubEnv("API_MOCKING", "enabled");
        // No server.use(): onUnhandledRequest "error" proves that no real request was sent.
        const destinations = await customFetch<Array<{ code: string }>>("/destinations");
        expect(destinations.map((d) => d.code)).toContain("PMI");
        expect(isServerMocking()).toBe(true);
    });
});

describe("isApiError", () => {
    it("rejects other errors", () => {
        expect(isApiError(new Error("x"))).toBe(false);
        expect(isApiError("x")).toBe(false);
    });
});
