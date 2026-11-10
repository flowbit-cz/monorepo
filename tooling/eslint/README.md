# @dertour/eslint-config

ESLint 9 flat configs.

| Export                              | For                                                    |
| ----------------------------------- | ------------------------------------------------------ |
| `@dertour/eslint-config/base`       | framework-free TS packages: `baseConfig()`             |
| `@dertour/eslint-config/react`      | React packages: `reactConfig()`                        |
| `@dertour/eslint-config/nextjs`     | Next.js apps: `nextConfig()` (includes app boundaries) |
| `@dertour/eslint-config/boundaries` | `layerRules("<layer>")` for packages                   |

## Architecture rules

- **Package layers.** `layerRules()` keeps the dependency graph pointing one way. For example, `core` can't
  import React, and `ui` can't import `@dertour/api`. The layer diagram is in `boundaries.mjs`.
- **App rules.** `src/app` only routes (no `@dertour/api`, zustand or react-query there). Modules are imported
  only through `@/modules/<name>` or `@/modules/<name>/index.client`, never through their internal files.

```js
// packages/core/eslint.config.mjs
import { baseConfig } from "@dertour/eslint-config/base";
import { layerRules } from "@dertour/eslint-config/boundaries";
export default [...baseConfig(), { rules: layerRules("core") }];
```
