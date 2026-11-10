import { buttonVariants } from "@dertour/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Homepage hero with the main call to action. */
export function Hero() {
    const t = useTranslations("home.hero");
    return (
        <section
            className="bg-surface-inverted text-text-inverted rounded-xl px-6 py-16 sm:px-12 sm:py-24"
            aria-labelledby="hero-title"
        >
            <h1 id="hero-title" className="max-w-2xl text-4xl font-bold sm:text-5xl">
                {t("title")}
            </h1>
            <p className="mt-4 max-w-xl text-lg opacity-90">{t("subtitle")}</p>
            <Link href="/offers" className={buttonVariants({ variant: "accent", size: "lg", className: "mt-8" })}>
                {t("cta")}
            </Link>
        </section>
    );
}
