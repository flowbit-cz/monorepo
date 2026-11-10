import { describe, expect, it } from "vitest";
import { getLocaleInfo, isLocaleCode, LOCALES } from "./locales";

describe("locales", () => {
    it("keeps code and key in sync", () => {
        for (const [key, info] of Object.entries(LOCALES)) expect(info.code).toBe(key);
    });

    it("recognises known codes only", () => {
        expect(isLocaleCode("de-CH")).toBe(true);
        expect(isLocaleCode("xx")).toBe(false);
        expect(isLocaleCode("toString")).toBe(false);
    });

    it("returns locale info or throws", () => {
        expect(getLocaleInfo("fr-CH").currency).toBe("CHF");
        expect(() => getLocaleInfo("xx")).toThrow('Unknown locale "xx".');
    });
});
