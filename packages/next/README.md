# @dertour/next

Next.js building blocks shared by all apps.

| Import                           | What                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `@dertour/next/config`           | `withDertour(config, { monorepoRoot })`: standalone, transpile, headers, images |
| `@dertour/next/security-headers` | `securityHeaders()`                                                             |
| `@dertour/next/metadata`         | `createMetadata(site, page)`: canonical, hreflang, OG, robots                   |
| `@dertour/next/json-ld`          | `<JsonLd data={...} />` (XSS-safe)                                              |
| `@dertour/next/proxy`            | `createI18nProxy(routing)`, `I18N_PROXY_MATCHER` (Next 16 `proxy.ts`)           |
| `@dertour/next/health`           | `createHealthRoute({ service, checks })`                                        |
| `@dertour/next/components`       | `StatusPage` for error and not-found pages                                      |
