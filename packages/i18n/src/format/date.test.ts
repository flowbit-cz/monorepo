import { describe, expect, it } from "vitest";
import { formatDate, formatDateRange } from "./date";

const plain = (value: string) => value.replace(/[\u00a0\u202f\u2009]/g, " ");

describe("formatDate", () => {
    it("formats short dates per locale", () => {
        expect(formatDate("2027-07-01", "de")).toBe("01.07.2027");
        expect(formatDate("2027-07-01", "en")).toBe("01/07/2027");
        expect(plain(formatDate("2027-07-01", "cs"))).toBe("01. 07. 2027");
    });

    it("formats long dates", () => {
        expect(formatDate("2027-07-01", "de", "long")).toBe("1. Juli 2027");
        expect(formatDate("2027-07-01", "en", "medium")).toBe("1 Jul 2027");
    });

    it("keeps the calendar day regardless of time zone", () => {
        expect(formatDate("2027-12-31", "de")).toBe("31.12.2027");
    });
});

describe("formatDateRange", () => {
    it("collapses the shared parts of the range", () => {
        expect(plain(formatDateRange("2027-07-01", "2027-07-08", "de"))).toBe("01.–08.07.2027");
    });
});
