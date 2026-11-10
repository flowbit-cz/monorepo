import { expectNoA11yViolations, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { appData } from "@/config/appData";
import { getMessages } from "@/i18n/messages";
import { renderApp } from "@/test/render";
import { Hero } from "./Hero";

describe("Hero", () => {
    it.each(appData.locales)("shows the title and links to offers (%s)", async (locale) => {
        const { hero } = getMessages(locale).home;
        renderApp(
            <main>
                <Hero />
            </main>,
            locale,
        );
        expect(screen.getByRole("heading", { level: 1, name: hero.title })).toBeInTheDocument();
        // The default locale has no URL prefix, the others do.
        const href = locale === appData.defaultLocale ? "/offers" : `/${locale}/offers`;
        expect(screen.getByRole("link", { name: hero.cta })).toHaveAttribute("href", href);
        await expectNoA11yViolations();
    });
});
