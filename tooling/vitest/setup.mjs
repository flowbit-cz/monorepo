import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// jsdom has no canvas. axe-core probes it for icon fonts, so return "no context" instead of throwing.
if (typeof HTMLCanvasElement !== "undefined") HTMLCanvasElement.prototype.getContext = () => null;

/** Unmount rendered trees after every component test (jsdom only). */
afterEach(async () => {
    if (typeof document === "undefined") return;
    const { cleanup } = await import("@testing-library/react");
    cleanup();
});
