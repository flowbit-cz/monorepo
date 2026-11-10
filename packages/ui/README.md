# @dertour/ui

DERTOUR design system: small, accessible React components styled with Tailwind v4 classes built on
`@dertour/tokens`.

```bash
pnpm storybook        # http://localhost:6006
```

| Component                                     | Notes                                                            |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `Button`, `buttonVariants`                    | variants `primary/accent/secondary/ghost/danger`, `loading`      |
| `Input`, `Select`, `Field`                    | label + hint + error wired with `aria-describedby`, RHF-friendly |
| `Card`, `CardMedia`, `CardBody`, `CardFooter` | offer tiles                                                      |
| `Badge`, `Rating`, `Spinner`                  | small helpers                                                    |
| `cn()`                                        | `clsx` + `tailwind-merge`                                        |

Rules:

- Components are presentational: no data fetching, no translations, no Next.js. Texts come in via props.
- Every component has `X.tsx`, `X.test.tsx` (behaviour + axe), `X.stories.tsx` and `index.ts`.
- Styles use tokens only (`bg-brand`, `text-text-muted`). No hard-coded colors.

Apps pull the styles in through their global CSS:

```css
@import "tailwindcss";
@import "@dertour/tokens/theme.css";
@import "@dertour/ui/styles.css";
```
