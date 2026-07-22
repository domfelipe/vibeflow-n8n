# Launch checklist

## Release gate

- [x] `npm run verify` passes on Node.js 20, 22, and 24 in CI.
- [x] Official skill and plugin validators pass.
- [x] Safe fixture exits 0; unsafe fixture exits 1.
- [x] SARIF is valid JSON and uploaded by CI.
- [x] Repository description and topics match the new product.
- [x] `v0.8.0` release notes match `CHANGELOG.md`.
- [x] Remote CLI and pinned Codex marketplace install successfully.
- [x] Private vulnerability reporting and Discussions are enabled.

Release: <https://github.com/domfelipe/vibeflow-n8n/releases/tag/v0.8.0>

Launch discussion: <https://github.com/domfelipe/vibeflow-n8n/discussions/3>

## Announcement

> Vibeflow is now an executable safety gate for AI-generated n8n workflows. It checks exported JSON for secrets, exposed webhooks, missing kill switches and handoffs, idempotency, failure paths, timeouts, and unsafe retries. It is dependency-free, runs locally or in GitHub Actions, and includes a Codex plugin.

Link to the repository and the safe/unsafe demo. Ask users for anonymized false-positive cases and real workflow fixtures, not stars alone.
