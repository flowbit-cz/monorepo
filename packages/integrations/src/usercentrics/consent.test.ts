// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { hasConsent, onConsentChange } from "./consent";

afterEach(() => {
    delete window.UC_UI;
});

describe("hasConsent", () => {
    it("is false before Usercentrics has loaded", () => {
        expect(hasConsent("Datadog")).toBe(false);
    });

    it("reads the consent status of a service", () => {
        window.UC_UI = {
            getServicesBaseInfo: () => [
                { name: "Datadog", consent: { status: true } },
                { name: "Google Tag Manager", consent: { status: false } },
            ],
        };
        expect(hasConsent("Datadog")).toBe(true);
        expect(hasConsent("Google Tag Manager")).toBe(false);
        expect(hasConsent("Unknown")).toBe(false);
    });
});

describe("onConsentChange", () => {
    it("subscribes to consent events and unsubscribes", () => {
        const callback = vi.fn();
        const unsubscribe = onConsentChange(callback);
        window.dispatchEvent(new Event("UC_CONSENT"));
        unsubscribe();
        window.dispatchEvent(new Event("UC_CONSENT"));
        expect(callback).toHaveBeenCalledOnce();
    });
});
