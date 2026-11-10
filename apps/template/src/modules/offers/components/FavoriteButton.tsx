"use client";

import { cn } from "@dertour/ui";
import { useTranslations } from "next-intl";
import { useFavoritesHydrated, useFavoritesStore } from "../offers.store";

/** Heart toggle that remembers an offer in the visitor's favourites (localStorage). */
export function FavoriteButton({ slug, title, className }: { slug: string; title: string; className?: string }) {
    const t = useTranslations("offers.favorite");
    const hydrated = useFavoritesHydrated();
    const isFavorite = useFavoritesStore((state) => state.slugs.includes(slug));
    const toggle = useFavoritesStore((state) => state.toggle);
    const active = hydrated && isFavorite;

    return (
        <button
            type="button"
            aria-pressed={active}
            aria-label={active ? t("remove", { title }) : t("add", { title })}
            onClick={() => toggle(slug)}
            className={cn(
                "rounded-pill bg-surface/90 shadow-card flex size-10 items-center justify-center text-xl transition hover:scale-105",
                active ? "text-danger" : "text-text-muted",
                className,
            )}
        >
            <span aria-hidden="true">{active ? "♥" : "♡"}</span>
        </button>
    );
}
