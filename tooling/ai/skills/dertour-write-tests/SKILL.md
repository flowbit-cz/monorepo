---
name: dertour-write-tests
description: Writes or completes Vitest tests in the DERTOUR monorepo for changed or given files (utils, dto, zod/form schemas, api services, stores, metadata, UI components, packages) following the repo testing rules. Use whenever code was added or changed without tests, when a hook reports "has no test yet", when asked to "add tests", "cover this", "write tests for the PR", or when coverage is below the gate.
---

# Write tests (DERTOUR monorepo)

Goal: tests that **fail when the behaviour breaks**. A test that only raises coverage is not the goal.

## 1. Find what to test

- Given files → those. Otherwise: `git diff --name-only origin/main...HEAD` plus `git status --porcelain`.
- Skip `src/generated/**`, `index.ts`, `index.client.ts`, `types/**`, stories and config files.
- For every remaining file, check whether `<name>.test.ts(x)` exists next to it. Read the existing test first and extend it,
  never duplicate it.

## 2. Pick the test type

| File                       | Test                                                                                                                                                                         | Environment                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `utils.ts`, `packages/core | i18n/**`                                                                                                                                                                     | unit: pure input → output, `it.each` tables for edge cases | node |
| `dto.ts`                   | mapping + **contract**: generated mock `get*ResponseMock()` must parse with the generated zod `*Response` and map without throwing                                           | node                                                       |
| `*.form.ts` (zod)          | every rule: valid case, each error key, boundaries (min/max, date order)                                                                                                     | node                                                       |
| `api.ts` (module services) | integration: real generated client + `setupMswServer(handlers)` from `@dertour/testing/msw`, override with `server.use(get…MockHandler(...))` or `http.get(...)` for 404/500 | `// @vitest-environment node`                              |
| `*.store.ts` (zustand)     | actions + persistence (`localStorage`), reset the state in `beforeEach`                                                                                                      | jsdom                                                      |
| components (`*.tsx`)       | behaviour through roles/labels with `renderApp` (`@/test/render`) or `renderWithProviders`, the `user` from the render result, and `expectNoA11yViolations()`                | jsdom                                                      |
| `metadata.ts`              | canonical / hreflang / robots / JSON-LD from real data                                                                                                                       | node + `vi.mock("next-intl/server")`                       |

## 3. Rules (from CLAUDE.md)

- Test **behaviour, not implementation**. Query by role, label or text the user sees, never by CSS classes or test ids
  (classes only when the class _is_ the contract, like variants in `@dertour/ui`).
- Real texts: apps render with real messages (`renderApp(ui, "de")`), so the tests also check the translations.
- Deterministic: no real network (MSW `onUnhandledRequest: "error"`), no real time (`vi.useFakeTimers()`), seeded faker.
- Mock only the edges: `@/i18n/navigation` (router), `next/navigation`, `next-intl/server`. Never mock the module under test.
- One `describe` per exported function or component, with test names that describe behaviour ("falls back to defaults for invalid values").
- Cover: the happy path, every branch, the boundaries, invalid input and the error path (backend 404/500).
- Never weaken an existing assertion or add `.skip`/`.only` to get green. If the code is wrong, say so and fix the code.

## 4. Verify

```bash
pnpm --filter <package> exec vitest run <file>    # the new tests
pnpm --filter <package> test:coverage              # coverage gate must stay green
```

Finish with a short list: files tested, cases covered, and bugs found in the code (if any).
