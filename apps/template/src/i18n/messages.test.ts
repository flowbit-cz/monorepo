import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import { appData } from "@/config/appData";
import { getMessages } from "./messages";

/** All leaf keys of a nested message object. */
function keys(value: object, prefix = ""): string[] {
    return Object.entries(value).flatMap(([key, child]) =>
        typeof child === "object" && child !== null ? keys(child, `${prefix}${key}.`) : [`${prefix}${key}`],
    );
}

describe("messages", () => {
    const reference = keys(getMessages(appData.defaultLocale)).sort();

    it.each(appData.locales)("%s has exactly the same keys as the default locale", (locale) => {
        expect(keys(getMessages(locale)).sort()).toEqual(reference);
    });

    it.each(appData.locales)("%s contains only valid ICU messages", (locale) => {
        const invalid: string[] = [];
        const t = createTranslator({
            locale,
            messages: getMessages(locale),
            onError: (error) => {
                if (error.code === "INVALID_MESSAGE") invalid.push(error.message);
            },
        });
        // Arguments aren't known here. Formatting errors are fine, only syntax errors count.
        for (const key of reference) (t as unknown as (key: string) => string)(key);
        expect(invalid).toEqual([]);
    });
});
