import { getSharedMessages } from "@dertour/i18n";
import homeCs from "@/modules/home/i18n/cs.json";
import homeDe from "@/modules/home/i18n/de.json";
import homeEn from "@/modules/home/i18n/en.json";
import offersCs from "@/modules/offers/i18n/cs.json";
import offersDe from "@/modules/offers/i18n/de.json";
import offersEn from "@/modules/offers/i18n/en.json";
import type { AppLocale } from "@/config/appData";
import cs from "./locales/cs.json";
import de from "./locales/de.json";
import en from "./locales/en.json";

/**
 * App translations = shared messages (@dertour/i18n: common.*, errors.*) + global app messages
 * (src/i18n/locales) + one namespace per module (src/modules/<name>/i18n).
 * A new module adds its JSON files here.
 */
const appMessages = {
    de: { ...de, home: homeDe, offers: offersDe },
    en: { ...en, home: homeEn, offers: offersEn },
    cs: { ...cs, home: homeCs, offers: offersCs },
} satisfies Record<AppLocale, unknown>;

/** All messages of a locale. */
export function getMessages(locale: AppLocale) {
    return { ...getSharedMessages(locale), ...appMessages[locale] };
}

/** Shape of the messages (German is the source language). */
export type Messages = ReturnType<typeof getMessages>;
