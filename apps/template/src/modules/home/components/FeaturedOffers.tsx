import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedOffers, OfferGrid } from "@/modules/offers";

/** Recommended offers on the homepage (server-side, streamed in a Suspense boundary). */
export async function FeaturedOffers({ locale }: { locale: string }) {
    const [t, offers] = await Promise.all([getTranslations("home.featured"), getFeaturedOffers(locale)]);
    return (
        <section className="flex flex-col gap-6" aria-labelledby="featured-title">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="featured-title" className="text-brand text-2xl font-bold">
                    {t("title")}
                </h2>
                <Link href="/offers" className="text-brand font-semibold hover:underline">
                    {t("all")} →
                </Link>
            </div>
            <OfferGrid offers={offers} locale={locale} />
        </section>
    );
}
