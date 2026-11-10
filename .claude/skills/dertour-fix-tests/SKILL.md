---
name: dertour-fix-tests
description: Diagnoses and fixes failing tests in the DERTOUR monorepo (Vitest unit/component/integration, Playwright E2E, typecheck or lint in CI). It decides first whether the test or the code is wrong. Use when CI is red, a hook reports failing related tests, or the user says "tests fail", "fix CI", "make it green".
---

# Fix failing tests

**Rule 1:** find out _why_ before changing anything. A failing test is either a **regression in the code** (fix the
code) or an **outdated test** (the behaviour changed on purpose, so update the test). Never delete, skip or weaken an
assertion only to get green.

## Steps

1. **Reproduce** the narrowest run:
   - unit/component: `pnpm --filter <pkg> exec vitest run <file> -t "<name>"`
   - E2E: `pnpm --filter @dertour/template exec playwright test <spec> --project=chromium`
   - CI only: read the failing job log (`gh run view <id> --log-failed`).
2. **Classify**:
   - assertion differs → compare with the intended behaviour (module README, PR description, git log). Regression → fix
     the code. Intended change → update the test and say so.
   - `Cannot find module …/src/generated/…` → run `pnpm generate` (Orval / tokens). Never commit generated files.
   - type error in generated API types → the backend OpenAPI changed. Adapt `dto.ts` (and the tests) to the new contract.
   - flaky (timing, order) → make it deterministic (`findBy*` / `waitFor`, fake timers, seeded data). No retries or sleeps.
   - E2E selector broke after a UI change → use the `playwright-test-healer` agent, or update the role/label locator.
   - a11y violation → fix the markup (label, alt, contrast, heading order), not the check.
3. **Fix** with the smallest change. Run the narrow test, then `pnpm verify` (lint + typecheck + tests of everything).
4. **Report**: root cause in one sentence, what changed (code or test), and how it was verified.
