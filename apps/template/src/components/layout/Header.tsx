import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { LocaleSwitcher } from "./LocaleSwitcher";

/** Site header: logo, main navigation and language switch. */
export function Header() {
    const t = useTranslations("layout");
    return (
        <header className="border-border bg-surface border-b">
            <Container className="flex h-16 items-center justify-between gap-4">
                <Link href="/" aria-label={t("homeLink")} className="text-brand text-2xl font-black tracking-tight">
                    DERTOUR
                </Link>
                <nav aria-label={t("mainNavigation")} className="flex items-center gap-6">
                    <ul className="flex gap-4 font-semibold">
                        <li>
                            <Link href="/" className="hover:text-brand">
                                {t("nav.home")}
                            </Link>
                        </li>
                        <li>
                            <Link href="/offers" className="hover:text-brand">
                                {t("nav.offers")}
                            </Link>
                        </li>
                    </ul>
                    <LocaleSwitcher />
                </nav>
            </Container>
        </header>
    );
}
