import { describe, expect, it } from "vitest";
import * as gtm from "./index";

describe("gtm", () => {
    it("re-exports the Next.js third-party GTM helpers", () => {
        expect(typeof gtm.GoogleTagManager).toBe("function");
        expect(typeof gtm.sendGTMEvent).toBe("function");
    });
});
