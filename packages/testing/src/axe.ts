import axe from "axe-core";

/**
 * Fails when axe finds WCAG 2.1 A/AA violations in the rendered DOM.
 * jsdom can't compute layout, so color-contrast is checked in E2E (Playwright) instead.
 */
export async function expectNoA11yViolations(container: Element = document.body): Promise<void> {
    const results = await axe.run(container, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
    });
    const summary = results.violations.map(
        (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
    );
    if (summary.length) throw new Error(`Accessibility violations:\n${summary.join("\n")}`);
}
