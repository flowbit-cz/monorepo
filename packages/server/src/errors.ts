/** Uniform error body of every route handler in every app. */
export interface ErrorBody {
    message: string;
    code?: string;
    details?: unknown;
}

/** Error with an HTTP status. Throw it from services, and `runHandler` turns it into a response. */
export class HttpError extends Error {
    override name = "HttpError";

    constructor(
        public readonly status: number,
        message: string,
        public readonly code?: string,
        public readonly details?: unknown,
    ) {
        super(message);
    }
}

/** Errors with a status that may be shown to the client (e.g. `ApiError` from @dertour/api). */
interface StatusError {
    status: number;
    message: string;
    problem?: { code?: string };
}

function isStatusError(error: unknown): error is StatusError {
    if (!(error instanceof Error)) return false;
    const status = (error as Error & { status?: unknown }).status;
    return typeof status === "number" && status >= 400 && status < 500;
}

/** Zod error (recognised by shape, so this package doesn't depend on a zod version). */
function zodIssues(error: unknown): unknown[] | undefined {
    if (typeof error !== "object" || error === null || (error as { name?: string }).name !== "ZodError")
        return undefined;
    return (error as { issues?: unknown[] }).issues ?? [];
}

/**
 * Turns any error into a status + uniform body:
 * HttpError → its status · ZodError → 422 · backend 4xx (ApiError) → same status · anything else → 500.
 * A 500 never reveals internal details to the client.
 */
export function toErrorResponse(error: unknown): { status: number; body: ErrorBody } {
    if (error instanceof HttpError) {
        return { status: error.status, body: { message: error.message, code: error.code, details: error.details } };
    }
    const issues = zodIssues(error);
    if (issues) return { status: 422, body: { message: "Invalid input.", code: "VALIDATION", details: issues } };
    if (isStatusError(error))
        return { status: error.status, body: { message: error.message, code: error.problem?.code } };
    return { status: 500, body: { message: "Internal server error.", code: "INTERNAL" } };
}
