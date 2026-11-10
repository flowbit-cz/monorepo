/** Nominal type: a string that is not just any string (e.g. `Brand<string, "OfferId">`). */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Value or `null`. */
export type Nullable<T> = T | null;

/** Makes the selected keys required. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
