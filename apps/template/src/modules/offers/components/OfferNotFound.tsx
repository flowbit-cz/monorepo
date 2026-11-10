import { StatusPage } from "@dertour/next/components";
import { buttonVariants } from "@dertour/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** 404 of an offer detail: links back to the listing instead of a generic error. */
export function OfferNotFound() {
    const t = useTranslations("offers");
    return (
        <StatusPage code="404" title={t("notFound.title")} description={t("notFound.text")}>
            <Link href="/offers" className={buttonVariants()}>
                {t("detail.backToList")}
            </Link>
        </StatusPage>
    );
}
