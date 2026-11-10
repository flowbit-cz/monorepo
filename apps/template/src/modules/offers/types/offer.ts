import type { Money } from "@dertour/core";
import type { BoardType } from "@dertour/api/offers/model";

/** Offer as the UI needs it for a tile. It's decoupled from the backend shape by dto.ts. */
export interface OfferCardModel {
    id: string;
    slug: string;
    title: string;
    /** "Mallorca, Spain" */
    location: string;
    stars: number;
    image: { url: string; alt: string };
    price: Money;
    nights: number;
    board: BoardType;
    departureDate: string;
    returnDate: string;
}

/** Offer detail page model. */
export interface OfferDetailModel extends OfferCardModel {
    description: string;
    highlights: string[];
    gallery: Array<{ url: string; alt: string }>;
    destinationCode: string;
}
