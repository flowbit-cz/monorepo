import { describe, expect, it } from "vitest";
import { offerFilterSchema, toFilterValues, toSearch, type OfferFilterValues } from "./OfferFilter.form";

const valid: OfferFilterValues = {
    destination: "",
    dateFrom: "",
    dateTo: "",
    adults: 2,
    board: "",
    sort: "recommended",
};

/** Error key per field path. */
const errors = (values: unknown) =>
    Object.fromEntries(
        offerFilterSchema.safeParse(values).error?.issues.map((issue) => [issue.path.join("."), issue.message]) ?? [],
    );

describe("offerFilterSchema", () => {
    it("accepts an empty search", () => {
        expect(offerFilterSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects invalid dates", () => {
        expect(errors({ ...valid, dateFrom: "2027-02-30" })).toEqual({ dateFrom: "invalidDate" });
    });

    it("requires the return after the departure", () => {
        expect(errors({ ...valid, dateFrom: "2027-07-08", dateTo: "2027-07-01" })).toEqual({ dateTo: "dateOrder" });
        expect(errors({ ...valid, dateFrom: "2027-07-01", dateTo: "2027-07-01" })).toEqual({ dateTo: "dateOrder" });
        expect(offerFilterSchema.safeParse({ ...valid, dateFrom: "2027-07-01", dateTo: "2027-07-08" }).success).toBe(
            true,
        );
    });

    it("requires at least one adult and respects the backend maximum", () => {
        expect(errors({ ...valid, adults: Number.NaN })).toEqual({ adults: "required" });
        expect(errors({ ...valid, adults: 0 })).toEqual({ adults: "required" });
        expect(offerFilterSchema.safeParse({ ...valid, adults: 10 }).success).toBe(false);
    });
});

describe("toFilterValues / toSearch", () => {
    it("round-trip and reset the page", () => {
        const search = { destination: "PMI", adults: 3, sort: "priceAsc", page: 4, board: "AI" } as const;
        expect(toSearch(toFilterValues(search))).toEqual({
            ...search,
            page: 1,
            dateFrom: undefined,
            dateTo: undefined,
        });
    });

    it("turn empty strings into 'any'", () => {
        expect(toSearch(valid)).toEqual({ adults: 2, sort: "recommended", page: 1 });
    });
});
