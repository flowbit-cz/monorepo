import { createMetadata } from "@dertour/next/metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/config/appData";
import { siteSeo } from "@/modules/offers";

/** Homepage metadata (default title and description of the site). */
export async function homeMetadata(locale: AppLocale): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "metadata" });
    return {
        ...createMetadata(siteSeo, { title: t("defaultTitle"), description: t("description"), path: "/", locale }),
        title: { absolute: t("defaultTitle") },
    };
}
