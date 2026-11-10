import { StatusPage } from "@dertour/next/components";
import { buttonVariants } from "@dertour/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
    const t = useTranslations("status");
    return (
        <StatusPage code="404" title={t("notFoundTitle")} description={t("notFoundText")}>
            <Link href="/" className={buttonVariants()}>
                {t("backHome")}
            </Link>
        </StatusPage>
    );
}
