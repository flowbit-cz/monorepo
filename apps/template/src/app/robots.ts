import type { MetadataRoute } from "next";
import { appData } from "@/config/appData";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
        sitemap: `${appData.siteUrl}/sitemap.xml`,
    };
}
