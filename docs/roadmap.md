# Roadmap

## 0.8.0

Ship the executable reset: CLI, nine configurable policies, fixtures, tests, SARIF, GitHub Action, and Codex plugin.

## Next release gate

Do not add another integration by default. Prioritize evidence from real workflows:

1. Measure false positives by rule.
2. Accept anonymized fixtures from external users.
3. Add a node type or policy only with a failing fixture.
4. Improve GitHub annotations if SARIF users request it.
5. Package for npm only when GitHub installation creates material friction.
6. Add node-specific handoff and side-effect adapters only with adversarial safe/unsafe fixtures.
7. Model additional atomic idempotency gates only when their duplicate path is proven to stop downstream items.

## Explicitly deferred

Hosted UI, custom MCP server, live n8n mutation, workflow generation, and broad multi-agent wrappers.
