import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** MSW server for Node: Vitest and the Next.js server when API_MOCKING=enabled. */
export const mockServer = setupServer(...handlers);
