import { describe, expect, it } from "vitest";
import { createHealthRoute } from "./health";

describe("createHealthRoute", () => {
    it("is ok without checks", async () => {
        const response = await createHealthRoute({ service: "web", version: "1.0.0" })();
        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("no-store");
        await expect(response.json()).resolves.toEqual({ status: "ok", service: "web", version: "1.0.0", checks: {} });
    });

    it("reports 503 when a check fails or throws", async () => {
        const response = await createHealthRoute({
            service: "web",
            checks: { backend: async () => true, cms: async () => false, cache: () => Promise.reject(new Error("x")) },
        })();
        expect(response.status).toBe(503);
        await expect(response.json()).resolves.toMatchObject({
            status: "degraded",
            checks: { backend: true, cms: false, cache: false },
        });
    });
});
