import { firstParam, toSearchParams, type RawSearchParams } from "@dertour/core";
import type { ListOffersParams } from "@dertour/api/offers/model";
import {
    listOffersQueryAdultsDefault,
    listOffersQueryAdultsMax,
    listOffersQueryPageDefault,
    listOffersQuerySortDefault,
} from "@dertour/api/offers/zod";
import { z } from "zod";
import type { OfferSearch } from "./types/search";

/** Offers per page of the listing. */
export const OFFERS_PAGE_SIZE = 12;

const BOARD_TYPES = ["RO", "BB", "HB", "FB", "AI"] as const;
const SORTS = ["recommended", "priceAsc", "priceDesc"] as const;

/**
 * URL → search state. Limits and defaults come from the generated OpenAPI schema. Invalid values
 * (typed by hand, old links) fall back to defaults instead of failing the page.
 */
const searchSchema = z.object({
    destination: z.string().trim().min(1).max(10).optional().catch(undefined),
    dateFrom: z.iso.date().optional().catch(undefined),
    dateTo: z.iso.date().optional().catch(undefined),
    adults: z.coerce.number().int().min(1).max(listOffersQueryAdultsMax).catch(listOffersQueryAdultsDefault),
    board: z.enum(BOARD_TYPES).optional().catch(undefined),
    sort: z.enum(SORTS).catch(listOffersQuerySortDefault),
    page: z.coerce.number().int().min(1).catch(listOffersQueryPageDefault),
});

/** Parses Next.js `searchParams` into a valid search. */
export function parseOfferSearch(params: RawSearchParams): OfferSearch {
    return searchSchema.parse({
        destination: firstParam(params, "destination"),
        dateFrom: firstParam(params, "dateFrom"),
        dateTo: firstParam(params, "dateTo"),
        adults: firstParam(params, "adults") ?? listOffersQueryAdultsDefault,
        board: firstParam(params, "board"),
        sort: firstParam(params, "sort") ?? listOffersQuerySortDefault,
        page: firstParam(params, "page") ?? listOffersQueryPageDefault,
    });
}

/** Search → URL query. Default values are left out, so URLs stay short and canonical. */
export function toOfferSearchQuery(search: Partial<OfferSearch>): string {
    return toSearchParams({
        destination: search.destination,
        dateFrom: search.dateFrom,
        dateTo: search.dateTo,
        adults: search.adults === listOffersQueryAdultsDefault ? undefined : search.adults,
        board: search.board,
        sort: search.sort === listOffersQuerySortDefault ? undefined : search.sort,
        page: search.page === 1 ? undefined : search.page,
    }).toString();
}

/** Search → backend query parameters. */
export function toListOffersParams(search: OfferSearch): ListOffersParams {
    return {
        destination: search.destination,
        dateFrom: search.dateFrom,
        dateTo: search.dateTo,
        adults: search.adults,
        board: search.board,
        sort: search.sort,
        page: search.page,
        pageSize: OFFERS_PAGE_SIZE,
    };
}

/** `true` when the visitor narrowed the search. Filtered result pages are kept out of the search index. */
export function isFiltered(search: OfferSearch): boolean {
    return toOfferSearchQuery({ ...search, page: 1 }) !== "";
}

/** Path of the offer detail (without locale, the i18n Link adds it). */
export function offerPath(slug: string): `/offers/${string}` {
    return `/offers/${encodeURIComponent(slug)}`;
}
