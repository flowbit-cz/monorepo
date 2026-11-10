import { setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/locale";
import { OfferListPage, offerListMetadata, parseOfferSearch } from "@/modules/offers";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/offers">) {
    const [{ locale }, query] = await Promise.all([params, searchParams]);
    return offerListMetadata(toAppLocale(locale), parseOfferSearch(query));
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/offers">) {
    const [{ locale: param }, query] = await Promise.all([params, searchParams]);
    const locale = toAppLocale(param);
    setRequestLocale(locale);
    return <OfferListPage search={parseOfferSearch(query)} locale={locale} />;
}
