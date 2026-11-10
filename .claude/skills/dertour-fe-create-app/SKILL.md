---
name: dertour-fe-create-app
description: Creates a new Next.js frontend app in the DERTOUR monorepo from apps/template. A script does the mechanical part (copy, rename, ports, locales, translations wiring). Claude then shapes the app (brand, modules, API services, texts, CI/Docker) and verifies it. Use whenever someone wants a new app, site, microsite or frontend ("create an app for X", "new Next.js app", "nová appka", "založ web pro …").
---

# Create a new DERTOUR app

`apps/template` is the reference app. A new app is a copy of it, adapted. **Never build an app from scratch**,
and never copy files by hand. Use the script, so every app starts identical.

## 1. Clarify (ask only what you can't infer)

| Input                     | Example                                           | Default                     |
| ------------------------- | ------------------------------------------------- | --------------------------- |
| name (kebab-case)         | `dertour-ch`, `booking`                           | required                    |
| brand / title             | `DERTOUR Schweiz`                                 | `DERTOUR`                   |
| locales (first = default) | `de-CH,fr-CH`                                     | `de,en,cs`                  |
| backend services          | offers API, booking API (OpenAPI URLs)            | demo offers spec            |
| keep demo modules?        | `offers` as a real feature or only as a reference | keep, then decide in step 4 |

Known locales: `de`, `de-AT`, `de-CH`, `fr-CH`, `fr`, `en`, `cs` (`packages/i18n/src/locales.ts`). For another one,
add it to the catalogue and to the script's `LOCALE_LANGUAGE` first.

## 2. Generate

```bash
pnpm create-app <name> --title "<brand>" --locales <a,b> [--port <n>] --dry-run   # check the plan
pnpm create-app <name> --title "<brand>" --locales <a,b> [--port <n>]
pnpm install
cp apps/<name>/.env.example apps/<name>/.env
```

The script copies the template without build output and sets:

- `@dertour/<name>` in `package.json`, the dev port and E2E port (+100)
- `appData.ts` (name, service, locales, default locale), Dockerfile args, README and `.env.example`
- the message files of the chosen languages and the rewired `src/i18n/messages.ts`
- the default locale in `src/test/render.tsx`

**Read the "To do" list it prints, and do every item.**

## 3. Make it pass immediately

```bash
pnpm turbo run lint typecheck test --filter=@dertour/<name>
```

It must be green before you change anything else. Typical leftovers:

- message files copied from English (`fr.json`…) → translate them. Keep the keys and ICU syntax.
  `src/i18n/messages.test.ts` checks keys and syntax.
- default language not German → offer tests and `e2e/offers.spec.ts` query German labels. Point them at the new texts.

## 4. Shape the app

- **appData.ts**: real URLs (`links.privacy`, `links.imprint`), Usercentrics service names.
- **Backend services**: for each API, add it to `packages/api/orval.config.ts` (`SERVICES` + `export default`), the
  `exports` of `packages/api/package.json` and `src/mocks/handlers.ts`. Put `OPENAPI_<SERVICE>_URL` in
  `packages/api/.env.example`, run `pnpm generate`, and add realistic demo data in `packages/api/src/mocks/demo/`.
- **Modules**: one domain = one folder in `src/modules/<name>/`, built like `offers` (read its README). Wire its
  `i18n/*.json` into `src/i18n/messages.ts`. If the demo `offers`/`home` modules aren't needed, replace them and
  delete their routes, tests, messages and E2E specs together.
- **Pages**: `src/app/[locale]/…/page.tsx` only renders a module component and calls its metadata function.
- **Design**: app-specific tokens only in `src/styles/global.css` `@theme`. Anything reusable goes into `@dertour/tokens` or `@dertour/ui`.
- **Integrations**: fill the `NEXT_PUBLIC_*` IDs in the deployment env (Usercentrics, GTM, Datadog).

Follow CLAUDE.md for every file. Write tests with the `dertour-write-tests` skill and E2E with `dertour-e2e`.

## 5. Wire up the monorepo

- **CI**: lint, test, build and E2E run through Turbo `--affected` / all apps, so nothing to add.
- **Docker**: `docker build -f apps/<name>/Dockerfile -t dertour/<name> .` (the args are already set).
- **Playwright agents** (optional): add a `playwright-test-<name>` server to `.mcp.json` with `--dir apps/<name>`.
- Root `README.md`: add the app to the structure overview.

## 6. Verify and hand over

```bash
pnpm turbo run lint typecheck test:coverage build --filter=@dertour/<name>
pnpm --filter @dertour/<name> test:e2e
```

Finish with: the app path, URL/port, locales, the modules and services it uses, open items (translations to check,
real OpenAPI URLs, integration IDs) and the commands above with their results.
