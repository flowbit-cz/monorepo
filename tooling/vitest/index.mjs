import path from "node:path";
import react from "@vitejs/plugin-react";

/** Default coverage gate. Packages hold shared logic, so their bar is higher than apps'. */
const DEFAULT_THRESHOLDS = { lines: 80, functions: 80, branches: 75, statements: 80 };

/**
 * Shared Vitest config. It returns a plain object, and the caller wraps it in `defineConfig`.
 *
 * - tests live next to the file they test: `src/**\/*.test.{ts,tsx}`
 * - `@/` → `src/` (same as tsconfig paths in apps)
 * - `server-only` / `client-only` are no-ops in tests
 * - coverage (v8) with a threshold gate. AI-written tests must keep it green.
 *
 * @param {object} options
 * @param {string} options.root package directory (`import.meta.dirname`)
 * @param {"node" | "jsdom"} [options.environment] default environment, override per file with `// @vitest-environment jsdom`
 * @param {string[]} [options.setupFiles] extra setup files
 * @param {string[]} [options.coverageInclude] files counted in coverage
 * @param {string[]} [options.coverageExclude] files excluded from coverage
 * @param {Partial<typeof DEFAULT_THRESHOLDS> | false} [options.thresholds] coverage gate, `false` disables it
 */
export function vitestPreset({
    root,
    environment = "node",
    setupFiles = [],
    coverageInclude = ["src/**/*.{ts,tsx}"],
    coverageExclude = [],
    thresholds = {},
}) {
    return {
        plugins: [react()],
        resolve: {
            alias: [
                { find: /^@\/(.*)$/, replacement: path.join(root, "src/$1") },
                { find: /^(server|client)-only$/, replacement: path.join(import.meta.dirname, "empty.mjs") },
            ],
        },
        test: {
            root,
            environment,
            globals: true,
            include: ["src/**/*.test.{ts,tsx}"],
            exclude: ["**/node_modules/**", "e2e/**", ".next/**"],
            setupFiles: [path.join(import.meta.dirname, "setup.mjs"), ...setupFiles],
            // Packages that import "next/navigation" without an extension must go through Vite.
            server: { deps: { inline: [/next-intl/, /@dertour\//] } },
            // Node 25+ has a built-in global `localStorage` (undefined without --localstorage-file) that hides
            // jsdom's. Switch it off so tests behave the same on every Node version (22 LTS … 26).
            execArgv: ["--no-experimental-webstorage"],
            restoreMocks: true,
            unstubEnvs: true,
            coverage: {
                provider: "v8",
                reporter: ["text-summary", "json-summary", "html", "lcov"],
                include: coverageInclude,
                exclude: [
                    "**/*.test.{ts,tsx}",
                    "**/*.stories.tsx",
                    "**/*.d.ts",
                    "**/index.ts",
                    "**/index.client.ts",
                    "**/src/generated/**",
                    "**/test/**",
                    ...coverageExclude,
                ],
                thresholds: thresholds === false ? undefined : { ...DEFAULT_THRESHOLDS, ...thresholds },
            },
        },
    };
}
