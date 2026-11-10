import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

/** Intl uses non-breaking and narrow spaces. Normalise them, so the expectations stay readable. */
const plain = (value: string) => value.replace(/[\u00a0\u202f]/g, " ");

describe("formatPrice", () => {
    it("formats whole amounts without cents", () => {
        expect(plain(formatPrice({ amount: 1299, currency: "EUR" }, "de"))).toBe("1.299 €");
        expect(plain(formatPrice({ amount: 1299, currency: "EUR" }, "en"))).toBe("€1,299");
        expect(plain(formatPrice({ amount: 24990, currency: "CZK" }, "cs"))).toBe("24 990 Kč");
    });

    it("shows cents when the amount isn't whole", () => {
        expect(plain(formatPrice({ amount: 1299.5, currency: "EUR" }, "de"))).toBe("1.299,50 €");
    });

    it("respects explicit fraction digits", () => {
        expect(plain(formatPrice({ amount: 1299.5, currency: "EUR" }, "de", { fractionDigits: 0 }))).toBe("1.300 €");
        expect(plain(formatPrice({ amount: 10, currency: "EUR" }, "de", { fractionDigits: 2 }))).toBe("10,00 €");
    });

    it("uses the Swiss format for CHF", () => {
        expect(plain(formatPrice({ amount: 1299, currency: "CHF" }, "de-CH"))).toMatch(/^CHF 1.299$/);
    });
});
