import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { appData } from "@/config/appData";
import { getMessages } from "./messages";
import { routing } from "./routing";

/** next-intl request config: resolves the locale and loads its messages. */
export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    return { locale, messages: getMessages(locale), timeZone: appData.timeZone };
});
