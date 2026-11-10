import { setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/locale";
import { getOfferDetail, OfferDetailPage, offerDetailMetadata } from "@/modules/offers";

export async function generateMetadata({ params }: PageProps<"/[locale]/offers/[slug]">) {
    const { locale: param, slug } = await params;
    const locale = toAppLocale(param);
    const offer = await getOfferDetail(slug, locale);
    return offer ? offerDetailMetadata(offer, locale) : {};
}

export default async function Page({ params }: PageProps<"/[locale]/offers/[slug]">) {
    const { locale: param, slug } = await params;
    const locale = toAppLocale(param);
    setRequestLocale(locale);
    return <OfferDetailPage slug={slug} locale={locale} />;
}
