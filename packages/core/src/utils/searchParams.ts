/** Primitive values that can be written into a query string. */
export type SearchParamValue = string | number | boolean | null | undefined;

/**
 * Builds a query string from an object. Empty values (`undefined`, `null`, `""`) are skipped, and arrays
 * repeat the key. Keys are sorted, so the same filter always gives the same URL (better for caching).
 */
export function toSearchParams(values: Record<string, SearchParamValue | SearchParamValue[]>): URLSearchParams {
    const params = new URLSearchParams();
    for (const key of Object.keys(values).sort()) {
        const raw = values[key];
        for (const value of Array.isArray(raw) ? raw : [raw]) {
            if (value === undefined || value === null || value === "") continue;
            params.append(key, String(value));
        }
    }
    return params;
}

/** Next.js `searchParams` shape: each key is a string, a string array or missing. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Reads the first value of a search param (Next.js gives `string | string[] | undefined`). */
export function firstParam(params: RawSearchParams, key: string): string | undefined {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
}
