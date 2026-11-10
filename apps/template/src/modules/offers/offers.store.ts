"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Favourite offers of the visitor, remembered in localStorage. */
interface FavoritesState {
    slugs: string[];
    toggle: (slug: string) => void;
    clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set) => ({
            slugs: [],
            toggle: (slug) =>
                set((state) => ({
                    slugs: state.slugs.includes(slug)
                        ? state.slugs.filter((item) => item !== slug)
                        : [...state.slugs, slug],
                })),
            clear: () => set({ slugs: [] }),
        }),
        { name: "dertour-favorites", storage: createJSONStorage(() => localStorage), skipHydration: true },
    ),
);

/**
 * Loads favourites from localStorage after mount. It returns `false` during SSR and the first render,
 * so the server HTML and the first client render match (no hydration warning).
 */
export function useFavoritesHydrated(): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const unsubscribe = useFavoritesStore.persist.onFinishHydration(onChange);
            if (!useFavoritesStore.persist.hasHydrated()) void useFavoritesStore.persist.rehydrate();
            return unsubscribe;
        },
        () => useFavoritesStore.persist.hasHydrated(),
        () => false,
    );
}
