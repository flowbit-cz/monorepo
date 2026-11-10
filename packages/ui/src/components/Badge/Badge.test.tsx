import { renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders text with the chosen tone", () => {
        renderWithProviders(<Badge tone="accent">Last minute</Badge>);
        expect(screen.getByText("Last minute").className).toContain("bg-accent");
    });

    it("defaults to neutral", () => {
        renderWithProviders(<Badge>All inclusive</Badge>);
        expect(screen.getByText("All inclusive").className).toContain("bg-surface-muted");
    });
});
