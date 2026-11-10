/** A travel period. Dates are ISO dates (`2027-07-01`) without a time zone. */
export interface DateRange {
    from: string;
    to: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

/** `true` when the value is a real calendar date in `YYYY-MM-DD` form. */
export function isIsoDate(value: string): boolean {
    if (!ISO_DATE.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Number of nights between two ISO dates (check-in → check-out). Never negative. */
export function nightsBetween({ from, to }: DateRange): number {
    const diff = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
    return Math.max(0, Math.round(diff / DAY_MS));
}
