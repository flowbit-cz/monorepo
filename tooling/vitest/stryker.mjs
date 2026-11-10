/**
 * Shared Stryker (mutation testing) config. Stryker changes the source code on purpose
 * (`>` → `>=`, `true` → `false`…) and checks that some test fails. A surviving mutant means the
 * tests run the code but don't really check it. This is a typical gap in AI-written tests.
 *
 * Runs nightly in CI (`pnpm test:mutation`), it's too slow for every PR.
 * @type {import("@stryker-mutator/api/core").PartialStrykerOptions}
 */
const config = {
    testRunner: "vitest",
    plugins: ["@stryker-mutator/vitest-runner"],
    mutate: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.{test,stories}.{ts,tsx}",
        "!src/**/index.ts",
        "!src/**/index.client.ts",
        "!src/generated/**",
        "!src/test/**",
    ],
    coverageAnalysis: "perTest",
    reporters: ["clear-text", "progress", "html", "json"],
    htmlReporter: { fileName: "reports/mutation/index.html" },
    jsonReporter: { fileName: "reports/mutation/mutation.json" },
    thresholds: { high: 80, low: 60, break: 50 },
    tempDirName: ".stryker-tmp",
    cleanTempDir: "always",
};

export default config;
