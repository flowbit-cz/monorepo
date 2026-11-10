import AxeBuilder from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";

/** Fixtures shared by all E2E suites. */
type Fixtures = {
    /** Runs axe on the current page and fails on WCAG 2.1 A/AA violations. */
    expectAccessible: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
    expectAccessible: async ({ page }, use) => {
        await use(async () => {
            const results = await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
                .analyze();
            expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
        });
    },
});

export { expect };
