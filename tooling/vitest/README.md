# @dertour/vitest-config

```ts
// vitest.config.mts
import { defineConfig } from "vitest/config";
import { vitestPreset } from "@dertour/vitest-config";

export default defineConfig(vitestPreset({ root: import.meta.dirname, environment: "jsdom" }));
```

- Tests live next to the file they test (`utils.ts` → `utils.test.ts`).
- `pnpm test:coverage` enforces the coverage gate (default 80 % lines). Apps lower it via `thresholds`.
- Components need jsdom: set `environment: "jsdom"` or put `// @vitest-environment jsdom` at the top of the file.
