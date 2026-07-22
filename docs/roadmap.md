# Roadmap

## 0.8.0

Ship the executable reset: CLI, nine configurable policies, fixtures, tests, SARIF, GitHub Action, and Codex plugin.

## 0.9.0 — target 2026-07-24

Separate dangerous nodes from dangerous outcomes. Add VF010-VF013, explicit outcome contracts, graph evidence for policy gates, safe/unsafe refund fixtures, and clear runtime boundaries.

## Next release gate

Do not add another integration by default. Prioritize evidence from real workflows:

1. Measure false positives by rule and impact classifier.
2. Accept anonymized fixtures from external users.
3. Add a node type or policy only with a failing fixture.
4. Improve GitHub annotations if SARIF users request it.
5. Package for npm only when GitHub installation creates material friction.
6. Add node-specific handoff and side-effect adapters only with adversarial safe/unsafe fixtures.
7. Model additional atomic idempotency gates only when their duplicate path is proven to stop downstream items.
8. Add impact categories and adapters only with a real anonymized workflow and an adversarial fixture.
9. Explore optional runtime attestations only after users demonstrate that static contracts are insufficient.

## Explicitly deferred

Hosted UI, custom MCP server, live n8n mutation, workflow generation, and broad multi-agent wrappers.
