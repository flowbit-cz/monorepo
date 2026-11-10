import { describe, expect, it } from "vitest";
import { tripDuration } from "./duration";

describe("tripDuration", () => {
    it("returns nights and days", () => {
        expect(tripDuration({ from: "2027-07-01", to: "2027-07-08" })).toEqual({ nights: 7, days: 8 });
    });

    it("treats a same-day trip as one day", () => {
        expect(tripDuration({ from: "2027-07-01", to: "2027-07-01" })).toEqual({ nights: 0, days: 1 });
    });
});
