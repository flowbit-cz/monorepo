import { describe, expect, it } from "vitest";
import { z } from "zod";
import { HttpError, toErrorResponse } from "./errors";

class FakeApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public problem = { code: "OFFER_NOT_FOUND" },
    ) {
        super(message);
    }
}

describe("toErrorResponse", () => {
    it("maps HttpError", () => {
        expect(toErrorResponse(new HttpError(409, "Taken", "DUPLICATE", { id: 1 }))).toEqual({
            status: 409,
            body: { message: "Taken", code: "DUPLICATE", details: { id: 1 } },
        });
    });

    it("maps zod errors to 422 with issues", () => {
        const result = z.object({ adults: z.number() }).safeParse({ adults: "x" });
        const response = toErrorResponse(result.error);
        expect(response.status).toBe(422);
        expect(response.body.code).toBe("VALIDATION");
        expect(response.body.details).toHaveLength(1);
    });

    it("passes backend 4xx errors through", () => {
        expect(toErrorResponse(new FakeApiError(404, "Offer missing"))).toEqual({
            status: 404,
            body: { message: "Offer missing", code: "OFFER_NOT_FOUND" },
        });
    });

    it("hides details of everything else behind a 500", () => {
        expect(toErrorResponse(new FakeApiError(503, "db password wrong"))).toEqual({
            status: 500,
            body: { message: "Internal server error.", code: "INTERNAL" },
        });
        expect(toErrorResponse("boom").status).toBe(500);
    });
});
