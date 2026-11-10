import { useTranslations } from "next-intl";

/** First focusable element: lets keyboard users jump over the header (WCAG 2.4.1). */
export function SkipLink() {
    const t = useTranslations("layout");
    return (
        <a
            href="#main"
            className="focus:bg-brand focus:text-brand-contrast sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
        >
            {t("skipToContent")}
        </a>
    );
}
