/** Runtime settings of the generated clients. Apps set them once at startup (`configureApi`). */
export interface ApiConfig {
    /** Backend base URL (`https://api.dertour.example`). */
    baseUrl: string;
    /** Headers sent with every request (API keys, locale, tracing…). */
    headers?: () => HeadersInit | Promise<HeadersInit>;
    /** Request timeout in ms. */
    timeoutMs: number;
}

/**
 * Defaults come from env: `API_BASE_URL` on the server and `NEXT_PUBLIC_API_BASE_URL` in the browser.
 * `process.env.NEXT_PUBLIC_*` must stay a literal, so Next.js can inline it.
 */
function defaultBaseUrl(): string {
    if (typeof window === "undefined") return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

let config: ApiConfig | undefined;

/** Overrides client settings (call it in instrumentation.ts or a provider). */
export function configureApi(overrides: Partial<ApiConfig>): void {
    config = { ...getApiConfig(), ...overrides };
}

/** Current client settings. */
export function getApiConfig(): ApiConfig {
    return config ?? { baseUrl: defaultBaseUrl(), timeoutMs: 10_000 };
}

/** Resets settings to the env defaults (tests only). */
export function resetApiConfig(): void {
    config = undefined;
}
