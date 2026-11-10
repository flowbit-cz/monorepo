import { Spinner } from "@dertour/ui";
import { useTranslations } from "next-intl";

/** Placeholder while search results load. Keeps the grid layout, so nothing jumps. */
export function OfferListSkeleton() {
    const t = useTranslations("common");
    return (
        <div className="flex flex-col gap-6" aria-busy="true">
            <Spinner label={t("loading")} className="self-center" />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                    <li key={index} className="bg-surface-muted h-96 animate-pulse rounded-lg" />
                ))}
            </ul>
        </div>
    );
}
