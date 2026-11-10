// Public API of the offers module (server side). Import only from here, never from internal files.
export { getFeaturedOffers, getOfferDetail, searchOffers } from "./api";
export { OfferDetailPage } from "./components/OfferDetailPage";
export { OfferGrid } from "./components/OfferGrid";
export { OfferListPage } from "./components/OfferListPage";
export { OfferNotFound } from "./components/OfferNotFound";
export { offerDetailMetadata, offerListMetadata, siteSeo } from "./metadata";
export type { OfferCardModel, OfferDetailModel } from "./types/offer";
export type { OfferSearch } from "./types/search";
export { offerPath, parseOfferSearch } from "./utils";
