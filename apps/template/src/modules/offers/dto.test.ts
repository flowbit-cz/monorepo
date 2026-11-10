import { getGetOfferResponseMock, getListOffersResponseMock } from "@dertour/api/mocks";
import { demoOffers } from "@dertour/api/mocks/demo";
import { GetOfferResponse } from "@dertour/api/offers/zod";
import { describe, expect, it } from "vitest";
import { toOfferCard, toOfferDetail } from "./dto";

const offer = demoOffers[0]!;

describe("toOfferCard", () => {
    it("maps a backend summary to the tile model", () => {
        expect(toOfferCard(offer)).toEqual({
            id: "off-1001",
            slug: "hotel-playa-azul-mallorca",
            title: "Hotel Playa Azul",
            location: "Mallorca, Spain",
            stars: 4,
            image: { url: offer.image.url, alt: "Hotel pool with sea view" },
            price: { amount: 1299, currency: "EUR" },
            nights: 7,
            board: "HB",
            departureDate: "2027-07-01",
            returnDate: "2027-07-08",
        });
    });

    it("falls back to the title when the image has no alt text", () => {
        expect(toOfferCard({ ...offer, image: { ...offer.image, alt: "" } }).image.alt).toBe("Hotel Playa Azul");
    });

    it("maps every item of a generated (random) response without throwing", () => {
        for (const item of getListOffersResponseMock().items) expect(toOfferCard(item).slug).toBe(item.slug);
    });
});

describe("toOfferDetail", () => {
    it("adds detail fields", () => {
        const detail = toOfferDetail(offer);
        expect(detail).toMatchObject({ destinationCode: "PMI", highlights: offer.highlights });
        expect(detail.gallery).toHaveLength(2);
    });

    it("fixes missing gallery alt texts", () => {
        const detail = toOfferDetail({ ...offer, gallery: [{ url: "https://x.test/1.jpg", alt: "" }] });
        expect(detail.gallery[0]?.alt).toBe(offer.title);
    });

    it("accepts data that matches the backend contract", () => {
        // Contract check: generated mock data must satisfy the generated zod schema of the response.
        const generated = getGetOfferResponseMock();
        expect(GetOfferResponse.safeParse(generated).success).toBe(true);
        expect(toOfferDetail(generated).id).toBe(generated.id);
    });
});
