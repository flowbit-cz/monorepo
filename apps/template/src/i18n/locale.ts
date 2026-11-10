import { hasLocale } from "next-intl";
import type { AppLocale } from "@/config/appData";
import { routing } from "./routing";

/** Route param → app locale. The [locale] layout already 404s unknown locales, so this only narrows the type. */
export function toAppLocale(value: string): AppLocale {
    return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
