---
name: dertour-test-audit
description: Audits test quality in the DERTOUR monorepo with coverage and Stryker mutation reports and closes the gaps. It adds tests that kill surviving mutants and cover uncovered branches. Use for "test audit", "improve test quality", "mutation testing", the nightly quality job, or before a release.
---

# Test audit (coverage + mutation testing)

Coverage says which lines _ran_. Mutation testing says which behaviour is really _checked_: Stryker changes the code
(`>` → `>=`, `&&` → `||`, removes calls) and a test must fail. A surviving mutant is a missing assertion. AI-written
tests often have exactly this gap.

## Steps

1. Coverage: `pnpm test:coverage` → read `*/coverage/coverage-summary.json` and list files under the gate.
2. Mutation: `pnpm --filter <pkg> test:mutation` (core, i18n, api, server, ui, apps). Slow, so run it per package.
   Read `reports/mutation/mutation.json` and take mutants with status `Survived` or `NoCoverage`.
3. For each surviving mutant: open the file at the location, work out which behaviour the mutation breaks, and add
   **one focused assertion or case** that fails on it (follow the `dertour-write-tests` rules). Equivalent mutants (no
   observable difference) → note them, don't test them.
4. Re-run mutation for the package and check that the score went up.
5. Report a table per package (coverage %, mutation score before → after) plus remaining equivalent mutants.
   In CI, open a PR titled `test: raise mutation score (<packages>)`.
