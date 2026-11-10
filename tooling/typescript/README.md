# @dertour/tsconfig

Shared TypeScript presets. Extend them, never copy them.

| Preset               | Use for                                                      |
| -------------------- | ------------------------------------------------------------ |
| `base.json`          | strict defaults shared by everything                         |
| `node.json`          | framework-free packages that run on the server (`server`)    |
| `react-library.json` | packages with JSX or DOM (`ui`, `react`, `next`, `testing`…) |
| `nextjs.json`        | Next.js apps in `apps/*`                                     |

```json
{ "extends": "@dertour/tsconfig/react-library.json", "include": ["src"] }
```
