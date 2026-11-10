import type { Money } from "@dertour/core";
import { getLocaleInfo } from "../locales";

/** Options of {@link formatPrice}. */
export interface FormatPriceOptions {
    /** Show cents. Default: only when the amount isn't whole ("1 299 €" vs "1 299,50 €"). */
    fractionDigits?: 0 | 2;
}

/** Formats money for a locale code from the catalogue ("de" → "1.299 €", "de-CH" → "CHF 1’299"). */
export function formatPrice(money: Money, locale: string, { fractionDigits }: FormatPriceOptions = {}): string {
    const digits = fractionDigits ?? (Number.isInteger(money.amount) ? 0 : 2);
    return new Intl.NumberFormat(getLocaleInfo(locale).intl, {
        style: "currency",
        currency: money.currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(money.amount);
}
