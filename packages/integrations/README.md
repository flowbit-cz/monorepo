# @dertour/integrations

Optional integrations seen on DERTOUR sites. Each one is a separate subpath with an **optional** peer dependency,
so an app pays only for what it imports.

| Import                               | What                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `@dertour/integrations/usercentrics` | `<UsercentricsScript settingsId />`, `hasConsent()`, `onConsentChange()` |
| `@dertour/integrations/datadog`      | `<DatadogRum ... />`: RUM started after Usercentrics consent             |
| `@dertour/integrations/gtm`          | `GoogleTagManager`, `sendGTMEvent` (`@next/third-parties`)               |
| `@dertour/integrations/contentstack` | `createContentstack()`: Delivery API client, `entryByUrl()`              |

The template app switches them on only when their env variables are set (see `apps/template/.env.example`).
