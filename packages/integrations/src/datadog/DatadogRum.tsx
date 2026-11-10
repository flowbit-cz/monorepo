"use client";

import { datadogRum } from "@datadog/browser-rum";
import { useEffect } from "react";
import { hasConsent, onConsentChange } from "../usercentrics/consent";

/** Props of {@link DatadogRum}: values of the RUM application in Datadog. */
export interface DatadogRumProps {
    applicationId: string;
    clientToken: string;
    service: string;
    env: string;
    version?: string;
    /** EU data residency by default. */
    site?: "datadoghq.eu" | "datadoghq.com";
    sessionSampleRate?: number;
    sessionReplaySampleRate?: number;
    /** Usercentrics service name. RUM starts only after consent. `false` starts it right away. */
    consentService?: string | false;
}

let started = false;

/** Starts Datadog RUM once, after consent. Renders nothing. */
export function DatadogRum({
    site = "datadoghq.eu",
    sessionSampleRate = 20,
    sessionReplaySampleRate = 0,
    consentService = "Datadog",
    ...config
}: DatadogRumProps) {
    useEffect(() => {
        const start = () => {
            if (started || (consentService && !hasConsent(consentService))) return;
            started = true;
            datadogRum.init({
                ...config,
                site,
                sessionSampleRate,
                sessionReplaySampleRate,
                trackUserInteractions: true,
                trackResources: true,
                trackLongTasks: true,
                defaultPrivacyLevel: "mask-user-input",
            });
        };
        start();
        return consentService ? onConsentChange(start) : undefined;
        // Config is static for the app's lifetime.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}
