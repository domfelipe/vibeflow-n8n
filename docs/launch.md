# v0.9.0 launch checklist

Target: Friday, 2026-07-24

## Release gate

- [x] VF010-VF013 implementation and configuration schema are complete.
- [x] Safe and unsafe refund fixtures are reproducible.
- [x] Local `npm run verify` and `npm audit --omit=dev` pass.
- [x] QA, adversarial Red Team, and Guardião reviews are documented.
- [x] Pull request CI passes on Node.js 20, 22, and 24.
- [ ] Release commit is merged and tagged `v0.9.0`.
- [ ] Released CLI and pinned Codex marketplace install successfully.
- [ ] GitHub release is published on Friday.

## Positioning

The launch message is: **dangerous outcomes are not limited to dangerous nodes**.

A normal HTTP, database, or messaging node can refund money, contact a customer, change access, or destroy data. Vibeflow v0.9 adds a preflight contract for the controls that should surround those outcomes: atomic idempotency, approval, amount and counterparty limits, durable audit, operator-visible failure paths, and recovery.

## Announcement

> Vibeflow v0.9 asks a more useful preflight question for generated n8n workflows: not only “is this valid JSON?” or “does it use a dangerous node?”, but “what can this workflow do in the real world if the input is messy or the model is wrong?”
>
> The new outcome contracts detect money, customer, privileged, and destructive-data actions — including ordinary HTTP nodes — and verify structural evidence for idempotency, approval, limits, durable audit, failure notification, and recovery. It is local, dependency-free, CI-friendly, and explicit about what still needs runtime enforcement.

Link to the repository and the safe/unsafe refund demo. Ask users for anonymized workflows, classifier false positives/negatives, and missing domain actions.
