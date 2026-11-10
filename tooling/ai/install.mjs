#!/usr/bin/env node
/**
 * Activates the Claude Code setup of the monorepo: copies settings, hooks and skills from tooling/ai into
 * .claude/. Hooks and skills are always updated. An existing .claude/settings.json is never overwritten.
 * It's left alone when it already matches, and you get a merge hint when it differs.
 * Run it yourself after reviewing the files: `node tooling/ai/install.mjs` (or `pnpm ai:install`).
 */
import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";

const source = import.meta.dirname;
const target = path.resolve(source, "../../.claude");

mkdirSync(target, { recursive: true });
cpSync(path.join(source, "hooks"), path.join(target, "hooks"), { recursive: true });
cpSync(path.join(source, "skills"), path.join(target, "skills"), { recursive: true });
console.warn("✔ hooks and skills updated in .claude/");

const sourceSettings = path.join(source, "settings.json");
const settings = path.join(target, "settings.json");
const read = (file) => JSON.parse(readFileSync(file, "utf8"));

if (!existsSync(settings)) {
    cpSync(sourceSettings, settings);
    console.warn("✔ .claude/settings.json created");
} else if (isDeepStrictEqual(read(settings), read(sourceSettings))) {
    console.warn("✔ .claude/settings.json is up to date");
} else {
    console.warn(
        "⚠ .claude/settings.json differs from tooling/ai/settings.json and was left untouched. Merge it by hand.",
    );
}
console.warn("Restart Claude Code (or open /hooks) to load the changes.");
