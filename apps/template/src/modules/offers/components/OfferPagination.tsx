import { pageWindow, totalPages, type Paginated } from "@dertour/core";
import { cn } from "@dertour/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { OfferSearch } from "../types/search";
import { toOfferSearchQuery } from "../utils";

/** Page links of the listing. Plain links, so crawlers and users without JS can paginate. */
export function OfferPagination({
    page,
    search,
}: {
    page: Pick<Paginated<unknown>, "page" | "pageSize" | "total">;
    search: OfferSearch;
}) {
    const t = useTranslations("common.pagination");
    const pages = totalPages(page);
    if (pages <= 1) return null;

    const href = (target: number) => {
        const query = toOfferSearchQuery({ ...search, page: target });
        return query ? `/offers?${query}` : "/offers";
    };
    const linkClass = "flex size-10 items-center justify-center rounded-md border border-border hover:bg-surface-muted";

    return (
        <nav aria-label={t("label")} className="flex justify-center">
            <ul className="flex items-center gap-2">
                {page.page > 1 && (
                    <li>
                        <Link href={href(page.page - 1)} className={linkClass} aria-label={t("previous")}>
                            ‹
                        </Link>
                    </li>
                )}
                {pageWindow(page.page, pages).map((item, index) =>
                    item === "…" ? (
                        <li key={`gap-${index}`} aria-hidden="true" className="text-text-muted px-1">
                            …
                        </li>
                    ) : (
                        <li key={item}>
                            <Link
                                href={href(item)}
                                aria-label={t("page", { page: item })}
                                aria-current={item === page.page ? "page" : undefined}
                                className={cn(
                                    linkClass,
                                    item === page.page && "border-brand bg-brand text-brand-contrast hover:bg-brand",
                                )}
                            >
                                {item}
                            </Link>
                        </li>
                    ),
                )}
                {page.page < pages && (
                    <li>
                        <Link href={href(page.page + 1)} className={linkClass} aria-label={t("next")}>
                            ›
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
