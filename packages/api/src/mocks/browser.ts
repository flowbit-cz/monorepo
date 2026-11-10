import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** MSW worker for the browser (dev / E2E with NEXT_PUBLIC_API_MOCKING=enabled). */
export const mockWorker = setupWorker(...handlers);
