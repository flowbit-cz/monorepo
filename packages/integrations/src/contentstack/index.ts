import contentstack, { Region } from "@contentstack/delivery-sdk";

/** Connection to one Contentstack stack (read-only Delivery API). */
export interface ContentstackOptions {
    apiKey: string;
    deliveryToken: string;
    environment: string;
    region?: "eu" | "us" | "azure-eu";
}

const REGIONS = { eu: Region.EU, us: Region.US, "azure-eu": Region.AZURE_EU } as const;

/**
 * Creates a Contentstack Delivery client. dertour.de uses Contentstack as its headless CMS.
 * Server-side only: the delivery token stays out of the browser bundle.
 */
export function createContentstack({ region = "eu", ...options }: ContentstackOptions) {
    const stack = contentstack.stack({ ...options, region: REGIONS[region] });

    return {
        stack,
        /** First entry of a content type whose `url` field equals `url`, in the given locale (or `null`). */
        async entryByUrl<T>(contentType: string, url: string, locale: string): Promise<T | null> {
            const result = await stack
                .contentType(contentType)
                .entry()
                .locale(locale)
                .query()
                .equalTo("url", url)
                .find<T>();
            return result.entries?.[0] ?? null;
        },
    };
}
