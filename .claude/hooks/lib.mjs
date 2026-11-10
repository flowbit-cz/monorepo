import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/** Repository root (Claude Code sets CLAUDE_PROJECT_DIR for hooks). */
export const ROOT = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

/** Reads the hook event JSON from stdin. */
export async function readEvent() {
    let data = "";
    for await (const chunk of process.stdin) data += chunk;
    return data ? JSON.parse(data) : {};
}

/** Nearest workspace package (apps/* or packages/*) of a file, or null. */
export function packageDirOf(file) {
    let dir = path.dirname(path.resolve(ROOT, file));
    while (dir.startsWith(ROOT) && dir !== ROOT) {
        if (existsSync(path.join(dir, "package.json"))) {
            const rel = path.relative(ROOT, dir);
            return /^(apps|packages)\//.test(rel) ? dir : null;
        }
        dir = path.dirname(dir);
    }
    return null;
}

/**
 * Local binary of a workspace package (`node_modules/.bin/<name>`), looked up from `dir` up to the root.
 * Hooks call binaries directly, so they don't depend on a global pnpm/corepack being on PATH.
 */
export function localBin(name, dir) {
    for (let current = dir; current.startsWith(ROOT); current = path.dirname(current)) {
        const bin = path.join(current, "node_modules/.bin", name);
        if (existsSync(bin)) return bin;
        if (current === ROOT) break;
    }
    return null;
}

/**
 * Runs a command and returns:
 * - `{ status: "passed", output }` when it exits with 0
 * - `{ status: "failed", output }` when it ran and exited with an error (e.g. failing tests)
 * - `{ status: "skipped", output }` when it couldn't run at all (missing binary, timeout).
 *   Not a test failure, so callers must not report it as one.
 */
export function run(command, args, cwd, timeout = 170_000) {
    if (!command) return { status: "skipped", output: "binary not found (run `pnpm install`)" };
    try {
        const output = execFileSync(command, args, { cwd, encoding: "utf8", stdio: "pipe", timeout, env: toolEnv() });
        return { status: "passed", output };
    } catch (error) {
        const output = `${error.stdout ?? ""}${error.stderr ?? ""}` || String(error);
        if (error.code === "ENOENT" || error.code === "ETIMEDOUT" || error.signal) {
            return { status: "skipped", output: `${command} couldn't run: ${error.code ?? error.signal}` };
        }
        // Turbo runs package scripts through pnpm. Without pnpm nothing ran, so it isn't a failure.
        if (/Unable to find package manager binary/.test(output)) {
            return { status: "skipped", output: "pnpm is not on PATH (corepack enable, or add PNPM_HOME/bin to PATH)" };
        }
        return { status: "failed", output };
    }
}

/**
 * Env for child processes. GUI apps (and so Claude Code hooks) often get a shorter PATH than your terminal,
 * so the usual pnpm locations are appended (PNPM_HOME, its bin/ in pnpm 11, the Homebrew/corepack dirs).
 */
function toolEnv() {
    const home = process.env.HOME ?? "";
    const pnpmHome = process.env.PNPM_HOME ?? path.join(home, "Library/pnpm");
    const extra = [
        pnpmHome,
        path.join(pnpmHome, "bin"),
        path.join(home, ".local/share/pnpm"),
        path.dirname(process.execPath),
        "/opt/homebrew/bin",
        "/usr/local/bin",
    ];
    return {
        ...process.env,
        PATH: [process.env.PATH, ...extra].filter(Boolean).join(path.delimiter),
        CI: "1",
        FORCE_COLOR: "0",
    };
}

/** Non-blocking note for Claude (shown as context, doesn't count as a failure). */
export function note(hookEventName, message) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext: message } }));
}

/** Last `lines` lines of a long output (keeps hook messages short). */
export function tail(text, lines = 60) {
    return text.trim().split("\n").slice(-lines).join("\n");
}
