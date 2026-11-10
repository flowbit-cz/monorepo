# @dertour/server

The backend owns data and e-mails. This package is only for the thin **BFF layer** inside apps
(route handlers, server actions) that calls the backend.

| Import                      | What                                                                  |
| --------------------------- | --------------------------------------------------------------------- |
| `@dertour/server/errors`    | `HttpError`, `toErrorResponse` (HttpError, zod 422, backend 4xx, 500) |
| `@dertour/server/handler`   | `createRunHandler(logger)`, `json()`                                  |
| `@dertour/server/logger`    | `createLogger({ service })`: JSON lines for Datadog                   |
| `@dertour/server/rateLimit` | `createRateLimiter`, `assertWithinLimit`, `clientIp`                  |
