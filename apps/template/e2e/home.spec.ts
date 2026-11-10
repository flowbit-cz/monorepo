import { expect, test } from "@dertour/playwright-config/fixtures";
import { LOCALES } from "@dertour/i18n";
import { appData } from "../src/config/appData";
import { getMessages } from "../src/i18n/messages";

// Texts come from the app's messages, so the suite works for any locale set (apps created from this template).
const defaultMessages = getMessages(appData.defaultLocale);
const otherLocale = appData.locales.find((locale) => locale !== appData.defaultLocale);

test.describe("home", () => {
    test("shows the hero and recommended offers", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("heading", { level: 1, name: defaultMessages.home.hero.title })).toBeVisible();
        await expect(
            page.getByRole("region", { name: defaultMessages.home.featured.title }).getByRole("article"),
        ).toHaveCount(3);
    });

    test("is accessible", async ({ page, expectAccessible }) => {
        await page.goto("/");
        await expect(page.getByRole("article").first()).toBeVisible();
        await expectAccessible();
    });

    test("has SEO basics", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(defaultMessages.metadata.defaultTitle);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
        for (const locale of appData.locales) {
            await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveCount(1);
        }
    });

    test("switches language and keeps the page", async ({ page }) => {
        test.skip(!otherLocale, "The app has a single locale.");
        await page.goto("/offers");
        await page.getByLabel(defaultMessages.layout.language).selectOption(LOCALES[otherLocale!].code);
        await expect(page).toHaveURL(new RegExp(`/${otherLocale}/offers$`));
        await expect(
            page.getByRole("heading", { level: 1, name: getMessages(otherLocale!).offers.list.title }),
        ).toBeVisible();
    });
});
