import { formatDateRange, formatPrice } from "@dertour/i18n";
import { Badge, Card, CardBody, CardFooter, CardMedia, Rating } from "@dertour/ui";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { OfferCardModel } from "../types/offer";
import { offerPath } from "../utils";
import { FavoriteButton } from "./FavoriteButton";

/** Offer tile: image, hotel, location, travel period, board and price. The whole card links to the detail. */
export function OfferCard({
    offer,
    locale,
    priority = false,
}: {
    offer: OfferCardModel;
    locale: string;
    priority?: boolean;
}) {
    const tCommon = useTranslations("common");
    const titleId = `offer-${offer.id}`;

    return (
        <Card aria-labelledby={titleId} className="group relative h-full">
            <CardMedia>
                <Image
                    src={offer.image.url}
                    alt={offer.image.alt}
                    fill
                    priority={priority}
                    sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                    className="object-cover transition-transform group-hover:scale-105"
                />
                <FavoriteButton slug={offer.slug} title={offer.title} className="absolute top-3 right-3 z-10" />
            </CardMedia>
            <CardBody>
                <Badge>{tCommon(`board.${offer.board}`)}</Badge>
                <h3 id={titleId} className="text-lg font-semibold">
                    <Link
                        href={offerPath(offer.slug)}
                        className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                        {offer.title}
                    </Link>
                </h3>
                <Rating value={offer.stars} label={tCommon("stars", { count: offer.stars })} />
                <p className="text-text-muted text-sm">{offer.location}</p>
                <p className="text-text-muted text-sm">
                    {formatDateRange(offer.departureDate, offer.returnDate, locale)} ·{" "}
                    {tCommon("duration.nights", { nights: offer.nights })}
                </p>
            </CardBody>
            <CardFooter>
                <span className="text-text-muted text-sm">{tCommon("price.perPerson")}</span>
                <strong className="text-brand text-xl">
                    {tCommon("price.from", { price: formatPrice(offer.price, locale) })}
                </strong>
            </CardFooter>
        </Card>
    );
}
