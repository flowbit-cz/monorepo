/** Minimal typing of the Usercentrics CMP v3 browser API (`window.UC_UI`). */
interface UsercentricsUi {
    getServicesBaseInfo(): Array<{ name: string; consent: { status: boolean } }>;
}

declare global {
    interface Window {
        UC_UI?: UsercentricsUi;
    }
}

/** `true` when the visitor consented to a Usercentrics service ("Datadog", "Google Tag Manager"…). */
export function hasConsent(serviceName: string): boolean {
    if (typeof window === "undefined" || !window.UC_UI) return false;
    return window.UC_UI.getServicesBaseInfo().some((service) => service.name === serviceName && service.consent.status);
}

/** Calls `callback` whenever the visitor changes consent (initial load included). Returns an unsubscribe function. */
export function onConsentChange(callback: () => void): () => void {
    const events = ["UC_UI_INITIALIZED", "UC_CONSENT", "UC_UI_CMP_EVENT"];
    events.forEach((event) => window.addEventListener(event, callback));
    return () => events.forEach((event) => window.removeEventListener(event, callback));
}
