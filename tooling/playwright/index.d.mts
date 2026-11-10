import type { PlaywrightTestConfig } from "@playwright/test";

export function playwrightPreset(options?: {
    port?: number;
    env?: Record<string, string>;
    locale?: string;
}): PlaywrightTestConfig;
