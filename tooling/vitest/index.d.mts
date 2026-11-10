export interface VitestPresetOptions {
    root: string;
    environment?: "node" | "jsdom";
    setupFiles?: string[];
    coverageInclude?: string[];
    coverageExclude?: string[];
    thresholds?: Partial<{ lines: number; functions: number; branches: number; statements: number }> | false;
}

/** Plain config object for `defineConfig` (typed loosely, so different vite type copies in packages never clash). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function vitestPreset(options: VitestPresetOptions): any;
