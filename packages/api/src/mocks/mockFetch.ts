import { getResponse } from "msw";
import { handlers } from "./handlers";

/**
 * `fetch` replacement for mock mode: answers from the MSW handlers in-process, without a network
 * or a patched global fetch (so it survives Next.js dev reloads and fetch instrumentation).
 */
export async function mockFetch(input: string, init?: RequestInit): Promise<Response> {
    const request = new Request(input, init);
    const response = await getResponse(handlers, request);
    if (response) return response;
    return Response.json(
        { title: "No mock handler", status: 501, detail: `${request.method} ${new URL(request.url).pathname}` },
        { status: 501 },
    );
}
