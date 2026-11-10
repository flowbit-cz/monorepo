import { describe, expect, it } from "vitest";
import { securityHeaders } from "./securityHeaders";
import { withDertour } from "./withDertour";

const keys = (rules: ReturnType<typeof securityHeaders>) => rules[0]!.headers.map((h) => h.key);

describe("securityHeaders", () => {
    it("includes the safe defaults", () => {
        expect(keys(securityHeaders())).toEqual([
            "X-Content-Type-Options",
            "X-Frame-Options",
            "Referrer-Policy",
            "Permissions-Policy",
            "Content-Security-Policy",
            "Strict-Transport-Security",
        ]);
    });

    it("can drop CSP and HSTS", () => {
        expect(keys(securityHeaders({ csp: false, hsts: false }))).not.toContain("Strict-Transport-Security");
        expect(keys(securityHeaders({ csp: false, hsts: false }))).not.toContain("Content-Security-Policy");
    });
});

describe("withDertour", () => {
    it("sets standalone output, tracing root, image hosts and merges headers", async () => {
        const config = withDertour(
            {
                images: { remotePatterns: [{ hostname: "cdn.test" }] },
                headers: async () => [{ source: "/x", headers: [] }],
            },
            { monorepoRoot: "/repo", imageHosts: ["images.ctfassets.net"] },
        );
        expect(config).toMatchObject({ output: "standalone", outputFileTracingRoot: "/repo", poweredByHeader: false });
        expect(config.images?.remotePatterns).toEqual([
            { hostname: "cdn.test" },
            { protocol: "https", hostname: "images.ctfassets.net" },
        ]);
        const headers = await config.headers!();
        expect(headers.map((h) => h.source)).toEqual(["/:path*", "/x"]);
    });

    it("keeps app-specific transpiled packages", () => {
        expect(withDertour({ transpilePackages: ["some-esm-lib"] }, { monorepoRoot: "/" }).transpilePackages).toEqual([
            "some-esm-lib",
        ]);
    });
});
