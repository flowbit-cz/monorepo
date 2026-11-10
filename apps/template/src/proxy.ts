import { createI18nProxy } from "@dertour/next/proxy";
import { routing } from "./i18n/routing";

/** Locale detection and redirects (Next.js 16 proxy, formerly middleware). */
export default createI18nProxy(routing);

export const config = {
    // Everything except API routes, Next.js internals and files with an extension.
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
