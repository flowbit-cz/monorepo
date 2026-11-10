import { useTranslations } from "next-intl";
import { appData } from "@/config/appData";
import { Container } from "./Container";

/** Site footer with legal links (URLs from appData). */
export function Footer() {
    const t = useTranslations("layout.footer");
    return (
        <footer className="bg-surface-inverted text-text-inverted mt-16 py-10">
            <Container className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p>{t("copyright", { year: new Date().getFullYear() })}</p>
                <ul className="flex gap-6">
                    <li>
                        <a href={appData.links.privacy} className="hover:underline">
                            {t("privacy")}
                        </a>
                    </li>
                    <li>
                        <a href={appData.links.imprint} className="hover:underline">
                            {t("imprint")}
                        </a>
                    </li>
                </ul>
            </Container>
        </footer>
    );
}
