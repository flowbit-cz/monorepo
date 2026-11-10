import { setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/locale";
import { HomePage, homeMetadata } from "@/modules/home";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
    return homeMetadata(toAppLocale((await params).locale));
}

export default async function Page({ params }: PageProps<"/[locale]">) {
    const locale = toAppLocale((await params).locale);
    setRequestLocale(locale);
    return <HomePage locale={locale} />;
}
