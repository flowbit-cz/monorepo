import { expect, test } from "@dertour/playwright-config/fixtures";

/**
 * Seed for the Playwright test agents (planner / generator / healer): the starting state of every
 * generated test. The app runs with API_MOCKING=enabled and German (default) locale.
 */
test("seed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();
});
