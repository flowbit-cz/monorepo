import { describe, expect, it } from "vitest";
import { createMetadata, localizedPath, type SiteSeo } from "./createMetadata";

const site: SiteSeo = {
    name: "DERTOUR",
    siteUrl: "https://www.dertour.test",
    ogImage: "/og.png",
    locales: ["de", "en"],
    defaultLocale: "de",
    localePrefix: "as-needed",
};

describe("localizedPath", () => {
    it("omits the prefix for the default locale with as-needed", () => {
        expect(localizedPath(site, "de", "/offers")).toBe("/offers");
        expect(localizedPath(site, "de", "/")).toBe("/");
        expect(localizedPath(site, "en", "/")).toBe("/en");
        expect(localizedPath(site, "en", "offers")).toBe("/en/offers");
    });

    it("always prefixes with localePrefix=always", () => {
        expect(localizedPath({ ...site, localePrefix: "always" }, "de", "/offers")).toBe("/de/offers");
    });
});

describe("createMetadata", () => {
    it("builds canonical, hreflang and Open Graph", () => {
        const metadata = createMetadata(site, {
            title: "Mallorca",
            description: "Sun",
            path: "/offers/x",
            locale: "en",
        });
        expect(metadata.alternates).toEqual({
            canonical: "/en/offers/x",
            languages: { de: "/offers/x", en: "/en/offers/x", "x-default": "/offers/x" },
        });
        expect(metadata.openGraph).toMatchObject({
            siteName: "DERTOUR",
            url: "/en/offers/x",
            images: [{ url: "/og.png" }],
        });
        expect(metadata.robots).toEqual({ index: true, follow: true });
        expect(metadata.metadataBase?.toString()).toBe("https://www.dertour.test/");
    });

    it("uses page images and noindex", () => {
        const metadata = createMetadata(site, {
            title: "Search",
            description: "Results",
            path: "/offers",
            locale: "de",
            noIndex: true,
            images: [{ url: "https://img.test/1.jpg", alt: "Pool" }],
        });
        expect(metadata.openGraph?.images).toEqual([{ url: "https://img.test/1.jpg", alt: "Pool" }]);
        expect(metadata.robots).toEqual({ index: false, follow: true });
    });
});
