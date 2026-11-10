/** Options of {@link securityHeaders}. */
export interface SecurityHeadersOptions {
    /** Content-Security-Policy. The default only blocks framing. Tune a full CSP per app. */
    csp?: string | false;
    permissionsPolicy?: string;
    hsts?: boolean;
    source?: string;
}

/**
 * Safe default security headers for every app (`headers()` in next.config).
 * A strict script/style CSP depends on the app's third parties (GTM, Usercentrics, Datadog),
 * so it's passed in per app once tested.
 */
export function securityHeaders({
    csp = "frame-ancestors 'self'",
    permissionsPolicy = "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    hsts = true,
    source = "/:path*",
}: SecurityHeadersOptions = {}) {
    const headers = [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: permissionsPolicy },
    ];
    if (csp) headers.push({ key: "Content-Security-Policy", value: csp });
    if (hsts) headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" });
    return [{ source, headers }];
}
