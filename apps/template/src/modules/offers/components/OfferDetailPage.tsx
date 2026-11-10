import { formatDateRange, formatPrice } from "@dertour/i18n";
import { JsonLd } from "@dertour/next/json-ld";
import { Badge, buttonVariants, Rating } from "@dertour/ui";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/config/appData";
import { Link } from "@/i18n/navigation";
import { getOfferDetail } from "../api";
import { offerJsonLd } from "../metadata";
import { FavoriteButton } from "./FavoriteButton";

/** Offer detail. Unknown slugs render the route's not-found page. */
export async function OfferDetailPage({ slug, locale }: { slug: string; locale: AppLocale }) {
    const offer = await getOfferDetail(slug, locale);
    if (!offer) notFound();

    const [t, tCommon] = await Promise.all([getTranslations("offers.detail"), getTranslations("common")]);

    return (
        <article className="flex flex-col gap-8" aria-labelledby="offer-title">
            <JsonLd data={offerJsonLd(offer, locale)} />
            <Link href="/offers" className="text-brand text-sm font-semibold hover:underline">
                ← {t("backToList")}
            </Link>

            <header className="flex flex-col gap-2">
                <Rating value={offer.stars} label={tCommon("stars", { count: offer.stars })} />
                <div className="flex items-start justify-between gap-4">
                    <h1 id="offer-title" className="text-brand text-3xl font-bold sm:text-4xl">
                        {offer.title}
                    </h1>
                    <FavoriteButton slug={offer.slug} title={offer.title} />
                </div>
                <p className="text-text-muted">{offer.location}</p>
            </header>

            <div className="bg-surface-muted relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                    src={offer.image.url}
                    alt={offer.image.alt}
                    fill
                    priority
                    sizes="(min-width: 80rem) 75rem, 100vw"
                    className="object-cover"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <p className="text-lg">{offer.description}</p>
                    <section aria-labelledby="highlights">
                        <h2 id="highlights" className="mb-3 text-xl font-semibold">
                            {t("highlights")}
                        </h2>
                        <ul className="flex flex-wrap gap-2">
                            {offer.highlights.map((highlight) => (
                                <li key={highlight}>
                                    <Badge tone="brand">{highlight}</Badge>
                                </li>
                            ))}
                        </ul>
                    </section>
                    {offer.gallery.length > 0 && (
                        <section aria-labelledby="gallery">
                            <h2 id="gallery" className="mb-3 text-xl font-semibold">
                                {t("gallery")}
                            </h2>
                            <ul className="grid grid-cols-2 gap-4">
                                {offer.gallery.map((image) => (
                                    <li key={image.url} className="relative aspect-[4/3] overflow-hidden rounded-md">
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            sizes="(min-width: 64rem) 25vw, 50vw"
                                            className="object-cover"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <aside className="bg-surface-muted flex h-fit flex-col gap-4 rounded-lg p-6" aria-label={t("price")}>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                        <dt className="text-text-muted">{t("travelPeriod")}</dt>
                        <dd>
                            {formatDateRange(offer.departureDate, offer.returnDate, locale)} (
                            {tCommon("duration.nights", { nights: offer.nights })})
                        </dd>
                        <dt className="text-text-muted">{t("board")}</dt>
                        <dd>{tCommon(`board.${offer.board}`)}</dd>
                    </dl>
                    <p className="text-brand text-3xl font-bold">
                        {tCommon("price.from", { price: formatPrice(offer.price, locale) })}{" "}
                        <span className="text-text-muted text-sm font-normal">{tCommon("price.perPerson")}</span>
                    </p>
                    <a href="#" className={buttonVariants({ variant: "accent", fullWidth: true })}>
                        {t("book")}
                    </a>
                </aside>
            </div>
        </article>
    );
}
