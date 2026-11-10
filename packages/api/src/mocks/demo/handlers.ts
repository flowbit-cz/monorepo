import { http, HttpResponse } from "msw";
import { getListDestinationsMockHandler } from "../../generated/offers/endpoints/destinations/destinations.msw";
import { getListOffersMockHandler } from "../../generated/offers/endpoints/offers/offers.msw";
import type { OfferDetail, OfferPage, OfferSummary } from "../../generated/offers/model";
import { demoDestinations, demoOffers } from "./offers";

/** Detail → summary (the list endpoint doesn't return description and gallery). */
function toSummary({ description: _d, highlights: _h, gallery: _g, ...summary }: OfferDetail): OfferSummary {
    return summary;
}

/** Filters, sorts and paginates the demo offers like the real search would. */
export function searchDemoOffers(searchParams: URLSearchParams): OfferPage {
    const destination = searchParams.get("destination");
    const board = searchParams.get("board");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sort = searchParams.get("sort") ?? "recommended";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.max(1, Number(searchParams.get("pageSize") ?? 12));

    const matches = demoOffers
        .filter((offer) => !destination || offer.destination.code === destination)
        .filter((offer) => !board || offer.board === board)
        .filter((offer) => !dateFrom || offer.departureDate >= dateFrom)
        .filter((offer) => !dateTo || offer.returnDate <= dateTo);

    if (sort === "priceAsc") matches.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "priceDesc") matches.sort((a, b) => b.price.amount - a.price.amount);

    const start = (page - 1) * pageSize;
    return { items: matches.slice(start, start + pageSize).map(toSummary), page, pageSize, total: matches.length };
}

/**
 * Demo handlers with realistic data. They take precedence over the generated random-data handlers.
 * The offer detail returns 404 problem details for unknown slugs, like the real backend.
 */
export const demoHandlers = [
    getListOffersMockHandler(({ request }) => searchDemoOffers(new URL(request.url).searchParams)),
    http.get<{ slug: string }>("*/offers/:slug", ({ params }) => {
        const offer = demoOffers.find((item) => item.slug === params.slug);
        if (!offer) {
            return HttpResponse.json(
                {
                    title: "Not Found",
                    status: 404,
                    detail: `Offer "${params.slug}" not found`,
                    code: "OFFER_NOT_FOUND",
                },
                { status: 404, headers: { "Content-Type": "application/problem+json" } },
            );
        }
        return HttpResponse.json(offer);
    }),
    getListDestinationsMockHandler(demoDestinations),
];
