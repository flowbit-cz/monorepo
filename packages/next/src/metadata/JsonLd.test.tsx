import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JsonLd, serializeJsonLd } from "./JsonLd";

describe("JsonLd", () => {
    it("escapes < so data can't break out of the script tag", () => {
        expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
    });

    it("renders an ld+json script", () => {
        const { container } = render(<JsonLd data={{ "@type": "Hotel", name: "Playa" }} />);
        const script = container.querySelector('script[type="application/ld+json"]');
        expect(JSON.parse(script!.innerHTML)).toEqual({ "@type": "Hotel", name: "Playa" });
    });
});
