# @dertour/ai: Claude Code setup

The AI side of the testing strategy. The tests themselves are plain Vitest and Playwright and run deterministically
in CI. Claude **writes and maintains** them.

| Piece                          | What it does                                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `hooks/related-tests.mjs`      | after every edit: runs `vitest related <file>`, feeds failures back to Claude, reminds it about missing tests                 |
| `hooks/verify-on-stop.mjs`     | before Claude finishes: lint + typecheck + tests of changed workspaces and their dependents                                   |
| `skills/dertour-write-tests`   | how to write tests here (what, which type, rules, contract tests)                                                             |
| `skills/dertour-fix-tests`     | how to fix red tests: test or code wrong? never weaken assertions                                                             |
| `skills/dertour-e2e`           | Playwright planner / generator / healer agents (`.claude/agents`, `.mcp.json`)                                                |
| `skills/dertour-test-audit`    | coverage + Stryker mutation report → tests that kill surviving mutants                                                        |
| `skills/dertour-fe-create-app` | new Next.js app from `apps/template`: script `scripts/create-app.mjs` (also `pnpm create-app`) + steps to shape and verify it |
| `settings.json`                | registers the hooks, allows test commands                                                                                     |

## Activate

The files are inert until you install them. Review them, then:

```bash
pnpm ai:install     # copies hooks, skills, settings into .claude/
```

CI uses the same skills through `.github/workflows/claude-tests.yml` and `nightly-quality.yml`.
