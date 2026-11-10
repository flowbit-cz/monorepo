import { NextResponse } from "next/server";
import { toErrorResponse } from "./errors";
import type { Logger } from "./logger";

/**
 * Wraps a route handler or server action body: unexpected errors are logged and every error
 * becomes the uniform `{ message, code?, details? }` response.
 */
export function createRunHandler(logger?: Logger) {
    return async function runHandler(handler: () => Promise<Response>): Promise<Response> {
        try {
            return await handler();
        } catch (error) {
            const { status, body } = toErrorResponse(error);
            if (status >= 500) logger?.error("Unhandled route error", { error });
            return NextResponse.json(body, { status });
        }
    };
}

/** JSON response helper. */
export function json<T>(data: T, init?: number | ResponseInit): NextResponse<T> {
    return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}
