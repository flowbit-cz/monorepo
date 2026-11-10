/** One page of a list returned by the backend. */
export interface Paginated<T> {
    items: T[];
    /** 1-based page number. */
    page: number;
    pageSize: number;
    total: number;
}

/** Number of pages (at least 1, so "page 1 of 1" also works for empty lists). */
export function totalPages({ total, pageSize }: Pick<Paginated<unknown>, "total" | "pageSize">): number {
    if (pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
}

/** Page numbers around the current page for a pager, e.g. `[1, "…", 4, 5, 6, "…", 20]`. */
export function pageWindow(current: number, pages: number, radius = 1): Array<number | "…"> {
    const result: Array<number | "…"> = [];
    for (let page = 1; page <= pages; page++) {
        const edge = page === 1 || page === pages;
        const near = Math.abs(page - current) <= radius;
        if (edge || near) result.push(page);
        else if (result.at(-1) !== "…") result.push("…");
    }
    return result;
}
