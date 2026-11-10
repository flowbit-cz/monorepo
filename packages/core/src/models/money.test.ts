import { describe, expect, it } from "vitest";
import { multiplyMoney, sumMoney } from "./money";

describe("sumMoney", () => {
    it("sums without floating point drift", () => {
        expect(
            sumMoney(
                [
                    { amount: 0.1, currency: "EUR" },
                    { amount: 0.2, currency: "EUR" },
                ],
                "EUR",
            ),
        ).toEqual({
            amount: 0.3,
            currency: "EUR",
        });
    });

    it("returns zero for an empty list", () => {
        expect(sumMoney([], "CHF")).toEqual({ amount: 0, currency: "CHF" });
    });

    it("refuses mixed currencies", () => {
        expect(() => sumMoney([{ amount: 1, currency: "CHF" }], "EUR")).toThrow("Cannot add CHF to EUR.");
    });
});

describe("multiplyMoney", () => {
    it("multiplies and rounds to cents", () => {
        expect(multiplyMoney({ amount: 333.33, currency: "EUR" }, 3)).toEqual({ amount: 999.99, currency: "EUR" });
        expect(multiplyMoney({ amount: 10.005, currency: "EUR" }, 1)).toEqual({ amount: 10.01, currency: "EUR" });
    });
});
