"use client";

import { LOCALES } from "@dertour/i18n";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { appData, type AppLocale } from "@/config/appData";
import { usePathname, useRouter } from "@/i18n/navigation";

/** Switches the language and stays on the same page. */
export function LocaleSwitcher() {
    const t = useTranslations("layout");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [pending, startTransition] = useTransition();

    return (
        <label className="flex items-center gap-2 text-sm">
            <span className="sr-only">{t("language")}</span>
            <select
                value={locale}
                disabled={pending}
                onChange={(event) => {
                    const next = event.target.value as AppLocale;
                    startTransition(() => {
                        // @ts-expect-error -- params of the current route always match the current pathname
                        router.replace({ pathname, params }, { locale: next });
                    });
                }}
                className="border-border bg-surface rounded-md border px-2 py-1"
            >
                {appData.locales.map((code) => (
                    <option key={code} value={code}>
                        {LOCALES[code].label}
                    </option>
                ))}
            </select>
        </label>
    );
}
