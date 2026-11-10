import { describe, expect, it } from "vitest";
import { tokensToCss } from "./toCss.mjs";
import tokens from "./tokens.json";

describe("tokensToCss", () => {
    it("maps DEFAULT to the group name and nests the rest", () => {
        const css = tokensToCss({ color: { brand: { DEFAULT: "#000", light: "#111" } } });
        expect(css).toContain("--color-brand: #000;");
        expect(css).toContain("--color-brand-light: #111;");
        expect(css).toMatch(/^\/\* Generated/);
    });

    it("emits every token group of the real token file", () => {
        const css = tokensToCss(tokens);
        for (const variable of [
            "--color-brand:",
            "--font-sans:",
            "--radius-lg:",
            "--shadow-card:",
            "--breakpoint-md:",
        ]) {
            expect(css).toContain(variable);
        }
        expect(css).not.toContain("$description");
    });
});
