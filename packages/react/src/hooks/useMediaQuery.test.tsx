import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./useMediaQuery";

/** Minimal matchMedia stub that can fire change events. */
function stubMatchMedia(initial: boolean) {
    let matches = initial;
    const listeners = new Set<() => void>();
    vi.stubGlobal("matchMedia", (query: string) => ({
        media: query,
        get matches() {
            return matches;
        },
        addEventListener: (_: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }));
    return {
        set(value: boolean) {
            matches = value;
            listeners.forEach((listener) => listener());
        },
        listeners,
    };
}

describe("useMediaQuery", () => {
    it("follows the media query", () => {
        const media = stubMatchMedia(false);
        const { result, unmount } = renderHook(() => useMediaQuery("(min-width: 64rem)"));
        expect(result.current).toBe(false);
        act(() => media.set(true));
        expect(result.current).toBe(true);
        unmount();
        expect(media.listeners.size).toBe(0);
    });
});
