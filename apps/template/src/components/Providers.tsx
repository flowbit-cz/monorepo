"use client";

import { configureApi } from "@dertour/api";
import { QueryProvider } from "@dertour/react";
import type { ReactNode } from "react";

/**
 * Client-side providers. The browser API base URL is passed from the server layout,
 * so mock mode (`/api/mock`) is decided by the server env, not baked into the bundle.
 */
export function Providers({ apiBaseUrl, children }: { apiBaseUrl: string; children: ReactNode }) {
    configureApi({ baseUrl: apiBaseUrl });
    return <QueryProvider>{children}</QueryProvider>;
}
