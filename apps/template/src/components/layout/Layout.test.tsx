import { expectNoA11yViolations, screen } from "@dertour/testing";
import { LOCALES } from "@dertour/i18n";
import { describe, expect, it, vi } from "vitest";
import { appData } from "@/config/appData";
import { renderApp } from "@/test/render";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useParams: () => ({}) }));
vi.mock("@/i18n/navigation", async () => {
    const { default: Anchor } = await import("@/test/Anchor");
    return { Link: Anchor, usePathname: () => "/offers", useRouter: () => ({ replace }) };
});

describe("layout", () => {
    it("renders header navigation, skip link and footer accessibly", async () => {
        renderApp(
            <>
                <SkipLink />
                <Header />
                <main id="main" />
                <Footer />
            </>,
        );
        expect(screen.getByRole("link", { name: "Zum Inhalt springen" })).toHaveAttribute("href", "#main");
        expect(screen.getByRole("navigation", { name: "Hauptnavigation" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
            "href",
            expect.stringContaining("datenschutz"),
        );
        await expectNoA11yViolations();
    });

    it("switches the language on the same page", async () => {
        const { user } = renderApp(<Header />);
        const target = appData.locales.at(-1)!;
        await user.selectOptions(screen.getByLabelText("Sprache"), LOCALES[target].label);
        expect(replace).toHaveBeenCalledWith({ pathname: "/offers", params: {} }, { locale: target });
    });
});
