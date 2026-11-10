import { defineConfig } from "vitest/config";
import { vitestPreset } from "@dertour/vitest-config";

export default defineConfig(vitestPreset({ root: import.meta.dirname }));
