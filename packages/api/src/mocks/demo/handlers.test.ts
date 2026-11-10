import { describe, expect, it } from "vitest";
import { searchDemoOffers } from "./handlers";
import { demoOffers } from "./offers";

const search = (query: string) => searchDemoOffers(new URLSearchParams(query));

describe("searchDemoOffers", () => {
    it("returns all offers without filters, without detail fields", () => {
        const page = search("");
        expect(page.total).toBe(demoOffers.length);
        expect(page.items[0]).not.toHaveProperty("description");
    });

    it("filters by destination, board and dates", () => {
        expect(search("destination=PMI").items.every((o) => o.destination.code === "PMI")).toBe(true);
        expect(search("board=AI").items.every((o) => o.board === "AI")).toBe(true);
        expect(search("dateFrom=2027-07-01&dateTo=2027-07-31").items.map((o) => o.slug)).toEqual([
            "hotel-playa-azul-mallorca",
            "aldiana-club-kreta",
        ]);
    });

    it("sorts by price", () => {
        const asc = search("sort=priceAsc").items.map((o) => o.price.amount);
        expect(asc).toEqual([...asc].sort((a, b) => a - b));
        const desc = search("sort=priceDesc").items.map((o) => o.price.amount);
        expect(desc).toEqual([...desc].sort((a, b) => b - a));
    });

    it("paginates", () => {
        const second = search("page=2&pageSize=4");
        expect(second).toMatchObject({ page: 2, pageSize: 4, total: demoOffers.length });
        expect(second.items).toHaveLength(demoOffers.length - 4);
    });
});
