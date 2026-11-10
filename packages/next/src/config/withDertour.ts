import type { NextConfig } from "next";
import { securityHeaders, type SecurityHeadersOptions } from "./securityHeaders";

/** Options of {@link withDertour}. */
export interface WithDertourOptions {
    /** Monorepo root (`path.join(import.meta.dirname, "../..")`). Needed for standalone output tracing. */
    monorepoRoot: string;
    /** Hosts allowed for next/image (CMS, CDN). */
    imageHosts?: string[];
    security?: SecurityHeadersOptions;
}

/**
 * Shared Next.js config of all DERTOUR apps:
 * standalone output (Docker), transpiled workspace packages, security headers, image hosts,
 * no `X-Powered-By`, typed routes.
 */
export function withDertour(
    config: NextConfig,
    { monorepoRoot, imageHosts = [], security }: WithDertourOptions,
): NextConfig {
    return {
        output: "standalone",
        outputFileTracingRoot: monorepoRoot,
        poweredByHeader: false,
        reactStrictMode: true,
        typedRoutes: true,
        transpilePackages: ["@dertour/*", ...(config.transpilePackages ?? [])].filter((name) => name !== "@dertour/*"),
        ...config,
        images: {
            ...config.images,
            remotePatterns: [
                ...(config.images?.remotePatterns ?? []),
                ...imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
            ],
        },
        async headers() {
            return [...securityHeaders(security), ...((await config.headers?.()) ?? [])];
        },
    };
}
