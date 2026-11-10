import { describe, expect, it } from "vitest";
import { isIsoDate, nightsBetween } from "./dateRange";

describe("isIsoDate", () => {
    it.each([
        ["2027-07-01", true],
        ["2028-02-29", true],
        ["2027-02-29", false],
        ["2027-13-01", false],
        ["01.07.2027", false],
        ["2027-7-1", false],
    ])("%s → %s", (value, expected) => {
        expect(isIsoDate(value)).toBe(expected);
    });
});

describe("nightsBetween", () => {
    it("counts nights", () => {
        expect(nightsBetween({ from: "2027-07-01", to: "2027-07-08" })).toBe(7);
    });

    it("ignores daylight saving changes", () => {
        expect(nightsBetween({ from: "2027-03-27", to: "2027-03-29" })).toBe(2);
    });

    it("never returns a negative number", () => {
        expect(nightsBetween({ from: "2027-07-08", to: "2027-07-01" })).toBe(0);
    });
});
