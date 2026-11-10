import { expectNoA11yViolations, screen } from "@dertour/testing";
import { demoOffers } from "@dertour/api/mocks/demo";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test/render";
import { toOfferCard } from "../dto";
import { OfferCard } from "./OfferCard";

const offer = toOfferCard(demoOffers[0]!);
const plain = (value: string | null) => value?.replace(/\s+/g, " ").trim();

describe("OfferCard", () => {
    it("shows the offer and links to the detail", () => {
        renderApp(<OfferCard offer={offer} locale="de" />);
        const card = screen.getByRole("article", { name: "Hotel Playa Azul" });
        expect(card).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Hotel Playa Azul" })).toHaveAttribute(
            "href",
            "/offers/hotel-playa-azul-mallorca",
        );
        expect(screen.getByRole("img", { name: "4 Sterne" })).toBeInTheDocument();
        expect(screen.getByText("Halbpension")).toBeInTheDocument();
        expect(screen.getByText("Mallorca, Spain")).toBeInTheDocument();
    });

    it("formats price, period and nights for the locale", () => {
        renderApp(<OfferCard offer={offer} locale="de" />);
        expect(plain(screen.getByText(/^ab /).textContent)).toBe("ab 1.299 €");
        expect(screen.getByText(/7 Nächte/)).toHaveTextContent("01.–08.07.2027 · 7 Nächte");
    });

    it("has no a11y violations", async () => {
        renderApp(
            <ul>
                <li>
                    <OfferCard offer={offer} locale="de" />
                </li>
            </ul>,
        );
        await expectNoA11yViolations();
    });
});
