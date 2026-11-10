import { localizedPath } from "@dertour/next/metadata";
import type { MetadataRoute } from "next";
import { appData } from "@/config/appData";

/** Static pages in every locale, with hreflang alternates. Offer details belong in a backend-fed sitemap. */
const PAGES = ["/", "/offers"];

export default function sitemap(): MetadataRoute.Sitemap {
    const url = (locale: string, path: string) => `${appData.siteUrl}${localizedPath(appData, locale, path)}`;
    return PAGES.map((path) => ({
        url: url(appData.defaultLocale, path),
        changeFrequency: "daily",
        alternates: { languages: Object.fromEntries(appData.locales.map((locale) => [locale, url(locale, path)])) },
    }));
}
