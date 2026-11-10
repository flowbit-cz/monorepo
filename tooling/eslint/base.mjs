import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Paths ESLint never checks: build output, reports and generated code. */
export const IGNORES = [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/coverage/**",
    "**/storybook-static/**",
    "**/playwright-report/**",
    "**/test-results/**",
    "**/reports/**",
    "**/.stryker-tmp/**",
    "**/src/generated/**",
    "**/next-env.d.ts",
    "**/public/mockServiceWorker.js",
];

/** Rules shared by every package and app. */
export const sharedRules = {
    // Server code logs through @dertour/server's logger, never console.log.
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
    eqeqeq: ["error", "smart"],
};

/** Relaxed rules for tests, stories and config files. */
export const testOverrides = {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.ts", "**/*.stories.tsx", "**/test/**", "e2e/**", "*.config.{ts,mts,mjs}"],
    rules: { "no-console": "off", "@typescript-eslint/no-non-null-assertion": "off" },
};

/**
 * Base flat config for framework-free TypeScript packages.
 * @param {{ ignores?: string[], rules?: import("eslint").Linter.RulesRecord }} [options]
 */
export function baseConfig({ ignores = [], rules = {} } = {}) {
    return tseslint.config(
        { ignores: [...IGNORES, ...ignores] },
        js.configs.recommended,
        ...tseslint.configs.recommended,
        {
            languageOptions: { globals: { ...globals.browser, ...globals.node } },
            rules: { ...sharedRules, ...rules },
        },
        testOverrides,
    );
}
