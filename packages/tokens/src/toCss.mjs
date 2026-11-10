/** Tailwind v4 namespace for each token group (`color.brand.light` → `--color-brand-light`). */
const NAMESPACES = { color: "color", font: "font", radius: "radius", shadow: "shadow", breakpoint: "breakpoint" };

/** Flattens nested tokens into CSS custom properties. `DEFAULT` maps to the group name itself. */
function flatten(prefix, value, out) {
    if (typeof value === "string") {
        out.push([prefix, value]);
        return out;
    }
    for (const [key, child] of Object.entries(value)) {
        flatten(key === "DEFAULT" ? prefix : `${prefix}-${key}`, child, out);
    }
    return out;
}

/**
 * Converts the token JSON into a Tailwind v4 `@theme` block. Every token is a utility class
 * (`bg-brand`, `text-text-muted`, `rounded-lg`, `shadow-card`) and a CSS variable (`var(--color-brand)`).
 * @param {Record<string, unknown>} tokens
 */
export function tokensToCss(tokens) {
    const lines = [];
    for (const [group, namespace] of Object.entries(NAMESPACES)) {
        if (!tokens[group]) continue;
        for (const [name, value] of flatten(`--${namespace}`, tokens[group], [])) lines.push(`    ${name}: ${value};`);
    }
    return `/* Generated from tokens.json by scripts/build-css.mjs. Do not edit. */\n@theme {\n${lines.join("\n")}\n}\n`;
}
