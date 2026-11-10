import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
    it("joins truthy classes and lets the last Tailwind class win", () => {
        expect(cn("p-2", false, undefined, "text-sm", { hidden: false, block: true }, "p-4")).toBe("text-sm block p-4");
    });
});
