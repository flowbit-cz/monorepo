import { handlers } from "@dertour/api/mocks";
import { getResponse } from "msw";

/**
 * Answers a browser API call from the MSW handlers (the same ones tests and the server use).
 * Client components call `/api/mock/<path>` in mock mode, so no Service Worker is needed.
 */
export async function handleMockRequest(request: Request, enabled: boolean): Promise<Response> {
    if (!enabled) return Response.json({ message: "Not found." }, { status: 404 });
    const response = await getResponse(handlers, request);
    return response ?? Response.json({ message: `No mock for ${new URL(request.url).pathname}.` }, { status: 404 });
}
