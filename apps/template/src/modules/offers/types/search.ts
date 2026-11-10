import type { BoardType, ListOffersSort } from "@dertour/api/offers/model";

/** Offer search state. The URL query (`/offers?destination=PMI&page=2`) is the source of truth. */
export interface OfferSearch {
    destination?: string;
    dateFrom?: string;
    dateTo?: string;
    adults: number;
    board?: BoardType;
    sort: ListOffersSort;
    page: number;
}
