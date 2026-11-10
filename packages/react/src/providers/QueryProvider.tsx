"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/** Defaults for the whole app: 60 s fresh data, no refetch on window focus. */
export function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
        },
    });
}

let browserClient: QueryClient | undefined;

/**
 * One client per request on the server (no data leaks between users) and one per tab in the browser
 * (survives Suspense re-mounts). This is the pattern recommended by TanStack Query for the App Router.
 */
export function getQueryClient(): QueryClient {
    if (isServer) return makeQueryClient();
    browserClient ??= makeQueryClient();
    return browserClient;
}

/** Provides TanStack Query to client components. Put it in the root layout. */
export function QueryProvider({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
