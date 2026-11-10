import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
    it.each([
        ["Mallorca", "mallorca"],
        ["Côte d'Azur", "cote-d-azur"],
        ["Großglockner Hochalpenstraße", "grossglockner-hochalpenstrasse"],
        ["Řecko – Kréta", "recko-kreta"],
        ["  --Hello   World--  ", "hello-world"],
        ["", ""],
    ])("%s → %s", (input, expected) => {
        expect(slugify(input)).toBe(expected);
    });
});
