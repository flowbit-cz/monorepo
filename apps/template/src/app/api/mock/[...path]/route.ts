import { env } from "@/lib/env";
import { handleMockRequest } from "@/lib/mockApi";

// Browser-side API mock (API_MOCKING=enabled). It returns 404 when mocking is off.
export const dynamic = "force-dynamic";

const handle = (request: Request) => handleMockRequest(request, env.API_MOCKING === "enabled");

export { handle as DELETE, handle as GET, handle as PATCH, handle as POST, handle as PUT };
