import { defineRouting } from "next-intl/routing";
import { appData } from "@/config/appData";

/** Locale routing of the app (shared by proxy, navigation and request config). */
export const routing = defineRouting({
    locales: appData.locales,
    defaultLocale: appData.defaultLocale,
    localePrefix: appData.localePrefix,
});
