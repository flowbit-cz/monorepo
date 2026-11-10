import { render } from "@dertour/testing";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { UsercentricsScript } from "./UsercentricsScript";

vi.mock("next/script", () => ({ default: (props: ComponentProps<"script">) => <script {...props} /> }));

describe("UsercentricsScript", () => {
    it("loads the CMP with the settings id and language", () => {
        const { container } = render(<UsercentricsScript settingsId="abc123" language="de" />);
        const script = container.querySelector("script")!;
        expect(script).toHaveAttribute("src", "https://web.cmp.usercentrics.eu/ui/loader.js");
        expect(script).toHaveAttribute("data-settings-id", "abc123");
        expect(script).toHaveAttribute("data-language", "de");
    });
});
