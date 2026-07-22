# Vibeflow v0.9.0 — Outcome-aware preflight for n8n

Generated workflows need more than valid JSON. A normal HTTP node can still issue a refund, notify a customer, change access, or delete production data.

Vibeflow v0.9 introduces outcome contracts and four policies:

- **VF010** blocks uncontracted money and privileged actions.
- **VF011** warns on uncontracted customer communications and destructive writes.
- **VF012** detects connected error paths that notify nobody.
- **VF013** requires a compensation, rollback, or replay story.

For contracted actions, Vibeflow checks whether atomic idempotency and durable audit dominate the action, approval and limit nodes have real allow/deny branches, failure notification is connected to the error output, and recovery is represented in the graph.

Try the unsafe case:

```bash
npx --yes github:domfelipe/vibeflow-n8n#v0.9.0 check examples/unsafe-refund.workflow.json --fail-on never
```

Then inspect the passing contract in `examples/outcome-contracts.vibeflow.json` and `examples/safe-refund.workflow.json`.

This is a static preflight, not a runtime policy engine. Authorization, amount/counterparty enforcement, audit durability, and tested recovery still belong in the services that execute the action.

Full changelog: <https://github.com/domfelipe/vibeflow-n8n/blob/v0.9.0/CHANGELOG.md>
