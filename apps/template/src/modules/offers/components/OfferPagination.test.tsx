import { screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test/render";
import { OfferPagination } from "./OfferPagination";

const search = { adults: 2, sort: "recommended", page: 2, destination: "PMI" } as const;

describe("OfferPagination", () => {
    it("renders nothing for a single page", () => {
        const { container } = renderApp(<OfferPagination page={{ page: 1, pageSize: 12, total: 5 }} search={search} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("links pages and keeps the filter", () => {
        renderApp(<OfferPagination page={{ page: 2, pageSize: 12, total: 40 }} search={search} />);
        expect(screen.getByRole("link", { name: "Seite 2" })).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Seite 1" })).toHaveAttribute("href", "/offers?destination=PMI");
        expect(screen.getByRole("link", { name: "Nächste Seite" })).toHaveAttribute(
            "href",
            "/offers?destination=PMI&page=3",
        );
        expect(screen.getByRole("link", { name: "Vorherige Seite" })).toBeInTheDocument();
    });

    it("hides next on the last page", () => {
        renderApp(
            <OfferPagination
                page={{ page: 4, pageSize: 12, total: 40 }}
                search={{ ...search, destination: undefined }}
            />,
        );
        expect(screen.queryByRole("link", { name: "Nächste Seite" })).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Seite 1" })).toHaveAttribute("href", "/offers");
    });
});
