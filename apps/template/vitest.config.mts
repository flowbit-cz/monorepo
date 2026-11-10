import { defineConfig } from "vitest/config";
import { vitestPreset } from "@dertour/vitest-config";

export default defineConfig(
    vitestPreset({
        root: import.meta.dirname,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        // Routing files (src/app) only render modules. E2E covers them, so the gate counts modules and lib.
        coverageInclude: [
            "src/modules/**/*.{ts,tsx}",
            "src/lib/**/*.ts",
            "src/i18n/**/*.ts",
            "src/components/**/*.tsx",
        ],
        thresholds: { lines: 70, functions: 70, branches: 60, statements: 70 },
    }),
);
