import { nightsBetween, type DateRange } from "@dertour/core";

/** Trip length, used by ICU messages like `{nights, plural, one {# night} other {# nights}}`. */
export interface TripDuration {
    nights: number;
    days: number;
}

/** Nights and days of a trip (7 nights = 8 days). */
export function tripDuration(range: DateRange): TripDuration {
    const nights = nightsBetween(range);
    return { nights, days: nights + 1 };
}
