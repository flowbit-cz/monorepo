import { describe, expect, it } from "vitest";
import { pageWindow, totalPages } from "./pagination";

describe("totalPages", () => {
    it("rounds up and never returns 0", () => {
        expect(totalPages({ total: 41, pageSize: 20 })).toBe(3);
        expect(totalPages({ total: 40, pageSize: 20 })).toBe(2);
        expect(totalPages({ total: 0, pageSize: 20 })).toBe(1);
        expect(totalPages({ total: 10, pageSize: 0 })).toBe(1);
    });
});

describe("pageWindow", () => {
    it("shows every page when there are few", () => {
        expect(pageWindow(2, 3)).toEqual([1, 2, 3]);
    });

    it("collapses distant pages into ellipses", () => {
        expect(pageWindow(5, 20)).toEqual([1, "…", 4, 5, 6, "…", 20]);
        expect(pageWindow(1, 20)).toEqual([1, 2, "…", 20]);
        expect(pageWindow(20, 20)).toEqual([1, "…", 19, 20]);
    });
});
