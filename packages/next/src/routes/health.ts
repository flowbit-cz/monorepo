/** Options of {@link createHealthRoute}. */
export interface HealthOptions {
    service: string;
    version?: string;
    /** Extra readiness checks (e.g. backend reachable). Each one returns `true` when healthy. */
    checks?: Record<string, () => Promise<boolean>>;
}

/**
 * `GET /api/health` for load balancers and Kubernetes probes. It returns 200 when every check passes,
 * otherwise 503. A failing or throwing check never leaks the error message.
 */
export function createHealthRoute({ service, version = process.env.APP_VERSION ?? "dev", checks = {} }: HealthOptions) {
    return async function GET(): Promise<Response> {
        const results = Object.fromEntries(
            await Promise.all(
                Object.entries(checks).map(async ([name, check]) => [name, await check().catch(() => false)] as const),
            ),
        );
        const healthy = Object.values(results).every(Boolean);
        return Response.json(
            { status: healthy ? "ok" : "degraded", service, version, checks: results },
            { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
        );
    };
}
