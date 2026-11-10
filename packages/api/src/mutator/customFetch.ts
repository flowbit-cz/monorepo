import { ApiError, type ProblemDetails } from "./ApiError";
import { getApiConfig } from "./config";

/** Joins the base URL and a generated path without doubling or losing slashes. */
export function joinUrl(baseUrl: string, path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

/** Reads the error body. It falls back to the status text when the backend didn't send JSON. */
async function readProblem(response: Response): Promise<ProblemDetails> {
    const fallback: ProblemDetails = { title: response.statusText || "Request failed", status: response.status };
    try {
        const body = (await response.json()) as Partial<ProblemDetails>;
        return { ...fallback, ...body, status: response.status };
    } catch {
        return fallback;
    }
}

/** `true` on the server when API_MOCKING=enabled: backend calls are answered by the MSW handlers. */
export function isServerMocking(): boolean {
    return typeof window === "undefined" && process.env.API_MOCKING === "enabled";
}

/** Real fetch, or the in-process mock in mock mode (loaded lazily, so production never loads MSW). */
async function send(url: string, init: RequestInit): Promise<Response> {
    if (!isServerMocking()) return fetch(url, init);
    const { mockFetch } = await import("../mocks/mockFetch");
    return mockFetch(url, init);
}

/**
 * The fetch every Orval-generated client uses.
 *
 * - prefixes the generated path with the configured base URL
 * - adds JSON + configured headers
 * - aborts after `timeoutMs` (unless the caller passes its own `signal`)
 * - returns parsed JSON. 204 returns `undefined`.
 * - throws {@link ApiError} for non-2xx answers
 * - `API_MOCKING=enabled` (server): answered by the MSW handlers, no backend needed
 *
 * Next.js-specific options (`next: { revalidate, tags }`, `cache`) pass through untouched.
 */
export async function customFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const { baseUrl, headers: configHeaders, timeoutMs } = getApiConfig();
    const fullUrl = joinUrl(baseUrl, url);

    const headers = new Headers(configHeaders ? await configHeaders() : undefined);
    headers.set("Accept", "application/json");
    new Headers(options.headers).forEach((value, key) => headers.set(key, value));
    if (options.body !== undefined && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    const response = await send(fullUrl, {
        ...options,
        headers,
        signal: options.signal ?? AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) throw new ApiError(response.status, await readProblem(response), fullUrl);
    if (response.status === 204) return undefined as T;

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

export default customFetch;
