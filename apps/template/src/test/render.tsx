import { renderWithProviders, type ProviderOptions } from "@dertour/testing";
import type { ReactElement } from "react";
import type { AppLocale } from "@/config/appData";
import { getMessages } from "@/i18n/messages";

/** Renders with the real app messages of a locale (German by default), so tests use real texts. */
export function renderApp(
    ui: ReactElement,
    locale: AppLocale = "de",
    options: Omit<ProviderOptions, "messages" | "locale"> = {},
) {
    return renderWithProviders(ui, { ...options, locale, messages: getMessages(locale) });
}
