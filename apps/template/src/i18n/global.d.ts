import type { routing } from "./routing";
import type { Messages } from "./messages";

// Typed locales and message keys: `t("offers.unknownKey")` is a type error.
declare module "next-intl" {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: Messages;
    }
}
