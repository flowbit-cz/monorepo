# DERTOUR frontend monorepo

Turborepo + pnpm. Next.js first (App Router, React 19), with room for React Native, Vue and other apps. Backends own
data and e-mails. Apps consume their OpenAPI through generated clients.

```bash
npm install -g pnpm     # Node 26 has no corepack. pnpm switches to the repo version itself (packageManager)
pnpm install
cp apps/template/.env.example apps/template/.env   # API mocks on: no backend needed
pnpm dev                                                    # http://localhost:3000
```

| Command              | What                                                     |
| -------------------- | -------------------------------------------------------- |
| `pnpm dev`           | all apps in dev mode                                     |
| `pnpm verify`        | lint + typecheck + unit/integration tests (CI)           |
| `pnpm test:coverage` | tests with coverage gate                                 |
| `pnpm test:e2e`      | Playwright E2E (mocked API)                              |
| `pnpm test:mutation` | Stryker mutation testing (slow, nightly in CI)           |
| `pnpm storybook`     | design system                                            |
| `pnpm generate`      | API clients from OpenAPI (Orval) + design tokens         |
| `pnpm create-app`    | new app from `apps/template`                             |
| `pnpm ai:install`    | activate the Claude Code hooks and skills (`tooling/ai`) |

## Structure

```
apps/        template (Next.js template app)
packages/    core · i18n · tokens · api · react · ui · next · server · integrations · testing
tooling/     typescript · eslint · prettier · vitest · playwright · ai
```

Read [CLAUDE.md](CLAUDE.md) for the architecture and rules. Each package has its own README.

## New app

```bash
pnpm create-app <name> --title "DERTOUR Schweiz" --locales de-CH,fr-CH   # copy + rename apps/template
pnpm install
```

The script does the mechanical part: package name, ports, `appData`, locales and messages, Dockerfile. The Claude
skill `dertour-fe-create-app` (`tooling/ai/skills`) wraps it and also shapes the app (modules, API services, texts)
and verifies it.

## API clients

Set `OPENAPI_<SERVICE>_URL` (see `packages/api/.env.example`). Without it, Orval uses the bundled demo spec. Details
are in [packages/api/README.md](packages/api/README.md).
