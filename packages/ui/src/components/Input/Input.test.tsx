import { expectNoA11yViolations, renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
    it("is labelled and accepts typing", async () => {
        const { user } = renderWithProviders(<Input label="Destination" />);
        const input = screen.getByLabelText("Destination");
        await user.type(input, "Mallorca");
        expect(input).toHaveValue("Mallorca");
    });

    it("links the hint", () => {
        renderWithProviders(<Input label="Travellers" hint="Adults only" id="adults" />);
        expect(screen.getByLabelText("Travellers")).toHaveAccessibleDescription("Adults only");
    });

    it("shows the error instead of the hint and marks the input invalid", () => {
        renderWithProviders(<Input label="Date" hint="DD.MM.YYYY" error="Invalid date" />);
        const input = screen.getByLabelText("Date");
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription("Invalid date");
        expect(screen.queryByText("DD.MM.YYYY")).not.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent("Invalid date");
    });

    it("has no a11y violations", async () => {
        renderWithProviders(<Input label="Name" error="Required" />);
        await expectNoA11yViolations();
    });
});
