/** Error body returned by the backend (RFC 9457 problem details). */
export interface ProblemDetails {
    type?: string;
    title: string;
    status: number;
    detail?: string;
    code?: string;
}

/** Thrown by every generated client call when the backend answers with a non-2xx status. */
export class ApiError extends Error {
    override name = "ApiError";

    constructor(
        public readonly status: number,
        public readonly problem: ProblemDetails,
        public readonly url: string,
    ) {
        super(problem.detail ?? problem.title);
    }
}

/** `true` for an {@link ApiError}, optionally with a given status (`isApiError(error, 404)`). */
export function isApiError(error: unknown, status?: number): error is ApiError {
    return error instanceof ApiError && (status === undefined || error.status === status);
}
