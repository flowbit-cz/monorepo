import { defineConfig, devices } from "@playwright/test";

/**
 * Shared Playwright config for apps.
 *
 * The app runs against mocked APIs (MSW, API_MOCKING=enabled), so E2E tests never need a real backend.
 * Locally it reuses a running `next dev`. CI builds and starts the production server instead.
 *
 * @param {object} options
 * @param {number} [options.port]
 * @param {Record<string, string>} [options.env] extra env for the web server
 * @param {string} [options.locale] browser locale (Accept-Language), so locale detection is deterministic
 */
export function playwrightPreset({ port = 3100, env = {}, locale = "de-DE" } = {}) {
    const isCI = Boolean(process.env.CI);
    const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;
    const mockEnv = { API_MOCKING: "enabled", ...env };

    return defineConfig({
        testDir: "./e2e",
        fullyParallel: true,
        forbidOnly: isCI,
        retries: isCI ? 2 : 0,
        workers: isCI ? 2 : undefined,
        // Locally `next dev` compiles pages on the first request, so give assertions more time there.
        expect: { timeout: isCI ? 5_000 : 15_000 },
        reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
        use: {
            baseURL,
            locale,
            timezoneId: "Europe/Berlin",
            trace: "on-first-retry",
            screenshot: "only-on-failure",
            video: "retain-on-failure",
        },
        projects: [
            { name: "chromium", use: { ...devices["Desktop Chrome"] } },
            { name: "mobile", use: { ...devices["Pixel 7"] } },
        ],
        webServer: process.env.E2E_BASE_URL
            ? undefined
            : {
                  command: isCI ? `pnpm build && pnpm start --port ${port}` : `pnpm dev --port ${port}`,
                  url: baseURL,
                  reuseExistingServer: !isCI,
                  timeout: 180_000,
                  env: mockEnv,
              },
    });
}
