// @vitest-environment node
import { configureApi } from "@dertour/api";
import { getGetOfferMockHandler, handlers } from "@dertour/api/mocks";
import { demoOffers } from "@dertour/api/mocks/demo";
import { setupMswServer } from "@dertour/testing/msw";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { getFeaturedOffers, getOfferDetail, searchOffers } from "./api";
import { parseOfferSearch } from "./utils";

// Integration test: real generated client + mutator, backend answered by the MSW demo handlers.
const server = setupMswServer(handlers);
beforeEach(() => configureApi({ baseUrl: "https://api.test" }));

describe("searchOffers", () => {
    it("returns mapped tiles with pagination", async () => {
        const result = await searchOffers(parseOfferSearch({ destination: "PMI" }), "de");
        expect(result.total).toBe(2);
        expect(result.items.map((offer) => offer.location)).toEqual(["Mallorca, Spain", "Mallorca, Spain"]);
    });

    it("sends the locale to the backend", async () => {
        let language: string | null = null;
        server.use(
            http.get("*/offers", ({ request }) => {
                language = request.headers.get("accept-language");
                return HttpResponse.json({ items: [], page: 1, pageSize: 12, total: 0 });
            }),
        );
        await searchOffers(parseOfferSearch({}), "cs");
        expect(language).toBe("cs");
    });
});

describe("getFeaturedOffers", () => {
    it("returns the requested number of offers", async () => {
        await expect(getFeaturedOffers("de", 2)).resolves.toHaveLength(2);
    });
});

describe("getOfferDetail", () => {
    it("returns the detail", async () => {
        const offer = await getOfferDetail(demoOffers[1]!.slug, "de");
        expect(offer?.title).toBe("Aldiana Club Kreta");
    });

    it("returns null for unknown offers", async () => {
        await expect(getOfferDetail("does-not-exist", "de")).resolves.toBeNull();
    });

    it("rethrows other backend errors", async () => {
        server.use(
            http.get("*/offers/:slug", () => HttpResponse.json({ title: "Boom", status: 500 }, { status: 500 })),
        );
        await expect(getOfferDetail("x-500", "de")).rejects.toThrow("Boom");
    });

    it("uses whatever the backend returns", async () => {
        server.use(getGetOfferMockHandler({ ...demoOffers[0]!, slug: "custom", title: "Custom offer" }));
        await expect(getOfferDetail("custom", "de")).resolves.toMatchObject({ title: "Custom offer" });
    });
});
