import { renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { Rating } from "./Rating";

const filled = (el: HTMLElement) => [...el.children].filter((star) => !star.className.includes("opacity-25")).length;

describe("Rating", () => {
    it("exposes the label and fills the right number of stars", () => {
        renderWithProviders(<Rating value={4} label="4 stars" />);
        const rating = screen.getByRole("img", { name: "4 stars" });
        expect(rating.children).toHaveLength(5);
        expect(filled(rating)).toBe(4);
    });

    it("clamps values outside the range", () => {
        renderWithProviders(<Rating value={9} max={3} label="many" />);
        expect(filled(screen.getByRole("img", { name: "many" }))).toBe(3);
    });
});
