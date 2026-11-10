import cs from "./messages/cs.json";
import de from "./messages/de.json";
import en from "./messages/en.json";
import fr from "./messages/fr.json";
import { getLocaleInfo } from "./locales";

/** Shared messages (`common.*`, `errors.*`) every app merges into its own translations. */
export const sharedMessages = { de, en, cs, fr } as const;

/** Shape of the shared messages (German is the source language). */
export type SharedMessages = typeof de;

/** Shared messages for a catalogue locale ("de-CH" → German messages). */
export function getSharedMessages(locale: string): SharedMessages {
    return sharedMessages[getLocaleInfo(locale).messages];
}
