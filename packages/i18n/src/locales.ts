import type { CurrencyCode } from "@dertour/core";

/** Everything an app needs to know about one market/language combination. */
export interface LocaleInfo {
    /** URL / next-intl locale. */
    code: string;
    /** BCP 47 tag used for Intl formatting. */
    intl: string;
    /** Language name in that language (for the locale switcher). */
    label: string;
    /** Default currency of the market. */
    currency: CurrencyCode;
    /** Which shared message file the locale uses. */
    messages: "de" | "en" | "cs" | "fr";
}

/**
 * Catalogue of the locales DERTOUR markets use. An app picks its subset in `appData.locales`.
 * Swiss locales use CHF, so prices must come from the backend in the right currency.
 */
export const LOCALES = {
    de: { code: "de", intl: "de-DE", label: "Deutsch", currency: "EUR", messages: "de" },
    "de-AT": { code: "de-AT", intl: "de-AT", label: "Deutsch (Österreich)", currency: "EUR", messages: "de" },
    "de-CH": { code: "de-CH", intl: "de-CH", label: "Deutsch (Schweiz)", currency: "CHF", messages: "de" },
    "fr-CH": { code: "fr-CH", intl: "fr-CH", label: "Français (Suisse)", currency: "CHF", messages: "fr" },
    fr: { code: "fr", intl: "fr-FR", label: "Français", currency: "EUR", messages: "fr" },
    en: { code: "en", intl: "en-GB", label: "English", currency: "EUR", messages: "en" },
    cs: { code: "cs", intl: "cs-CZ", label: "Čeština", currency: "CZK", messages: "cs" },
} as const satisfies Record<string, LocaleInfo>;

/** Locale codes known to the catalogue. */
export type LocaleCode = keyof typeof LOCALES;

/** Type guard for values coming from the URL or headers. */
export function isLocaleCode(value: string): value is LocaleCode {
    return Object.hasOwn(LOCALES, value);
}

/** Locale info. Throws for unknown codes, which is a programming error, not user input. */
export function getLocaleInfo(code: string): LocaleInfo {
    if (!isLocaleCode(code)) throw new Error(`Unknown locale "${code}".`);
    return LOCALES[code];
}
