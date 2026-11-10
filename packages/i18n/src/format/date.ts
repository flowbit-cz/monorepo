import { getLocaleInfo } from "../locales";

/** Parses an ISO date (`2027-07-01`) as a calendar date, so the day is the same in every time zone. */
function toUtcDate(isoDate: string): Date {
    return new Date(`${isoDate}T00:00:00Z`);
}

/** Formats an ISO date for a locale ("de" → "01.07.2027", style "long" → "1. Juli 2027"). */
export function formatDate(isoDate: string, locale: string, style: "short" | "medium" | "long" = "short"): string {
    const options: Intl.DateTimeFormatOptions =
        style === "short"
            ? { day: "2-digit", month: "2-digit", year: "numeric" }
            : { day: "numeric", month: style === "long" ? "long" : "short", year: "numeric" };
    return new Intl.DateTimeFormat(getLocaleInfo(locale).intl, { ...options, timeZone: "UTC" }).format(
        toUtcDate(isoDate),
    );
}

/** Formats a travel period ("01.07. – 08.07.2027"), using Intl's own range rules. */
export function formatDateRange(from: string, to: string, locale: string): string {
    return new Intl.DateTimeFormat(getLocaleInfo(locale).intl, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).formatRange(toUtcDate(from), toUtcDate(to));
}
