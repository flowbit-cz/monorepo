import { renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
    it("announces its label", () => {
        renderWithProviders(<Spinner label="Loading offers" />);
        expect(screen.getByRole("status", { name: "Loading offers" })).toBeInTheDocument();
    });

    it("is hidden from assistive technology without a label", () => {
        const { container } = renderWithProviders(<Spinner label="" size="lg" />);
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
        expect(container.firstElementChild?.className).toContain("size-10");
    });
});
