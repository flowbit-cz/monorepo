import { expectNoA11yViolations, renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonVariants } from "./Button";

describe("Button", () => {
    it("calls onClick and defaults to type=button", async () => {
        const onClick = vi.fn();
        const { user } = renderWithProviders(<Button onClick={onClick}>Search</Button>);
        const button = screen.getByRole("button", { name: "Search" });
        expect(button).toHaveAttribute("type", "button");
        await user.click(button);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("is disabled and busy while loading", async () => {
        const onClick = vi.fn();
        const { user } = renderWithProviders(
            <Button loading onClick={onClick}>
                Save
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Save" });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("aria-busy", "true");
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("applies variants and merges custom classes", () => {
        renderWithProviders(
            <Button variant="secondary" size="sm" className="px-10">
                Go
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Go" });
        expect(button.className).toContain("border-brand");
        expect(button.className).toContain("px-10");
        expect(button.className).not.toContain("px-3");
    });

    it("exposes variants for links", () => {
        expect(buttonVariants({ variant: "ghost", fullWidth: true })).toContain("w-full");
    });

    it("has no a11y violations", async () => {
        renderWithProviders(<Button>Accessible</Button>);
        await expectNoA11yViolations();
    });
});
