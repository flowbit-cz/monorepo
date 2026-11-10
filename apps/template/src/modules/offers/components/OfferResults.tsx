import { getTranslations } from "next-intl/server";
import { searchOffers } from "../api";
import type { OfferSearch } from "../types/search";
import { OfferGrid } from "./OfferGrid";
import { OfferPagination } from "./OfferPagination";

/** Result count, tiles and pagination of a search (streams in, see OfferListPage). */
export async function OfferResults({ search, locale }: { search: OfferSearch; locale: string }) {
    const [t, result] = await Promise.all([getTranslations("offers.list"), searchOffers(search, locale)]);
    return (
        <>
            <p className="font-semibold" role="status">
                {t("results", { count: result.total })}
            </p>
            {result.items.length > 0 ? (
                <OfferGrid offers={result.items} locale={locale} />
            ) : (
                <div className="border-border rounded-lg border border-dashed p-10 text-center">
                    <p className="font-semibold">{t("empty")}</p>
                    <p className="text-text-muted">{t("emptyHint")}</p>
                </div>
            )}
            <OfferPagination page={result} search={search} />
        </>
    );
}
