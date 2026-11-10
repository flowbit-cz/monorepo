# DERTOUR frontend monorepo: instructions for AI and developers

Turborepo + pnpm monorepo for DERTOUR frontends. It's Next.js first, and React Native, Vue and other apps fit in too.
**Backends own data, business rules and e-mails.** Apps never talk to a database and never send e-mails. They call
backend APIs through clients generated from OpenAPI.

Follow these rules strictly. When something here doesn't fit, ask and document the deviation (last section).

## Layout

```
apps/<app>/              # deployable apps (apps/template = template; new apps via `pnpm create-app`)
packages/                # runtime code shared by apps
  core                   # framework-free TS: Money, DateRange, Paginated, utils, createEnv
  i18n                   # locale catalogue (de, de-AT, de-CH, fr-CH, fr, en, cs), Intl formatters, shared messages
  tokens                 # design tokens JSON → Tailwind v4 @theme CSS + typed TS
  api                    # Orval-generated clients (fetch, React Query, zod, MSW mocks) + customFetch
  react                  # React without DOM/Next: QueryProvider, hooks (web + React Native)
  ui                     # design system (Tailwind + tokens, Storybook)
  next                   # Next.js helpers: withDertour config, metadata/SEO, JSON-LD, i18n proxy, health
  server                 # BFF helpers for route handlers/server actions: errors, runHandler, logger, rate limit
  integrations           # optional: Datadog RUM, Usercentrics, GTM, Contentstack
  testing                # renderWithProviders, setupMswServer, expectNoA11yViolations
tooling/                 # dev-time config only: typescript, eslint, prettier, vitest, playwright, ai
```

**Layer rule (ESLint-enforced, `tooling/eslint/boundaries.mjs`):** dependencies point one way:
`core → i18n | tokens → api → react → ui → next | integrations`. `core`, `i18n` and `api` stay free of React and
Next, so any app (Vue, React Native, Node) can use them.

## Libraries

Use what's there before adding anything. New dependencies need a reason, go into the `catalog:` in
`pnpm-workspace.yaml` (one version for the whole repo) and must be approved.

| Need                  | Use                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| framework             | Next.js 16 (App Router, `proxy.ts`), React 19, TypeScript strict                                                                |
| API calls             | generated `@dertour/api/<service>` (server) and `/query` hooks (client). **Never hand-write fetch calls to the backend.**       |
| validation            | zod 4 (forms, env, URL params, contracts)                                                                                       |
| forms                 | react-hook-form + `zodResolver`, schema in `<Form>.form.ts`                                                                     |
| client state          | URL first, then React state, then zustand (`<name>.store.ts`) for shared or persistent state                                    |
| server state (client) | TanStack Query (generated hooks)                                                                                                |
| i18n                  | next-intl 4 + `@dertour/i18n` formatters                                                                                        |
| styling               | Tailwind v4 with tokens only (`bg-brand`, `text-text-muted`). No hard-coded colors. CSS Modules only when Tailwind can't do it. |
| UI components         | `@dertour/ui` (extend it there, don't fork it in apps)                                                                          |
| dates                 | ISO strings + `@dertour/i18n` (`formatDate`, `formatDateRange`), date-fns for arithmetic                                        |

## App architecture (see apps/template)

- `src/app/**` **only routes**: a page reads params, sets the locale, calls `generateMetadata`, and renders one component
  from a module. No fetching, no state and no markup beyond that (ESLint blocks `@dertour/api`, zustand and react-query there).
- `src/modules/<domain>/` holds **everything domain-specific**: `api.ts` (server calls, `server-only`), `queries.ts`
  (client hooks), `dto.ts` (backend → UI model), `utils.ts`, `metadata.ts`, `<name>.store.ts`, `types/`, `i18n/{de,en,cs}.json`,
  `components/`, `README.md` (business rules), `index.ts` (server API) and `index.client.ts` (client API).
  Other code imports a module **only through its index** (ESLint-enforced).
- `src/components/` only app-wide, domain-neutral components (layout, providers, integrations).
- `src/config/appData.ts`: name, URLs, locales, service name. Never hard-code them elsewhere.
- `src/lib/env.ts`: every env variable, zod-validated at startup. `NEXT_PUBLIC_` only for values the browser may see.
- Server Components by default. `"use client"` as low in the tree as possible.
- Public pages: `generateMetadata` through `createMetadata` (canonical, hreflang, OG), JSON-LD for rich results, and
  filtered or search pages `noindex`.
- Every route has a proper not-found. Prefer component-level `Suspense` over route `loading.tsx`, because a route
  loading boundary streams child routes and turns their 404 into 200.

## Texts

No text is hard-coded in components. Shared texts are in `packages/i18n/src/messages`, app texts in
`src/i18n/locales`, module texts in `src/modules/<m>/i18n`. All three are merged in `src/i18n/messages.ts`. All
languages have the same keys (tests enforce it). German is the source language.

## Testing (required, and automated with AI)

The pyramid: many unit tests, fewer integration tests, few E2E tests. Every change ships with its tests.

| What                                    | How                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `utils.ts`, packages `core/i18n/server` | unit (Vitest), `it.each` for edge cases                                     |
| `dto.ts`                                | mapping + contract (generated mock parses with generated zod)               |
| `*.form.ts`                             | every validation rule                                                       |
| `api.ts`                                | integration with the generated client + MSW (`setupMswServer`)              |
| components                              | Testing Library by role/label + `expectNoA11yViolations()`                  |
| user flows                              | Playwright in `apps/<app>/e2e`, mocked API, `expectAccessible()`            |
| test quality                            | coverage gate (packages 80 %, apps 70 %) + nightly Stryker mutation testing |

Tests sit next to the file (`utils.ts` → `utils.test.ts`). They test behaviour, not implementation, and they are
deterministic (MSW, fake timers, seeded data). **Never delete, skip or weaken a test to get green.**

AI automation (`tooling/ai`, activate with `pnpm ai:install`): hooks run related tests after every edit and verify
before Claude finishes. The skills are `dertour-fe-create-app` (new app from the template), `dertour-write-tests`, `dertour-fix-tests`, `dertour-e2e` (Playwright agents) and
`dertour-test-audit` (mutation testing). CI runs Claude on PRs to add missing tests and on red CI to propose fixes.

## Commands

```bash
pnpm dev | build | lint | typecheck | test | test:coverage | test:e2e | test:mutation
pnpm verify                    # lint + typecheck + test of everything (what CI runs)
pnpm generate                  # Orval clients + design tokens (runs automatically before dev/build/test)
pnpm storybook                 # @dertour/ui
pnpm --filter @dertour/<pkg> <script>
```

A task is done only when `pnpm verify` passes (and the E2E tests, if a flow changed).

## Conventions

- Names in English. Components `PascalCase.tsx`, everything else `camelCase.ts`, constants `UPPER_SNAKE_CASE`.
- File suffixes: `.form.ts`, `.store.ts`, `.test.ts(x)`, `.stories.tsx`, `index.client.ts`.
- Short components with one job. Short comments on every exported function, component and type (what and why).
- Conventional commits (`feat(offers): …`, `fix(api): …`), checked by commitlint. Prettier + ESLint run on commit.
- Generated code (`src/generated/**`) is never edited or committed.

## Project-specific deviations

_None yet. Document every deviation here, with the reason._
