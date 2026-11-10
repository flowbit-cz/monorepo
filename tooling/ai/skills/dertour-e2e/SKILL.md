---
name: dertour-e2e
description: Plans, generates and heals Playwright E2E tests for a DERTOUR app using the Playwright test agents (planner, generator, healer) against the app running with mocked APIs. Use when a new page or user flow is added, when asked for "E2E tests", "test the checkout/search flow", or when E2E specs break after UI changes.
---

# E2E tests with Playwright agents

The repo ships the Playwright test agents in `.claude/agents/` and the MCP server `playwright-test` in `.mcp.json`.
The app runs with `API_MOCKING=enabled` (demo data from `@dertour/api/mocks/demo`), German locale and `Europe/Berlin`,
so runs are deterministic.

## New flow

1. **Plan**: delegate to the `playwright-test-planner` agent: "Plan E2E tests for <flow> in apps/<app>. Seed:
   e2e/seed.spec.ts." It explores the running app and writes a plan into `apps/<app>/specs/<flow>.md`.
2. Review the plan. Keep only the flows that matter to users (search, detail, booking request, language switch, errors).
3. **Generate**: delegate to `playwright-test-generator` for each scenario. It writes `apps/<app>/e2e/<flow>.spec.ts`.
4. **Normalise** the generated code to the repo conventions:
   - `import { expect, test } from "@dertour/playwright-config/fixtures";`
   - role/label locators (`getByRole`, `getByLabel`), no CSS selectors, no `waitForTimeout`
   - `await expectAccessible()` on every new page
   - assert URL, title and the HTTP status (404 pages) where relevant
5. Run: `pnpm --filter @<app> exec playwright test e2e/<flow>.spec.ts`. Both projects (chromium + mobile) must pass.

## Broken specs

Delegate to `playwright-test-healer`. It runs the suite, debugs each failure and patches locators and assertions.
Check its diff: if the **app** is wrong (a real regression), fix the app instead and revert the test change.

## Data

Need other data in a scenario? Extend `packages/api/src/mocks/demo/` (realistic, deterministic) instead of mocking
inside the test.
