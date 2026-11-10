import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import { IGNORES, sharedRules, testOverrides } from "./base.mjs";
import { appBoundaries } from "./boundaries.mjs";

/**
 * Flat config for Next.js apps: Next.js core-web-vitals + TypeScript rules,
 * shared monorepo rules and the app architecture rules (see boundaries.mjs).
 * @param {{ ignores?: string[], rules?: import("eslint").Linter.RulesRecord }} [options]
 */
export function nextConfig({ ignores = [], rules = {} } = {}) {
    return [
        { ignores: [...IGNORES, ...ignores] },
        ...coreWebVitals,
        ...typescript,
        { rules: { ...sharedRules, ...rules } },
        ...appBoundaries,
        testOverrides,
    ];
}
