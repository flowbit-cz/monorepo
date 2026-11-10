import { useSyncExternalStore } from "react";

/**
 * `true` while the media query matches (`useMediaQuery("(min-width: 64rem)")`).
 * It returns `serverValue` during SSR, so the first client render matches the server HTML.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const list = window.matchMedia(query);
            list.addEventListener("change", onChange);
            return () => list.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => serverValue,
    );
}
