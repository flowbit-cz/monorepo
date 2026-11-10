# @dertour/i18n

- **`LOCALES`**: catalogue of DERTOUR market locales (`de`, `de-AT`, `de-CH`, `fr-CH`, `fr`, `en`, `cs`)
  with Intl tag, label and default currency. Apps pick their subset in `appData.locales`.
- **Formatters**: `formatPrice`, `formatDate`, `formatDateRange` and `tripDuration`. They use plain `Intl`,
  so they work the same on the server, in the browser and in React Native.
- **Shared messages**: `common.*` (actions, pagination, board types…) and `errors.*`. Apps merge them with
  their own messages (see `apps/template/src/i18n/messages.ts`).

Every language must have the same keys. `messages.test.ts` fails otherwise. German is the source language.
