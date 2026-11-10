import { DatadogRum } from "@dertour/integrations/datadog";
import { GoogleTagManager } from "@dertour/integrations/gtm";
import { UsercentricsScript } from "@dertour/integrations/usercentrics";
import { appData } from "@/config/appData";
import { env } from "@/lib/env";

/** Third-party scripts. Each one is active only when its env variable is set (see .env.example). */
export function Integrations({ locale }: { locale: string }) {
    return (
        <>
            {env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID && (
                <UsercentricsScript settingsId={env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID} language={locale} />
            )}
            {env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />}
            {env.NEXT_PUBLIC_DATADOG_APPLICATION_ID && env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN && (
                <DatadogRum
                    applicationId={env.NEXT_PUBLIC_DATADOG_APPLICATION_ID}
                    clientToken={env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN}
                    service={appData.service}
                    env={env.NEXT_PUBLIC_DATADOG_ENV}
                    version={process.env.APP_VERSION}
                    consentService={env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID ? appData.consentServices.datadog : false}
                />
            )}
        </>
    );
}
