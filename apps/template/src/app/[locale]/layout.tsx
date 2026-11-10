import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Integrations } from "@/components/Integrations";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { Providers } from "@/components/Providers";
import { appData } from "@/config/appData";
import { routing } from "@/i18n/routing";
import { browserApiBaseUrl } from "@/lib/env";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({
        locale: hasLocale(routing.locales, locale) ? locale : appData.defaultLocale,
        namespace: "metadata",
    });
    return {
        metadataBase: new URL(appData.siteUrl),
        title: { template: t("titleTemplate"), default: t("defaultTitle") },
        description: t("description"),
        applicationName: appData.name,
    };
}

/** Root layout per locale: <html lang>, providers, header/footer and optional third-party scripts. */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);

    return (
        <html lang={locale}>
            <body className="bg-surface text-text flex min-h-dvh flex-col">
                <NextIntlClientProvider>
                    <Providers apiBaseUrl={browserApiBaseUrl()}>
                        <SkipLink />
                        <Header />
                        <main id="main" className="flex-1 py-8 sm:py-12">
                            <Container>{children}</Container>
                        </main>
                        <Footer />
                    </Providers>
                </NextIntlClientProvider>
                <Integrations locale={locale} />
            </body>
        </html>
    );
}
