import { describe, expect, it } from "vitest";
import { firstParam, toSearchParams } from "./searchParams";

describe("toSearchParams", () => {
    it("skips empty values and sorts keys", () => {
        const params = toSearchParams({ z: "last", a: 1, empty: "", nothing: undefined, nil: null, flag: false });
        expect(params.toString()).toBe("a=1&flag=false&z=last");
    });

    it("repeats keys for arrays", () => {
        expect(toSearchParams({ board: ["AI", "HB", undefined] }).toString()).toBe("board=AI&board=HB");
    });
});

describe("firstParam", () => {
    it("returns a plain string, the first array item or undefined", () => {
        expect(firstParam({ a: "x" }, "a")).toBe("x");
        expect(firstParam({ a: ["y", "z"] }, "a")).toBe("y");
        expect(firstParam({}, "a")).toBeUndefined();
    });
});
