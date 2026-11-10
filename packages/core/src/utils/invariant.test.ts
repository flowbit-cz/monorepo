import { describe, expect, it } from "vitest";
import { assertNever, invariant, InvariantError } from "./invariant";

describe("invariant", () => {
    it("passes for truthy conditions", () => {
        expect(() => invariant(1, "never")).not.toThrow();
    });

    it("throws InvariantError with the message for falsy conditions", () => {
        expect(() => invariant(0, "boom")).toThrow(new InvariantError("boom"));
    });
});

describe("assertNever", () => {
    it("always throws", () => {
        expect(() => assertNever("x" as never)).toThrow('Unexpected value: "x"');
    });
});
