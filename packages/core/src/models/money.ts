/** ISO 4217 currency code (EUR, CHF, CZK…). */
export type CurrencyCode = string;

/** An amount of money. `amount` is in major units (199.5 = 199,50 €). */
export interface Money {
    amount: number;
    currency: CurrencyCode;
}

/** Adds amounts of the same currency. It throws on mixed currencies instead of silently summing them. */
export function sumMoney(items: Money[], currency: CurrencyCode): Money {
    let total = 0;
    for (const item of items) {
        if (item.currency !== currency) throw new Error(`Cannot add ${item.currency} to ${currency}.`);
        total += Math.round(item.amount * 100);
    }
    return { amount: total / 100, currency };
}

/** Price per person → total for a number of travellers (rounded to cents). */
export function multiplyMoney(money: Money, factor: number): Money {
    return { amount: Math.round(money.amount * 100 * factor) / 100, currency: money.currency };
}
