#!/usr/bin/env node
/**
 * PostToolUse hook (Edit / Write / MultiEdit). After Claude changes a source file it:
 *  1. runs the Vitest tests related to the file (`vitest related`). When they fail, Claude gets the output
 *     (exit 2) and fixes the code or the test right away. When the tests couldn't run at all (no binary,
 *     timeout), it only leaves a note. That's not a test failure;
 *  2. reminds Claude when a file that must be tested has no test next to it (CLAUDE.md → Testing).
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { localBin, note, packageDirOf, readEvent, run, tail } from "./lib.mjs";

const event = await readEvent();
const file = event.tool_input?.file_path;
if (!file || !/\.(ts|tsx)$/.test(file) || /\/(src\/generated|node_modules|\.next)\//.test(file)) process.exit(0);

const pkg = packageDirOf(file);
if (!pkg) process.exit(0);

const notes = [];
const result = run(
    localBin("vitest", pkg),
    ["related", path.resolve(file), "--run", "--passWithNoTests", "--reporter=dot"],
    pkg,
);
if (result.status === "failed") {
    process.stderr.write(
        `Tests related to ${path.relative(pkg, file)} fail. Fix the code or the test ` +
            `(never delete, skip or weaken a test only to get green):\n${tail(result.output)}\n`,
    );
    process.exit(2);
}
if (result.status === "skipped") notes.push(`Related tests were not run (${result.output}). Run them manually.`);

/** Files that must have a test next to them. */
const MUST_BE_TESTED = [
    /\/modules\/[^/]+\/(utils|dto|api|metadata|[^/]+\.store)\.ts$/,
    /\.form\.ts$/,
    /\/packages\/(core|i18n|server)\/src\/.+\.ts$/,
    /\/packages\/api\/src\/(mutator|mocks)\/.+\.ts$/,
    /\/packages\/ui\/src\/components\/[^/]+\/[A-Z][^/.]+\.tsx$/,
];
const isTestLike =
    /\.(test|spec|stories|d)\.tsx?$/.test(file) || /\/(index|index\.client)\.ts$/.test(file) || /\/types\//.test(file);

if (!isTestLike && MUST_BE_TESTED.some((pattern) => pattern.test(file))) {
    const base = file.replace(/\.(ts|tsx)$/, "");
    if (![".test.ts", ".test.tsx"].some((ext) => existsSync(base + ext))) {
        notes.push(
            `${path.basename(file)} has no test yet. Add ${path.basename(base)}.test.ts(x) next to it (skill dertour-write-tests).`,
        );
    }
}

if (notes.length) note("PostToolUse", notes.join("\n"));
process.exit(0);
