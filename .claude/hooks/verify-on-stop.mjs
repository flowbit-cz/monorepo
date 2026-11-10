#!/usr/bin/env node
/**
 * Stop hook. Before Claude finishes a task that changed code, it runs lint + typecheck + tests of the
 * changed workspaces and everything that depends on them (Turbo). On failure Claude gets the output and
 * keeps working (exit 2). It runs once per stop (`stop_hook_active` guard), so it never loops forever.
 * When the checks can't run at all (no pnpm/turbo), it only leaves a note instead of reporting a failure.
 */
import path from "node:path";
import { localBin, packageDirOf, readEvent, ROOT, run, tail } from "./lib.mjs";

const event = await readEvent();
if (event.stop_hook_active) process.exit(0);

const status = run("git", ["status", "--porcelain", "--untracked-files=all"], ROOT);
if (status.status !== "passed") process.exit(0);

const changed = status.output
    .split("\n")
    .map((line) => line.slice(3).trim())
    .filter((file) => /\.(ts|tsx|mjs|json|css)$/.test(file) && !file.includes("src/generated/"));
const packages = [...new Set(changed.map(packageDirOf).filter(Boolean))].map((dir) => `./${path.relative(ROOT, dir)}`);
if (packages.length === 0) process.exit(0);

// "...<pkg>" = the package and all its dependents.
const filters = packages.flatMap((pkg) => ["--filter", `...${pkg}`]);
const result = run(
    localBin("turbo", ROOT),
    ["run", "lint", "typecheck", "test", ...filters, "--output-logs=errors-only", "--ui=stream"],
    ROOT,
    600_000,
);
if (result.status === "failed") {
    process.stderr.write(
        `Verification failed for ${packages.join(", ")}. Fix it before finishing:\n${tail(result.output, 80)}\n`,
    );
    process.exit(2);
}
if (result.status === "skipped") {
    // Stop hooks show a `systemMessage` to the user (no blocking, no fake failure).
    process.stdout.write(
        JSON.stringify({ systemMessage: `Verification was not run (${result.output}). Run \`pnpm verify\` manually.` }),
    );
}
process.exit(0);
