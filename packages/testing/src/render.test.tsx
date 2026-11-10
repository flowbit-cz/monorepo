import { useQuery } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { useTranslations } from "next-intl";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "./axe";
import { setupMswServer } from "./msw";
import { renderWithProviders, screen } from "./index";

function Greeting() {
    const t = useTranslations("demo");
    const { data } = useQuery({
        queryKey: ["name"],
        queryFn: () => fetch("https://api.test/name").then((r) => r.json()),
    });
    return (
        <main>
            <h1>{t("hello", { name: data?.name ?? "…" })}</h1>
            <button type="button">{t("ok")}</button>
        </main>
    );
}

const server = setupMswServer([http.get("https://api.test/name", () => HttpResponse.json({ name: "Mallorca" }))]);

describe("renderWithProviders", () => {
    it("provides messages and a query client", async () => {
        renderWithProviders(<Greeting />, { messages: { demo: { hello: "Hallo {name}", ok: "OK" } } });
        expect(await screen.findByRole("heading", { name: "Hallo Mallorca" })).toBeInTheDocument();
    });

    it("lets a test override a handler", async () => {
        server.use(http.get("https://api.test/name", () => HttpResponse.json({ name: "Kreta" })));
        renderWithProviders(<Greeting />, { messages: { demo: { hello: "Hallo {name}", ok: "OK" } } });
        expect(await screen.findByRole("heading", { name: "Hallo Kreta" })).toBeInTheDocument();
    });

    it("returns a user-event instance", async () => {
        const { user } = renderWithProviders(<Greeting />, { messages: { demo: { hello: "Hi {name}", ok: "OK" } } });
        await user.click(screen.getByRole("button", { name: "OK" }));
    });
});

describe("expectNoA11yViolations", () => {
    it("passes for accessible markup", async () => {
        renderWithProviders(<Greeting />, { messages: { demo: { hello: "Hi {name}", ok: "OK" } } });
        await expectNoA11yViolations();
    });

    it("fails for an image without alt text", async () => {
        renderWithProviders(<img src="x.png" />);
        await expect(expectNoA11yViolations()).rejects.toThrow(/image-alt/);
    });
});
