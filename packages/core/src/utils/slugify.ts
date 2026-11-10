/** Turns any text into a URL slug: lowercase ASCII, words joined by dashes ("Côte d'Azur" → "cote-d-azur"). */
export function slugify(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/ß/g, "ss")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
