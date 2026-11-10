import { describe, expect, it, vi } from "vitest";
import { createLogger } from "./logger";

const now = () => new Date("2027-07-01T10:00:00Z");

describe("createLogger", () => {
    it("writes one JSON line with service, level and context", () => {
        const sink = vi.fn();
        createLogger({ service: "web", level: "debug", sink, now }).info("Offer loaded", { offerId: "off-1" });
        expect(sink).toHaveBeenCalledWith(
            "info",
            JSON.stringify({
                time: "2027-07-01T10:00:00.000Z",
                level: "info",
                service: "web",
                message: "Offer loaded",
                offerId: "off-1",
            }),
        );
    });

    it("drops entries below the level", () => {
        const sink = vi.fn();
        const logger = createLogger({ service: "web", level: "warn", sink, now });
        logger.debug("x");
        logger.info("x");
        logger.warn("w");
        logger.error("e");
        expect(sink.mock.calls.map(([level]) => level)).toEqual(["warn", "error"]);
    });

    it("serialises errors", () => {
        const sink = vi.fn();
        createLogger({ service: "web", level: "info", sink, now }).error("Failed", { error: new TypeError("bad") });
        expect(JSON.parse(sink.mock.calls[0]![1] as string).error).toMatchObject({ name: "TypeError", message: "bad" });
    });

    it("writes to the console by default", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const info = vi.spyOn(console, "info").mockImplementation(() => {});
        const logger = createLogger({ service: "web", level: "debug" });
        logger.error("e");
        logger.warn("w");
        logger.debug("d");
        expect([error, warn, info].map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1]);
    });
});
