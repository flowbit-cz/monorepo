import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import type { OfferSearch } from "../types/search";
import { toOfferSearchQuery } from "../utils";
import { OfferFilter } from "./OfferFilter";
import { OfferListSkeleton } from "./OfferListSkeleton";
import { OfferResults } from "./OfferResults";

/**
 * Offer listing. Heading and filter render immediately, and results stream in. The Suspense key is the query,
 * so every new search shows the skeleton. The boundary is here, not in a route loading.tsx, so child routes
 * (offer detail) aren't streamed and can still answer with a real HTTP 404.
 */
export async function OfferListPage({ search, locale }: { search: OfferSearch; locale: string }) {
    const t = await getTranslations("offers.list");
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-brand text-3xl font-bold sm:text-4xl">{t("title")}</h1>
            <OfferFilter search={search} />
            <Suspense key={toOfferSearchQuery(search)} fallback={<OfferListSkeleton />}>
                <OfferResults search={search} locale={locale} />
            </Suspense>
        </div>
    );
}
