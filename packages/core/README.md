# @dertour/core

The lowest layer. Framework-free TypeScript (no React, no Next.js), so Vue, React Native and Node apps can use it.

| Export              | What                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| `@dertour/core`     | `Money`, `DateRange`, `Paginated`, `slugify`, `invariant`, `toSearchParams`… |
| `@dertour/core/env` | `createEnv()`: zod-validated env, fails fast at startup                      |

Rules:

- Only pure functions and types. Anything that touches the DOM, React or a framework belongs to a higher layer.
- Every function has a unit test next to it. Coverage is gated at 80 %, and mutation testing runs nightly.
