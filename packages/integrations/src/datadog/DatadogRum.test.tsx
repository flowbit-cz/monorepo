import { render } from "@dertour/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

const init = vi.fn();
vi.mock("@datadog/browser-rum", () => ({ datadogRum: { init } }));

const config = { applicationId: "app", clientToken: "token", service: "web", env: "test" };

/** Fresh module per test: the "started" flag is module state. */
async function loadComponent() {
    vi.resetModules();
    return (await import("./DatadogRum")).DatadogRum;
}

beforeEach(() => {
    init.mockReset();
    delete window.UC_UI;
});

describe("DatadogRum", () => {
    it("starts immediately without a consent requirement, with EU defaults", async () => {
        const DatadogRum = await loadComponent();
        const { container } = render(<DatadogRum {...config} consentService={false} />);
        expect(container).toBeEmptyDOMElement();
        expect(init).toHaveBeenCalledOnce();
        expect(init.mock.calls[0]![0]).toMatchObject({
            ...config,
            site: "datadoghq.eu",
            sessionSampleRate: 20,
            defaultPrivacyLevel: "mask-user-input",
        });
    });

    it("waits for consent and starts only once", async () => {
        const DatadogRum = await loadComponent();
        render(<DatadogRum {...config} />);
        expect(init).not.toHaveBeenCalled();

        window.UC_UI = { getServicesBaseInfo: () => [{ name: "Datadog", consent: { status: true } }] };
        window.dispatchEvent(new Event("UC_CONSENT"));
        window.dispatchEvent(new Event("UC_CONSENT"));
        expect(init).toHaveBeenCalledOnce();
    });
});
