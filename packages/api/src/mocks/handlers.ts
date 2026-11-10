import { faker } from "@faker-js/faker";
import { getDestinationsMock } from "../generated/offers/endpoints/destinations/destinations.msw";
import { getOffersMock } from "../generated/offers/endpoints/offers/offers.msw";
import { demoHandlers } from "./demo/handlers";

// Fixed seed: generated mock data is the same on every run, so tests stay deterministic.
faker.seed(2027);

/**
 * MSW handlers of all services.
 *
 * - `demoHandlers` (first, so they win): realistic hand-written data for dev, E2E and screenshots
 * - generated handlers (Orval + faker): every endpoint of the spec, also the ones without demo data
 *
 * Override one endpoint in a test: `mockServer.use(getGetOfferMockHandler({ ...offer }))`.
 */
export const handlers = [...demoHandlers, ...getOffersMock(), ...getDestinationsMock()];

export * from "../generated/offers/endpoints/destinations/destinations.msw";
export * from "../generated/offers/endpoints/offers/offers.msw";
