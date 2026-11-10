// Brings the jest-dom matchers (toBeInTheDocument…) into the types of every test that imports this package.
import "@testing-library/jest-dom/vitest";

export * from "./axe";
export * from "./render";
export { act, render, renderHook, screen, waitFor, within } from "@testing-library/react";
