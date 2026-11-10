import path from "node:path";
import { withDertour } from "@dertour/next/config";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(
    withDertour(
        {},
        {
            monorepoRoot: path.join(import.meta.dirname, "../.."),
            imageHosts: [
                "picsum.photos",
                "fastly.picsum.photos",
                "eu-images.contentstack.com",
                "media.dertouristik.com",
            ],
        },
    ),
);
