import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tokensToCss } from "../src/toCss.mjs";

const root = new URL("../", import.meta.url);
const tokens = JSON.parse(readFileSync(new URL("src/tokens.json", root), "utf8"));
mkdirSync(new URL("src/generated/", root), { recursive: true });
writeFileSync(new URL("src/generated/theme.css", root), tokensToCss(tokens));
