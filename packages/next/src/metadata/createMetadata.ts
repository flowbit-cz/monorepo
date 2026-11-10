import type { Metadata } from "next";

/** Site-wide SEO settings (from the app's appData). */
export interface SiteSeo {
    name: string;
    /** Absolute site URL without a trailing slash. */
    siteUrl: string;
    /** Default OG image (path or absolute URL). */
    ogImage: string;
    locales: readonly string[];
    defaultLocale: string;
    /** `as-needed` = default locale has no prefix (next-intl `localePrefix`). */
    localePrefix: "always" | "as-needed";
}

/** Per-page SEO input. */
export interface PageSeo {
    title: string;
    description: string;
    /** Path without the locale prefix ("/offers/hotel-x"). */
    path: string;
    locale: string;
    images?: Array<{ url: string; alt?: string }>;
    /** Hide the page from search engines (filters, search result pages…). */
    noIndex?: boolean;
    type?: "website" | "article";
}

/** Localised path ("/offers" in "en" → "/en/offers", default locale with `as-needed` → "/offers"). */
export function localizedPath(
    site: Pick<SiteSeo, "defaultLocale" | "localePrefix">,
    locale: string,
    path: string,
): string {
    const clean = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
    if (site.localePrefix === "as-needed" && locale === site.defaultLocale) return clean || "/";
    return `/${locale}${clean}`;
}

/**
 * Builds the metadata of a page: title, description, canonical, hreflang alternates for every locale,
 * Open Graph and robots. Use it in `generateMetadata` of every public page.
 */
export function createMetadata(site: SiteSeo, page: PageSeo): Metadata {
    const canonical = localizedPath(site, page.locale, page.path);
    const languages: Record<string, string> = Object.fromEntries(
        site.locales.map((locale) => [locale, localizedPath(site, locale, page.path)]),
    );
    languages["x-default"] = localizedPath(site, site.defaultLocale, page.path);

    return {
        metadataBase: new URL(site.siteUrl),
        title: page.title,
        description: page.description,
        alternates: { canonical, languages },
        openGraph: {
            type: page.type ?? "website",
            siteName: site.name,
            title: page.title,
            description: page.description,
            url: canonical,
            locale: page.locale,
            images: page.images?.length ? page.images : [{ url: site.ogImage }],
        },
        twitter: { card: "summary_large_image", title: page.title, description: page.description },
        robots: page.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    };
}
