import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createEnv, InvalidEnvError } from "./createEnv";

const shapes = {
    server: { API_BASE_URL: z.url() },
    client: { NEXT_PUBLIC_SITE_URL: z.url() },
};

describe("createEnv", () => {
    it("returns typed values on the server", () => {
        const env = createEnv({
            ...shapes,
            isServer: true,
            runtimeEnv: { API_BASE_URL: "https://api.test", NEXT_PUBLIC_SITE_URL: "https://site.test" },
        });
        expect(env.API_BASE_URL).toBe("https://api.test");
        expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://site.test");
    });

    it("throws a readable error when a variable is missing", () => {
        expect(() =>
            createEnv({ ...shapes, isServer: true, runtimeEnv: { NEXT_PUBLIC_SITE_URL: "https://site.test" } }),
        ).toThrow(InvalidEnvError);
        expect(() => createEnv({ ...shapes, isServer: true, runtimeEnv: {} })).toThrow(/API_BASE_URL/);
    });

    it("validates only client variables in the browser and blocks server ones", () => {
        const env = createEnv({
            ...shapes,
            isServer: false,
            runtimeEnv: { NEXT_PUBLIC_SITE_URL: "https://site.test" },
        });
        expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://site.test");
        expect(() => env.API_BASE_URL).toThrow(/accessed on the client/);
    });

    it("rejects client variables without the NEXT_PUBLIC_ prefix", () => {
        expect(() => createEnv({ server: {}, client: { SECRET: z.string() }, runtimeEnv: {} })).toThrow(/NEXT_PUBLIC_/);
    });

    it("skips validation when asked", () => {
        const env = createEnv({ ...shapes, skipValidation: true, runtimeEnv: {} });
        expect(env.API_BASE_URL).toBeUndefined();
    });
});
