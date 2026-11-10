import { expectNoA11yViolations, renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

const options = [
    { value: "PMI", label: "Mallorca" },
    { value: "HER", label: "Crete" },
];

describe("Select", () => {
    it("renders the placeholder and lets the user choose", async () => {
        const { user } = renderWithProviders(<Select label="Destination" placeholder="Any" options={options} />);
        const select = screen.getByLabelText("Destination");
        expect(select).toHaveValue("");
        await user.selectOptions(select, "Crete");
        expect(select).toHaveValue("HER");
    });

    it("has no empty option without a placeholder", () => {
        renderWithProviders(<Select label="Destination" options={options} />);
        expect(screen.getAllByRole("option")).toHaveLength(2);
    });

    it("shows errors accessibly", async () => {
        renderWithProviders(<Select label="Board" options={options} error="Required" />);
        expect(screen.getByLabelText("Board")).toHaveAccessibleDescription("Required");
        await expectNoA11yViolations();
    });
});
