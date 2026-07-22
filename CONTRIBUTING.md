# Contributing

Vibeflow favors small, evidence-backed rules over broad heuristics.

## Development

Node.js 20 or newer is required. No dependency installation is needed.

```bash
npm test
npm run check
npm pack --dry-run
```

## Policy changes

A policy change must include:

1. A stable rule ID and remediation in `src/vibeflow.mjs`.
2. Configuration support in the JSON schema.
3. A fixture proving the unsafe case.
4. A safe fixture or test guarding against the likely false positive.
5. Updated user and Codex policy documentation.

Rules that cannot produce deterministic results from exported JSON belong outside the core CLI.

Keep pull requests focused. Show the smallest failing workflow and the before/after CLI output. Never submit real credentials or customer data.

Participation is governed by the [code of conduct](CODE_OF_CONDUCT.md).
