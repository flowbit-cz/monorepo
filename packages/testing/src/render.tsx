import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages, type Locale } from "next-intl";
import type { ReactElement, ReactNode } from "react";

/** Options of {@link renderWithProviders}. */
export interface ProviderOptions extends Omit<RenderOptions, "wrapper"> {
    /** Messages of the app (pass the merged app messages so components see real texts). */
    messages?: AbstractIntlMessages;
    locale?: Locale;
    /** Custom query client. A fresh one without retries is created by default. */
    queryClient?: QueryClient;
}

/** Query client for tests: no retries, no caching between tests, errors aren't logged. */
export function createTestQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
            mutations: { retry: false },
        },
    });
}

/**
 * Renders a component with the providers it needs in the app (next-intl, TanStack Query)
 * and returns a `user` from user-event, so tests interact like a real user.
 */
export function renderWithProviders(
    ui: ReactElement,
    { messages = {}, locale = "de" as Locale, queryClient = createTestQueryClient(), ...options }: ProviderOptions = {},
) {
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Berlin">
                    {children}
                </NextIntlClientProvider>
            </QueryClientProvider>
        );
    }
    return { user: userEvent.setup(), queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
