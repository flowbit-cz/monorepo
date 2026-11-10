import { describe, expect, it } from "vitest";
import {
    isFiltered,
    offerPath,
    parseOfferSearch,
    toListOffersParams,
    toOfferSearchQuery,
    OFFERS_PAGE_SIZE,
} from "./utils";

const defaults = { adults: 2, sort: "recommended", page: 1 };

describe("parseOfferSearch", () => {
    it("returns defaults for an empty query", () => {
        expect(parseOfferSearch({})).toEqual(defaults);
    });

    it("parses valid values (first value of repeated params)", () => {
        expect(
            parseOfferSearch({
                destination: ["PMI", "HER"],
                dateFrom: "2027-07-01",
                dateTo: "2027-07-08",
                adults: "3",
                board: "AI",
                sort: "priceAsc",
                page: "2",
            }),
        ).toEqual({
            destination: "PMI",
            dateFrom: "2027-07-01",
            dateTo: "2027-07-08",
            adults: 3,
            board: "AI",
            sort: "priceAsc",
            page: 2,
        });
    });

    it("falls back to defaults for invalid values instead of throwing", () => {
        expect(
            parseOfferSearch({
                dateFrom: "01.07.2027",
                adults: "99",
                board: "XX",
                sort: "cheap",
                page: "-1",
                destination: "",
            }),
        ).toEqual(defaults);
        expect(parseOfferSearch({ adults: "abc", page: "1.5" })).toEqual(defaults);
    });
});

describe("toOfferSearchQuery", () => {
    it("leaves out defaults and empty values", () => {
        expect(toOfferSearchQuery({ ...defaults, sort: "recommended" } as never)).toBe("");
    });

    it("writes changed values in a stable order", () => {
        expect(toOfferSearchQuery({ page: 3, destination: "PMI", adults: 4, sort: "priceDesc", board: "HB" })).toBe(
            "adults=4&board=HB&destination=PMI&page=3&sort=priceDesc",
        );
    });

    it("round-trips with parseOfferSearch", () => {
        const search = parseOfferSearch({ destination: "HER", dateFrom: "2027-08-01", page: "2" });
        expect(parseOfferSearch(Object.fromEntries(new URLSearchParams(toOfferSearchQuery(search))))).toEqual(search);
    });
});

describe("toListOffersParams", () => {
    it("adds the page size", () => {
        expect(toListOffersParams(parseOfferSearch({ destination: "PMI" }))).toEqual({
            destination: "PMI",
            dateFrom: undefined,
            dateTo: undefined,
            adults: 2,
            board: undefined,
            sort: "recommended",
            page: 1,
            pageSize: OFFERS_PAGE_SIZE,
        });
    });
});

describe("isFiltered", () => {
    it("ignores the page number", () => {
        expect(isFiltered(parseOfferSearch({ page: "4" }))).toBe(false);
        expect(isFiltered(parseOfferSearch({ board: "AI" }))).toBe(true);
    });
});

describe("offerPath", () => {
    it("encodes the slug", () => {
        expect(offerPath("hotel a/b")).toBe("/offers/hotel%20a%2Fb");
    });
});
