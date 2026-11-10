import type { OfferCardModel } from "../types/offer";
import { OfferCard } from "./OfferCard";

/** Responsive grid of offer tiles. The first row loads its images eagerly (better LCP). */
export function OfferGrid({ offers, locale }: { offers: OfferCardModel[]; locale: string }) {
    return (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => (
                <li key={offer.id}>
                    <OfferCard offer={offer} locale={locale} priority={index < 3} />
                </li>
            ))}
        </ul>
    );
}
