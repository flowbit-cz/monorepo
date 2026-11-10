import { expectNoA11yViolations, renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { Card, CardBody, CardFooter, CardMedia } from "./Card";

describe("Card", () => {
    it("renders an article with its parts", async () => {
        renderWithProviders(
            <Card aria-labelledby="t" className="max-w-sm">
                <CardMedia>
                    <img src="/x.jpg" alt="Pool" />
                </CardMedia>
                <CardBody>
                    <h3 id="t">Hotel Playa Azul</h3>
                </CardBody>
                <CardFooter>from 1.299 €</CardFooter>
            </Card>,
        );
        const card = screen.getByRole("article", { name: "Hotel Playa Azul" });
        expect(card.className).toContain("max-w-sm");
        expect(screen.getByRole("img", { name: "Pool" })).toBeInTheDocument();
        expect(screen.getByText("from 1.299 €")).toBeInTheDocument();
        await expectNoA11yViolations();
    });
});
