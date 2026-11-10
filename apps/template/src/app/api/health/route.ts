import { createHealthRoute } from "@dertour/next/health";
import { appData } from "@/config/appData";

export const dynamic = "force-dynamic";

export const GET = createHealthRoute({ service: appData.service });
