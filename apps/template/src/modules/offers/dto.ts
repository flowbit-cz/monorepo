import type { OfferDetail, OfferSummary } from "@dertour/api/offers/model";
import type { OfferCardModel, OfferDetailModel } from "./types/offer";

/** Backend offer summary → tile model. */
export function toOfferCard(offer: OfferSummary): OfferCardModel {
    return {
        id: offer.id,
        slug: offer.slug,
        title: offer.title,
        location: `${offer.destination.name}, ${offer.destination.country}`,
        stars: offer.hotel.stars,
        image: { url: offer.image.url, alt: offer.image.alt || offer.title },
        price: { amount: offer.price.amount, currency: offer.price.currency },
        nights: offer.nights,
        board: offer.board,
        departureDate: offer.departureDate,
        returnDate: offer.returnDate,
    };
}

/** Backend offer detail → detail page model. Images without alt text fall back to the offer title. */
export function toOfferDetail(offer: OfferDetail): OfferDetailModel {
    return {
        ...toOfferCard(offer),
        destinationCode: offer.destination.code,
        description: offer.description,
        highlights: offer.highlights,
        gallery: offer.gallery.map((image) => ({ url: image.url, alt: image.alt || offer.title })),
    };
}
