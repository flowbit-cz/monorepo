import "server-only";
import type { Paginated } from "@dertour/core";
import { isApiError } from "@dertour/api";
import { getOffer, listOffers } from "@dertour/api/offers";
import { cache } from "react";
import { toOfferCard, toOfferDetail } from "./dto";
import type { OfferCardModel, OfferDetailModel } from "./types/offer";
import type { OfferSearch } from "./types/search";
import { toListOffersParams } from "./utils";

/** Offers change during the day. Next.js caches backend answers for 5 minutes. */
const REVALIDATE_SECONDS = 300;

/** Request options shared by all offer calls: cache tag + backend locale. */
function requestOptions(locale: string, tag: string) {
    return { headers: { "Accept-Language": locale }, next: { revalidate: REVALIDATE_SECONDS, tags: ["offers", tag] } };
}

/** Searches offers (listing page). */
export async function searchOffers(search: OfferSearch, locale: string): Promise<Paginated<OfferCardModel>> {
    const page = await listOffers(toListOffersParams(search), requestOptions(locale, "offers:list"));
    return { ...page, items: page.items.map(toOfferCard) };
}

/** Offers shown on the homepage. */
export async function getFeaturedOffers(locale: string, count = 3): Promise<OfferCardModel[]> {
    const page = await listOffers({ sort: "recommended", pageSize: count }, requestOptions(locale, "offers:featured"));
    return page.items.map(toOfferCard);
}

/**
 * Offer detail, or `null` when the backend doesn't know the slug (the page then renders 404).
 * Wrapped in `cache`, so `generateMetadata` and the page share one backend call per request.
 */
export const getOfferDetail = cache(async (slug: string, locale: string): Promise<OfferDetailModel | null> => {
    try {
        return toOfferDetail(await getOffer(slug, requestOptions(locale, `offers:${slug}`)));
    } catch (error) {
        if (isApiError(error, 404)) return null;
        throw error;
    }
});
