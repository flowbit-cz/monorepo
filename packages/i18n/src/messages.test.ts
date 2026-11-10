import { describe, expect, it } from "vitest";
import { getSharedMessages, sharedMessages } from "./messages";

/** All leaf keys of a nested message object ("common.actions.search"). */
function keys(value: object, prefix = ""): string[] {
    return Object.entries(value).flatMap(([key, child]) =>
        typeof child === "object" && child !== null ? keys(child, `${prefix}${key}.`) : [`${prefix}${key}`],
    );
}

describe("shared messages", () => {
    const reference = keys(sharedMessages.de).sort();

    it.each(Object.keys(sharedMessages))("%s has exactly the same keys as de", (language) => {
        expect(keys(sharedMessages[language as keyof typeof sharedMessages]).sort()).toEqual(reference);
    });

    it("maps regional locales to their language", () => {
        expect(getSharedMessages("de-CH")).toBe(sharedMessages.de);
        expect(getSharedMessages("fr-CH")).toBe(sharedMessages.fr);
    });
});
