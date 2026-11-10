import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavoritesHydrated, useFavoritesStore } from "./offers.store";

beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.getState().clear();
});

describe("favorites store", () => {
    it("toggles a slug on and off", () => {
        const { toggle } = useFavoritesStore.getState();
        toggle("a");
        toggle("b");
        expect(useFavoritesStore.getState().slugs).toEqual(["a", "b"]);
        toggle("a");
        expect(useFavoritesStore.getState().slugs).toEqual(["b"]);
    });

    it("persists to localStorage", () => {
        useFavoritesStore.getState().toggle("x");
        expect(JSON.parse(localStorage.getItem("dertour-favorites")!).state.slugs).toEqual(["x"]);
    });

    it("reports hydration after loading storage", async () => {
        localStorage.setItem("dertour-favorites", JSON.stringify({ state: { slugs: ["saved"] }, version: 0 }));
        const { result } = renderHook(() => useFavoritesHydrated());
        await act(async () => {
            await useFavoritesStore.persist.rehydrate();
        });
        expect(result.current).toBe(true);
        expect(useFavoritesStore.getState().slugs).toEqual(["saved"]);
    });
});
