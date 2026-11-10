#!/usr/bin/env node
/**
 * Creates a new Next.js app in the DERTOUR monorepo from apps/template.
 * It does the mechanical part deterministically (copy, rename, ports, locales, messages wiring).
 * The skill dertour-fe-create-app (or a developer) then does the rest (content, modules, translations).
 *
 *   node tooling/ai/skills/dertour-fe-create-app/scripts/create-app.mjs <name> [options]
 *   pnpm create-app <name> [options]
 *
 * Options:
 *   --title "<brand name>"     appData.name                     (default: "DERTOUR")
 *   --locales de,en,cs         app locales, the first is default (default: template locales)
 *   --port 3001                dev port, E2E uses port + 100    (default: next free port)
 *   --description "<text>"     package.json description
 *   --dry-run                  print the plan, write nothing
 */
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const ROOT = path.resolve(import.meta.dirname, "../../../../..");
const TEMPLATE = path.join(ROOT, "apps/template");

/** Locale code → message language. Mirrors LOCALES in packages/i18n/src/locales.ts. */
const LOCALE_LANGUAGE = { de: "de", "de-AT": "de", "de-CH": "de", "fr-CH": "fr", fr: "fr", en: "en", cs: "cs" };

/** Build output and local files that must not be copied. */
const SKIP = new Set([
    "node_modules",
    ".next",
    ".turbo",
    "coverage",
    "test-results",
    "playwright-report",
    "blob-report",
    "reports",
    ".stryker-tmp",
    ".env",
    "tsconfig.tsbuildinfo",
    "next-env.d.ts",
    "AGENTS.md",
]);

function fail(message) {
    console.error(`✖ ${message}`);
    process.exit(1);
}

const { values: options, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        title: { type: "string", default: "DERTOUR" },
        locales: { type: "string" },
        port: { type: "string" },
        description: { type: "string" },
        "dry-run": { type: "boolean", default: false },
    },
});

// ---- validate input
const name = positionals[0];
if (!name) fail("Usage: create-app <name> [--title] [--locales de,en] [--port 3001] [--dry-run]");
if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) fail(`"${name}" must be kebab-case (e.g. "dertour-ch", "booking").`);
if (name === "template") fail("Choose a different name than the template.");
const target = path.join(ROOT, "apps", name);
if (existsSync(target)) fail(`apps/${name} already exists.`);

const templateLocales = JSON.parse(
    readFileSync(path.join(TEMPLATE, "src/config/appData.ts"), "utf8")
        .match(/locales: (\[[^\]]*\])/)[1]
        .replace(/'/g, '"'),
);
const locales = options.locales
    ? options.locales
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean)
    : templateLocales;
for (const locale of locales)
    if (!LOCALE_LANGUAGE[locale])
        fail(`Unknown locale "${locale}". Known: ${Object.keys(LOCALE_LANGUAGE).join(", ")}.`);
if (new Set(locales).size !== locales.length) fail("Duplicate locales.");

/** Dev ports already used by apps (`next dev --port N`). */
const usedPorts = readdirSync(path.join(ROOT, "apps"))
    .map((dir) => path.join(ROOT, "apps", dir, "package.json"))
    .filter(existsSync)
    .map((file) => Number(JSON.parse(readFileSync(file, "utf8")).scripts?.dev?.match(/--port (\d+)/)?.[1]))
    .filter(Boolean);
const port = options.port ? Number(options.port) : Math.max(2999, ...usedPorts) + 1;
if (!Number.isInteger(port) || port < 1024 || port > 65000) fail(`Invalid port "${options.port}".`);
if (usedPorts.includes(port)) fail(`Port ${port} is used by another app.`);
const e2ePort = port + 100;

const pkgName = `@dertour/${name}`;
const languages = [...new Set(locales.map((l) => LOCALE_LANGUAGE[l]))];

console.log(`Creating apps/${name} (${pkgName})
  title     ${options.title}
  locales   ${locales.join(", ")} (default ${locales[0]})
  ports     dev ${port}, e2e ${e2ePort}`);
if (options["dry-run"]) process.exit(0);

// ---- copy
cpSync(TEMPLATE, target, { recursive: true, filter: (src) => !SKIP.has(path.basename(src)) });
const file = (rel) => path.join(target, rel);
const edit = (rel, fn) => writeFileSync(file(rel), fn(readFileSync(file(rel), "utf8")));
const warnings = [];

// ---- package.json
edit("package.json", (s) => {
    const pkg = JSON.parse(s);
    pkg.name = pkgName;
    pkg.description = options.description ?? `${options.title} – Next.js app of the DERTOUR monorepo.`;
    pkg.scripts.dev = `next dev --port ${port}`;
    return `${JSON.stringify(pkg, null, 2)}\n`;
});

// ---- ports, names
edit("playwright.config.ts", (s) => s.replace(/port: \d+/, `port: ${e2ePort}`));
edit(".env.example", (s) => s.replace(/localhost:\d+/, `localhost:${port}`));
edit("Dockerfile", (s) =>
    s
        .replaceAll("apps/template", `apps/${name}`)
        .replaceAll("@dertour/template", pkgName)
        .replaceAll("dertour/template", `dertour/${name}`),
);
edit("README.md", (s) =>
    s
        .replace(
            /^# template\n[\s\S]*?(?=```bash)/,
            `# ${name}\n\n${options.title}: Next.js app created from apps/template.\n\n`,
        )
        .replaceAll("apps/template", `apps/${name}`)
        .replaceAll("dertour/template", `dertour/${name}`)
        .replaceAll("localhost:3000", `localhost:${port}`),
);

// ---- appData
edit("src/config/appData.ts", (s) =>
    s
        .replace(/name: "[^"]*"/, `name: ${JSON.stringify(options.title)}`)
        .replace(/service: "[^"]*"/, `service: "${name}"`)
        .replace(/localhost:\d+/, `localhost:${port}`)
        .replace(/locales: \[[^\]]*\]/, `locales: [${locales.map((l) => JSON.stringify(l)).join(", ")}]`)
        .replace(/defaultLocale: "[^"]*"/, `defaultLocale: "${locales[0]}"`),
);

// ---- message files: keep needed languages, create missing ones from English (marked for translation)
const messageDirs = [
    "src/i18n/locales",
    ...readdirSync(file("src/modules"))
        .map((m) => `src/modules/${m}/i18n`)
        .filter((d) => existsSync(file(d))),
];
for (const dir of messageDirs) {
    for (const json of readdirSync(file(dir))) {
        if (!languages.includes(json.replace(".json", ""))) rmSync(file(`${dir}/${json}`));
    }
    for (const language of languages) {
        const target = file(`${dir}/${language}.json`);
        if (!existsSync(target)) {
            cpSync(path.join(TEMPLATE, dir, "en.json"), target);
            warnings.push(`${dir}/${language}.json was copied from English. Translate it.`);
        }
    }
}

// ---- src/i18n/messages.ts wiring (shared + global + per-module messages for every locale)
const modules = messageDirs.filter((d) => d.startsWith("src/modules/")).map((d) => d.split("/")[2]);
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const ident = (module, language) => `${camel(module)}${language[0].toUpperCase()}${language.slice(1)}`;
const imports = [
    'import { getSharedMessages } from "@dertour/i18n";',
    ...modules.flatMap((m) => languages.map((l) => `import ${ident(m, l)} from "@/modules/${m}/i18n/${l}.json";`)),
    'import type { AppLocale } from "@/config/appData";',
    ...languages.map((l) => `import ${l} from "./locales/${l}.json";`),
].sort((a, b) => (a.includes("@dertour") ? -1 : b.includes("@dertour") ? 1 : 0));
const entries = locales
    .map((locale) => {
        const l = LOCALE_LANGUAGE[locale];
        return `    ${JSON.stringify(locale)}: { ...${l}, ${modules.map((m) => `${camel(m)}: ${ident(m, l)}`).join(", ")} },`;
    })
    .join("\n");
edit("src/i18n/messages.ts", (s) =>
    s
        .replace(/^import[\s\S]*?\n\n/, `${imports.join("\n")}\n\n`)
        .replace(/const appMessages = \{[\s\S]*?\} satisfies/, `const appMessages = {\n${entries}\n} satisfies`),
);

// ---- tests render with the default locale
edit("src/test/render.tsx", (s) => s.replace(/locale: AppLocale = "[^"]*"/, `locale: AppLocale = "${locales[0]}"`));

// ---- tests that query German labels (home, layout and messages tests read texts from the messages)
if (LOCALE_LANGUAGE[locales[0]] !== "de") {
    warnings.push(
        "The default language isn't German: the offers component tests and e2e/offers.spec.ts query German labels. " +
            "Switch them to the new texts (or read them via getMessages()).",
    );
}

console.log(`
✔ apps/${name} created.

Next steps:
  pnpm install
  cp apps/${name}/.env.example apps/${name}/.env
  pnpm turbo run lint typecheck test --filter=${pkgName}
  pnpm --filter ${pkgName} dev           # http://localhost:${port}
`);
if (warnings.length) console.log(`⚠ To do:\n${warnings.map((w) => `  - ${w}`).join("\n")}`);
