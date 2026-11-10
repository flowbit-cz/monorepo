# Module `home`

The homepage: a static hero (CTA to `/offers`) and recommended offers from the `offers` module, streamed in a
`Suspense` boundary, so the page shell renders right away even when the backend is slow.

Depends on `@/modules/offers` (public API only: `getFeaturedOffers`, `OfferGrid`, `siteSeo`).
