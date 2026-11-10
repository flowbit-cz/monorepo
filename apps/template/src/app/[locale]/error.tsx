"use client";

import { StatusPage } from "@dertour/next/components";
import { Button } from "@dertour/ui";
import { useTranslations } from "next-intl";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations();
    return (
        <StatusPage code="500" title={t("status.errorTitle")} description={t("status.errorText")}>
            <Button onClick={() => reset()}>{t("common.actions.retry")}</Button>
        </StatusPage>
    );
}
