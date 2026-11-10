import Script from "next/script";

/** Loads the Usercentrics CMP (cookie banner). `settingsId` comes from the Usercentrics admin. */
export function UsercentricsScript({ settingsId, language }: { settingsId: string; language?: string }) {
    return (
        <Script
            id="usercentrics-cmp"
            src="https://web.cmp.usercentrics.eu/ui/loader.js"
            data-settings-id={settingsId}
            data-language={language}
            strategy="afterInteractive"
        />
    );
}
