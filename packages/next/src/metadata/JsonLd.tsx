/** Serialises JSON-LD safely: `<` is escaped, so data can't close the script tag (XSS). */
export function serializeJsonLd(data: object): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Structured data for search engines (`<JsonLd data={{ "@context": "https://schema.org", ... }} />`). */
export function JsonLd({ data }: { data: object }) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
