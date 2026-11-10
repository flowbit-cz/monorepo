import { existsSync } from "node:fs";
import { defineConfig, type Options } from "orval";

// Orval doesn't load .env by itself.
if (existsSync(".env")) process.loadEnvFile(".env");

/**
 * Backend services. Each one has an env variable with its OpenAPI URL and a demo spec, which is used
 * when the variable is missing, so the template (and CI without backend access) still works.
 */
const SERVICES = {
    offers: { env: "OPENAPI_OFFERS_URL", example: "./example/offers.openapi.yaml" },
} as const;

/** Spec location of a service: the backend URL from env, or the bundled demo spec. */
function specFor(service: keyof typeof SERVICES): string {
    const { env, example } = SERVICES[service];
    const url = process.env[env];
    if (url) return url;
    console.warn(`[orval] ${env} is not set. Using the demo spec ${example}.`);
    return example;
}

const mutator = { path: "./src/mutator/customFetch.ts", name: "customFetch" };

/**
 * Every service is generated four times:
 * - endpoints/ plain fetch functions + MSW mocks: server components, route handlers, server actions
 * - query/     TanStack Query hooks: client components
 * - zod/       zod schemas of params and responses: validation, forms, tests
 * - model/     TypeScript types (shared by all of the above)
 */
function service(name: keyof typeof SERVICES): Record<string, Options> {
    const target = specFor(name);
    const base = `./src/generated/${name}`;
    return {
        [`${name}-endpoints`]: {
            input: { target },
            output: {
                mode: "tags-split",
                target: `${base}/endpoints`,
                schemas: `${base}/model`,
                client: "fetch",
                indexFiles: true,
                clean: true,
                mock: { generators: [{ type: "msw", delay: false, useExamples: true }, { type: "faker" }] },
                override: { mutator, fetch: { includeHttpResponseReturnType: false } },
            },
        },
        [`${name}-query`]: {
            input: { target },
            output: {
                mode: "tags-split",
                target: `${base}/query`,
                schemas: `${base}/model`,
                client: "react-query",
                httpClient: "fetch",
                indexFiles: true,
                clean: true,
                override: {
                    mutator,
                    fetch: { includeHttpResponseReturnType: false },
                    query: { useQuery: true, useSuspenseQuery: true },
                },
            },
        },
        [`${name}-zod`]: {
            input: { target },
            output: {
                mode: "tags-split",
                target: `${base}/zod`,
                client: "zod",
                fileExtension: ".zod.ts",
                indexFiles: true,
                clean: true,
            },
        },
    };
}

export default defineConfig({
    ...service("offers"),
});
