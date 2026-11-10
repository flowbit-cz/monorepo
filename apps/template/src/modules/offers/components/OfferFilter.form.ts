import { listOffersQueryAdultsMax } from "@dertour/api/offers/zod";
import { z } from "zod";
import type { OfferSearch } from "../types/search";

/** Error messages are keys of the shared `errors.*` translations. */
export type FilterErrorKey = "required" | "invalidDate" | "dateOrder";

const optionalDate = z.union([z.literal(""), z.iso.date({ error: "invalidDate" })]);

/** Validation of the filter form. The dates must be in order, and adults must stay within the backend limit. */
export const offerFilterSchema = z
    .object({
        destination: z.string(),
        dateFrom: optionalDate,
        dateTo: optionalDate,
        adults: z.number({ error: "required" }).int().min(1, { error: "required" }).max(listOffersQueryAdultsMax),
        board: z.union([z.literal(""), z.enum(["RO", "BB", "HB", "FB", "AI"])]),
        sort: z.enum(["recommended", "priceAsc", "priceDesc"]),
    })
    .refine((values) => !values.dateFrom || !values.dateTo || values.dateTo > values.dateFrom, {
        path: ["dateTo"],
        error: "dateOrder",
    });

export type OfferFilterValues = z.infer<typeof offerFilterSchema>;

/** Current search → form values (empty strings for "any"). */
export function toFilterValues(search: OfferSearch): OfferFilterValues {
    return {
        destination: search.destination ?? "",
        dateFrom: search.dateFrom ?? "",
        dateTo: search.dateTo ?? "",
        adults: search.adults,
        board: search.board ?? "",
        sort: search.sort,
    };
}

/** Form values → new search (always back to page 1). */
export function toSearch(values: OfferFilterValues): OfferSearch {
    return {
        destination: values.destination || undefined,
        dateFrom: values.dateFrom || undefined,
        dateTo: values.dateTo || undefined,
        adults: values.adults,
        board: values.board || undefined,
        sort: values.sort,
        page: 1,
    };
}
