import { beforeEach, describe, expect, it, vi } from "vitest";

const calls: Array<[string, unknown[]]> = [];
let entries: unknown[] = [];

/** Chainable fake of the Delivery SDK query builder that records every call. */
const chain: Record<string, (...args: unknown[]) => unknown> = new Proxy(
    {},
    {
        get:
            (_, name: string) =>
            (...args: unknown[]) => {
                calls.push([name, args]);
                return name === "find" ? Promise.resolve({ entries }) : chain;
            },
    },
);
const stack = vi.fn(() => chain);

vi.mock("@contentstack/delivery-sdk", () => ({
    default: { stack },
    Region: { EU: "eu", US: "us", AZURE_EU: "azure-eu" },
}));

const { createContentstack } = await import("./index");

beforeEach(() => {
    calls.length = 0;
    entries = [];
    stack.mockClear();
});

describe("createContentstack", () => {
    it("creates an EU stack by default", () => {
        createContentstack({ apiKey: "k", deliveryToken: "t", environment: "production" });
        expect(stack).toHaveBeenCalledWith({
            apiKey: "k",
            deliveryToken: "t",
            environment: "production",
            region: "eu",
        });
    });

    it("finds an entry by url and locale", async () => {
        entries = [{ title: "Mallorca" }];
        const cms = createContentstack({ apiKey: "k", deliveryToken: "t", environment: "production", region: "us" });
        await expect(cms.entryByUrl("landing_page", "/mallorca", "de-de")).resolves.toEqual({ title: "Mallorca" });
        expect(calls).toEqual([
            ["contentType", ["landing_page"]],
            ["entry", []],
            ["locale", ["de-de"]],
            ["query", []],
            ["equalTo", ["url", "/mallorca"]],
            ["find", []],
        ]);
    });

    it("returns null when nothing matches", async () => {
        const cms = createContentstack({ apiKey: "k", deliveryToken: "t", environment: "production" });
        await expect(cms.entryByUrl("landing_page", "/nope", "de-de")).resolves.toBeNull();
    });
});
