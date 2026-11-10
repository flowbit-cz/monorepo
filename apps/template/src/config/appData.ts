/**
 * Basic, configurable data of the app. Never hard-code these values elsewhere.
 * Texts (titles, descriptions) live in translations. Only identity and settings belong here.
 */
export const appData = {
    /** Brand name used in titles, OG and JSON-LD. */
    name: "DERTOUR",
    /** Service name in logs, Datadog and the health check. */
    service: "template",
    /** Public URL without a trailing slash. */
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
    /** Default Open Graph image (src/app/opengraph-image.tsx). */
    ogImage: "/opengraph-image",
    /** Locales of this app (a subset of LOCALES from @dertour/i18n). The first one is the default. */
    locales: ["de", "en", "cs"],
    defaultLocale: "de",
    /** `as-needed`: the default locale has no URL prefix (`/offers`, `/en/offers`). */
    localePrefix: "as-needed",
    /** Time zone used for formatting dates in messages. */
    timeZone: "Europe/Berlin",
    /** Usercentrics service names (must match the CMP configuration). */
    consentServices: { datadog: "Datadog" },
    links: {
        privacy: "https://www.dertour.de/datenschutz",
        imprint: "https://www.dertour.de/impressum",
    },
} as const;

export type AppLocale = (typeof appData.locales)[number];
