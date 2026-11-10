import { describe, expect, it } from "vitest";
import { mockFetch } from "./mockFetch";

describe("mockFetch", () => {
    it("answers from the demo handlers", async () => {
        const response = await mockFetch("https://any.host/offers?destination=HER");
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({ total: 2 });
    });

    it("returns problem details for unknown offers", async () => {
        const response = await mockFetch("https://any.host/offers/nope");
        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toMatchObject({ code: "OFFER_NOT_FOUND" });
    });

    it("returns 501 for requests without a handler", async () => {
        const response = await mockFetch("https://any.host/unknown", { method: "POST" });
        expect(response.status).toBe(501);
        await expect(response.json()).resolves.toMatchObject({ detail: "POST /unknown" });
    });
});
