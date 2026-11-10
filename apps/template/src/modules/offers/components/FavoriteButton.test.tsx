import { screen } from "@dertour/testing";
import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderApp } from "@/test/render";
import { useFavoritesStore } from "../offers.store";
import { FavoriteButton } from "./FavoriteButton";

beforeEach(async () => {
    localStorage.clear();
    useFavoritesStore.getState().clear();
    await act(async () => {
        await useFavoritesStore.persist.rehydrate();
    });
});

describe("FavoriteButton", () => {
    it("toggles the favourite with an accessible label", async () => {
        const { user } = renderApp(<FavoriteButton slug="playa" title="Hotel Playa" />);
        const button = screen.getByRole("button", { name: "Hotel Playa merken" });
        expect(button).toHaveAttribute("aria-pressed", "false");

        await user.click(button);
        expect(screen.getByRole("button", { name: "Hotel Playa nicht mehr merken" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(useFavoritesStore.getState().slugs).toEqual(["playa"]);

        await user.click(screen.getByRole("button", { name: "Hotel Playa nicht mehr merken" }));
        expect(useFavoritesStore.getState().slugs).toEqual([]);
    });
});
