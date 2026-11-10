# @dertour/playwright-config

```ts
// playwright.config.ts
import { playwrightPreset } from "@dertour/playwright-config";
export default playwrightPreset({ port: 3100 });
```

```ts
// e2e/home.spec.ts
import { test, expect } from "@dertour/playwright-config/fixtures";

test("home is accessible", async ({ page, expectAccessible }) => {
  await page.goto("/");
  await expectAccessible();
});
```

The app runs with `API_MOCKING=enabled`, so tests need no backend. Locally the preset reuses `next dev`.
CI runs `build` + `start`. `E2E_BASE_URL` points the tests at a deployed environment instead.
