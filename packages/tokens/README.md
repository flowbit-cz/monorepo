# @dertour/tokens

Single source of design tokens: `src/tokens.json`.

- `pnpm generate` (Turbo runs it before dev/build/test) → `src/generated/theme.css` with a Tailwind v4 `@theme` block.
  Every token becomes a utility class (`bg-brand`, `text-text-muted`, `rounded-lg`, `shadow-card`) and a CSS
  variable (`var(--color-brand)`).
- `import { designTokens } from "@dertour/tokens"` gives the same values as a typed object, for React Native and
  other code that can't use CSS.

> ⚠️ The values are **placeholders**. Replace them with the official DERTOUR design system tokens.

```css
/* apps/<app>/src/styles/global.css */
@import "tailwindcss";
@import "@dertour/tokens/theme.css";
```
