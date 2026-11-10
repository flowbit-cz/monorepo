# Module `offers`

Search and detail of package holiday offers. It's the reference module of the template: copy its structure
when you add a new domain module.

## Business logic

- **Listing** `/offers`: the URL query is the search state (`destination`, `dateFrom`, `dateTo`, `adults`, `board`,
  `sort`, `page`). `parseOfferSearch` turns invalid values into defaults, so old or hand-typed links never crash.
  Defaults are left out of the URL (`toOfferSearchQuery`), and filtered or paginated pages are `noindex`.
- **Detail** `/offers/[slug]`: unknown slug → backend 404 → `notFound()` → `OfferNotFound`. Metadata and
  JSON-LD (`Hotel` + `Offer`) are built from the real offer.
- **Favourites**: zustand store persisted in localStorage (`dertour-favorites`), hydrated after mount.
- **Destinations** in the filter load client-side through the generated TanStack Query hook (`queries.ts`).

## Data flow

```
backend (OpenAPI) → @dertour/api (Orval) → api.ts (server, cache 5 min) → dto.ts → components
                                         → queries.ts (client, React Query)
```

## Files

| File                   | What                                             | Tests                       |
| ---------------------- | ------------------------------------------------ | --------------------------- |
| `api.ts`               | server calls (`searchOffers`, `getOfferDetail`…) | `api.test.ts` (MSW)         |
| `queries.ts`           | client hooks                                     | via `OfferFilter.test.tsx`  |
| `dto.ts`               | backend → UI models                              | `dto.test.ts` (+ contract)  |
| `utils.ts`             | URL ⇄ search, params                             | `utils.test.ts`             |
| `metadata.ts`          | SEO metadata, JSON-LD                            | `metadata.test.ts`          |
| `offers.store.ts`      | favourites                                       | `offers.store.test.ts`      |
| `components/*.form.ts` | zod schema of the filter form                    | `*.form.test.ts`            |
| `components/*.tsx`     | UI                                               | `*.test.tsx`, E2E           |
| `i18n/{de,en,cs}.json` | texts (`offers.*` namespace)                     | `src/i18n/messages.test.ts` |

## Dependencies

`@dertour/api/offers*` (backend), `@dertour/ui`, `@dertour/i18n` (formatting), `@dertour/next` (metadata, JSON-LD).
