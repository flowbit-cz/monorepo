import { demoOffers } from "@dertour/api/mocks/demo";
import { describe, expect, it, vi } from "vitest";
import { appData } from "@/config/appData";
import { toOfferDetail } from "./dto";
import { offerDetailMetadata, offerJsonLd, offerListMetadata } from "./metadata";
import { parseOfferSearch } from "./utils";

vi.mock("next-intl/server", () => ({
    getTranslations: async () => (key: string) => `t:${key}`,
}));

const offer = toOfferDetail(demoOffers[0]!);
/** Default locale (no URL prefix) and another one (with prefix): works for any locale set of the app. */
const [defaultLocale, otherLocale = defaultLocale] = appData.locales;

describe("offerListMetadata", () => {
    it("indexes the plain listing", async () => {
        const metadata = await offerListMetadata(defaultLocale, parseOfferSearch({}));
        expect(metadata).toMatchObject({ title: "t:metaTitle", robots: { index: true } });
        expect(metadata.alternates?.canonical).toBe("/offers");
    });

    it("hides filtered and paginated results from search engines", async () => {
        expect((await offerListMetadata(otherLocale, parseOfferSearch({ board: "AI" }))).robots).toMatchObject({
            index: false,
        });
        expect((await offerListMetadata(otherLocale, parseOfferSearch({ page: "2" }))).robots).toMatchObject({
            index: false,
        });
    });
});

describe("offerDetailMetadata", () => {
    it("uses the offer data", () => {
        const metadata = offerDetailMetadata(offer, otherLocale);
        expect(metadata.title).toBe("Hotel Playa Azul – Mallorca, Spain");
        expect(metadata.alternates?.canonical).toBe(`/${otherLocale}/offers/hotel-playa-azul-mallorca`);
        expect(metadata.openGraph?.images).toEqual([offer.image]);
    });
});

describe("offerJsonLd", () => {
    it("describes the hotel offer", () => {
        const data = offerJsonLd(offer, defaultLocale);
        expect(data.makesOffer).toMatchObject({ price: 1299, priceCurrency: "EUR" });
        expect(data.makesOffer.url).toMatch(/\/offers\/hotel-playa-azul-mallorca$/);
        expect(offerJsonLd(offer, otherLocale).makesOffer.url).toContain(`/${otherLocale}/offers/`);
    });
});
