import { expectNoA11yViolations, renderWithProviders, screen } from "@dertour/testing";
import { describe, expect, it } from "vitest";
import { StatusPage } from "./StatusPage";

describe("StatusPage", () => {
    it("renders code, title, description and actions", async () => {
        renderWithProviders(
            <main>
                <StatusPage code="404" title="Page not found" description="Sorry.">
                    <a href="/">Home</a>
                </StatusPage>
            </main>,
        );
        expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
        expect(screen.getByText("Sorry.")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        await expectNoA11yViolations();
    });

    it("works with a title only", () => {
        renderWithProviders(<StatusPage title="Oops" />);
        expect(screen.queryByText("404")).not.toBeInTheDocument();
    });
});
