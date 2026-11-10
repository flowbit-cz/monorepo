import createMiddleware from "next-intl/middleware";

/**
 * Next.js 16 proxy (formerly middleware): locale detection and redirects via next-intl.
 * Same signature as next-intl's `createMiddleware`, so the routing generics are kept.
 *
 * ```ts
 * // src/proxy.ts
 * import { createI18nProxy } from "@dertour/next/proxy";
 * import { routing } from "./i18n/routing";
 * export default createI18nProxy(routing);
 * // `config` must be a literal in the app (Next.js reads it statically):
 * export const config = { matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"] };
 * ```
 */
export const createI18nProxy: typeof createMiddleware = (...args) => createMiddleware(...args);
