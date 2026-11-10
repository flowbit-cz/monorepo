import { createMetadata, type SiteSeo } from "@dertour/next/metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { appData, type AppLocale } from "@/config/appData";
import type { OfferDetailModel } from "./types/offer";
import type { OfferSearch } from "./types/search";
import { isFiltered, offerPath } from "./utils";

/** Site-wide SEO settings from appData. */
export const siteSeo: SiteSeo = {
    name: appData.name,
    siteUrl: appData.siteUrl,
    ogImage: appData.ogImage,
    locales: appData.locales,
    defaultLocale: appData.defaultLocale,
    localePrefix: appData.localePrefix,
};

/** Metadata of the listing. Filtered result pages are noindex (no duplicate content in Google). */
export async function offerListMetadata(locale: AppLocale, search: OfferSearch): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "offers.list" });
    return createMetadata(siteSeo, {
        title: t("metaTitle"),
        description: t("metaDescription"),
        path: "/offers",
        locale,
        noIndex: isFiltered(search) || search.page > 1,
    });
}

/** Metadata of an offer detail, built from the real offer data. */
export function offerDetailMetadata(offer: OfferDetailModel, locale: AppLocale): Metadata {
    return createMetadata(siteSeo, {
        title: `${offer.title} – ${offer.location}`,
        description: offer.description,
        path: offerPath(offer.slug),
        locale,
        images: [offer.image],
    });
}

/** schema.org structured data of an offer (rich results for hotel offers). */
export function offerJsonLd(offer: OfferDetailModel, locale: AppLocale) {
    return {
        "@context": "https://schema.org",
        "@type": "Hotel",
        name: offer.title,
        description: offer.description,
        image: [offer.image.url, ...offer.gallery.map((image) => image.url)],
        starRating: { "@type": "Rating", ratingValue: offer.stars },
        address: { "@type": "PostalAddress", addressLocality: offer.location },
        makesOffer: {
            "@type": "Offer",
            price: offer.price.amount,
            priceCurrency: offer.price.currency,
            url: `${appData.siteUrl}${locale === appData.defaultLocale ? "" : `/${locale}`}${offerPath(offer.slug)}`,
            availabilityStarts: offer.departureDate,
            availabilityEnds: offer.returnDate,
        },
    };
}
