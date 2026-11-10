// @vitest-environment node
import { describe, expect, it } from "vitest";
import { handleMockRequest } from "./mockApi";

describe("handleMockRequest", () => {
    it("serves the demo data", async () => {
        const response = await handleMockRequest(new Request("http://localhost/api/mock/destinations"), true);
        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toContainEqual({ code: "PMI", name: "Mallorca", country: "Spain" });
    });

    it("returns 404 for unknown paths and when mocking is off", async () => {
        expect((await handleMockRequest(new Request("http://localhost/api/mock/nope"), true)).status).toBe(404);
        expect((await handleMockRequest(new Request("http://localhost/api/mock/destinations"), false)).status).toBe(
            404,
        );
    });
});
