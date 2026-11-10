/**
 * Architecture rules enforced by ESLint.
 *
 * Packages form layers. A package may import only from layers below it, so
 * framework-free code (core, i18n, api) stays usable from Vue, React Native or Node:
 *
 *   core → i18n | tokens → api → react → ui | testing → next | integrations → server
 *
 *   core          no React, no Next, no other @dertour package
 *   i18n, tokens  core only
 *   api           core
 *   react         core, i18n, api        (+ react)
 *   ui            core, i18n, tokens, react
 *   next          everything above       (+ next)
 *   server        core                   (+ next/server)
 */

/** Which @dertour packages and frameworks each package must NOT import. */
const FORBIDDEN = {
    core: ["@dertour/*", "react", "react-dom", "next", "next/*"],
    i18n: ["@dertour/!(core)", "react", "react-dom", "next", "next/*"],
    tokens: ["@dertour/*", "react", "next", "next/*"],
    api: ["@dertour/!(core)", "next", "next/*"],
    react: ["@dertour/ui", "@dertour/next", "@dertour/server", "@dertour/integrations", "next", "next/*"],
    ui: [
        "@dertour/api",
        "@dertour/api/*",
        "@dertour/next",
        "@dertour/server",
        "@dertour/integrations",
        "next",
        "next/*",
    ],
    server: ["@dertour/!(core)", "react", "react-dom"],
};

/**
 * no-restricted-imports rule for one package layer.
 * @param {keyof typeof FORBIDDEN} layer
 */
export function layerRules(layer) {
    const patterns = FORBIDDEN[layer];
    if (!patterns) throw new Error(`Unknown layer "${layer}"`);
    return {
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: patterns,
                        message: `@dertour/${layer} must not depend on this (see tooling/eslint/boundaries.mjs).`,
                    },
                ],
            },
        ],
    };
}

/** Rules for code inside an app (src/app, src/modules, src/components). */
export const appBoundaries = [
    {
        // Modules are imported only through their public index (or index.client).
        files: ["src/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@/modules/*/*", "!@/modules/*/index.client", "!@/modules/*/i18n"],
                            message:
                                "Import a module through its public API: @/modules/<name> or @/modules/<name>/index.client (src/i18n/messages.ts may import @/modules/<name>/i18n/*.json).",
                        },
                    ],
                },
            ],
        },
    },
    {
        // src/app only does routing: no API calls, no stores, it renders modules.
        files: ["src/app/**/*.{ts,tsx}"],
        ignores: ["src/app/api/**"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@/modules/*/*", "!@/modules/*/index.client", "!@/modules/*/i18n"],
                            message:
                                "Import a module through its public API: @/modules/<name> or @/modules/<name>/index.client (src/i18n/messages.ts may import @/modules/<name>/i18n/*.json).",
                        },
                        {
                            group: ["@dertour/api", "@dertour/api/*", "zustand", "@tanstack/react-query"],
                            message: "src/app only routes. Fetch data and keep state inside a module.",
                        },
                    ],
                },
            ],
        },
    },
];
