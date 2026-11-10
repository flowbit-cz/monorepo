import { createEnv } from "@dertour/core/env";
import { z } from "zod";

/** Optional string: empty values from .env count as "not set". */
const optional = () =>
    z
        .string()
        .optional()
        .transform((value) => value || undefined);

/**
 * Validated environment. The app refuses to start with a missing or invalid variable.
 * `SKIP_ENV_VALIDATION=1` skips the check (Docker build stages without runtime secrets).
 */
export const env = createEnv({
    server: {
        API_BASE_URL: z.url(),
        API_MOCKING: z.enum(["enabled", "disabled"]).default("disabled"),
        LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
    },
    client: {
        NEXT_PUBLIC_SITE_URL: z.url(),
        NEXT_PUBLIC_API_BASE_URL: z.url(),
        NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: optional(),
        NEXT_PUBLIC_GTM_ID: optional(),
        NEXT_PUBLIC_DATADOG_APPLICATION_ID: optional(),
        NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: optional(),
        NEXT_PUBLIC_DATADOG_ENV: z.string().default("local"),
    },
    runtimeEnv: {
        API_BASE_URL: process.env.API_BASE_URL,
        API_MOCKING: process.env.API_MOCKING,
        LOG_LEVEL: process.env.LOG_LEVEL,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID: process.env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID,
        NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
        NEXT_PUBLIC_DATADOG_APPLICATION_ID: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
        NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        NEXT_PUBLIC_DATADOG_ENV: process.env.NEXT_PUBLIC_DATADOG_ENV,
    },
    skipValidation: process.env.SKIP_ENV_VALIDATION === "1",
});

/** Base URL for API calls from the browser. In mock mode it's the app's own mock route. */
export function browserApiBaseUrl(): string {
    return env.API_MOCKING === "enabled" ? "/api/mock" : env.NEXT_PUBLIC_API_BASE_URL;
}
