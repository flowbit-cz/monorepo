import "server-only";
import { createLogger } from "@dertour/server/logger";
import { appData } from "@/config/appData";

/** Server logger of the app (JSON lines, picked up by Datadog). */
export const logger = createLogger({ service: appData.service });
