import { expect, test } from "@dertour/playwright-config/fixtures";

test.describe("offers", () => {
    test("filters by destination through the URL", async ({ page }) => {
        await page.goto("/offers");
        await expect(page.getByRole("status").filter({ hasText: "Angebote" })).toHaveText("6 Angebote");

        const destination = page.getByLabel("Reiseziel");
        await expect(destination).toBeEnabled();
        await destination.selectOption("PMI");
        await page.getByRole("button", { name: "Suchen" }).click();

        await expect(page).toHaveURL(/\/offers\?destination=PMI$/);
        await expect(page.getByRole("status").filter({ hasText: "Angebote" })).toHaveText("2 Angebote");
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });

    test("validates the travel dates", async ({ page }) => {
        await page.goto("/offers");
        await page.getByLabel("Hinreise ab").fill("2027-07-08");
        await page.getByLabel("Rückreise bis").fill("2027-07-01");
        await page.getByRole("button", { name: "Suchen" }).click();
        await expect(page.getByText("Das Rückreisedatum muss nach dem Hinreisedatum liegen")).toBeVisible();
        await expect(page).toHaveURL(/\/offers$/);
    });

    test("opens an offer detail", async ({ page, expectAccessible }) => {
        await page.goto("/offers");
        await page.getByRole("link", { name: "Hotel Playa Azul" }).click();
        await expect(page).toHaveURL(/\/offers\/hotel-playa-azul-mallorca$/);
        await expect(page.getByRole("heading", { level: 1, name: "Hotel Playa Azul" })).toBeVisible();
        await expect(page).toHaveTitle("Hotel Playa Azul – Mallorca, Spain | DERTOUR");
        const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
        expect(jsonLd).toMatchObject({ "@type": "Hotel", name: "Hotel Playa Azul" });
        await expectAccessible();
    });

    test("remembers favourites across reloads", async ({ page }) => {
        await page.goto("/offers/hotel-playa-azul-mallorca");
        await page.getByRole("button", { name: "Hotel Playa Azul merken" }).click();
        await page.reload();
        await expect(page.getByRole("button", { name: "Hotel Playa Azul nicht mehr merken" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
    });

    test("shows a 404 for unknown offers", async ({ page }) => {
        const response = await page.goto("/offers/does-not-exist");
        expect(response?.status()).toBe(404);
        await expect(page.getByRole("heading", { name: "Angebot nicht gefunden" })).toBeVisible();
    });
});

test("health endpoint answers", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBe(true);
    expect(await response.json()).toMatchObject({ status: "ok", service: expect.any(String) });
});
