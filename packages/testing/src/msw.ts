import type { RequestHandler } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

/**
 * Starts an MSW server for the current test file and resets overrides after every test.
 * Unhandled requests fail the test, so a component can't silently hit a real backend.
 *
 * ```ts
 * import { handlers } from "@dertour/api/mocks";
 * const server = setupMswServer(handlers);
 * server.use(getGetOfferMockHandler(customOffer)); // per-test override
 * ```
 */
export function setupMswServer(handlers: RequestHandler[] = []): ReturnType<typeof setupServer> {
    const server = setupServer(...handlers);
    beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    return server;
}
