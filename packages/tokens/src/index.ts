import tokens from "./tokens.json";

/** Typed design tokens, for code that can't use CSS (React Native, canvas, charts, emails). */
export const designTokens = {
    color: tokens.color,
    font: tokens.font,
    radius: tokens.radius,
    shadow: tokens.shadow,
    breakpoint: tokens.breakpoint,
} as const;

export type DesignTokens = typeof designTokens;
