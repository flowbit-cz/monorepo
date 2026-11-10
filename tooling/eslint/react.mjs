import reactHooks from "eslint-plugin-react-hooks";
import { baseConfig } from "./base.mjs";

/**
 * Flat config for React libraries (ui, react, next, integrations, testing).
 * @param {{ ignores?: string[], rules?: import("eslint").Linter.RulesRecord }} [options]
 */
export function reactConfig({ ignores = [], rules = {} } = {}) {
    return [...baseConfig({ ignores }), reactHooks.configs.flat["recommended-latest"], { rules }];
}
