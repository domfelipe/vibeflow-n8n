# Community launch pack — v0.9.0

Publish only after the public `v0.9.0` release URL works.

## Feedback provenance

The v0.9 scope came from the public [original r/n8n launch thread](https://www.reddit.com/r/n8n/comments/1v3is1w/i_built_an_opensource_safety_gate_for_aigenerated/), not a speculative roadmap.

| Community feedback | v0.9 response |
|---|---|
| Separate dangerous nodes from dangerous outcomes | VF010 and VF011 classify money, customer, privileged, and destructive-data actions. |
| Require idempotency, approval, amount/counterparty limits, and durable audit | `outcomeContracts` verifies graph evidence for those controls. |
| Error paths can exist but notify nobody | VF012 requires an operator-visible failure path. |
| Writes need rollback or replay stories | VF013 requires compensation, rollback, or replay evidence. |
| Static checks cannot replace runtime guardrails | The CLI and documentation explicitly preserve that boundary. |

Captured on 2026-07-22: the thread had 3 votes and several substantive comments. Treat the comments as product evidence; do not present the vote count as broad adoption.

## Reddit — r/n8n

### Title

I built your feedback into Vibeflow v0.9: outcome-aware preflight checks for n8n workflows

### Post

I shared Vibeflow here earlier and two pieces of feedback changed the direction of the project:

1. A dangerous outcome is not the same thing as a dangerous node. A normal HTTP node can still issue a refund, send a payment, notify a customer, change access, or delete data.
2. A connected error branch is not enough if it silently terminates, and a write is not production-ready without a rollback, compensation, or replay story.

That feedback is now implemented in Vibeflow v0.9.

Vibeflow is a local, dependency-free preflight checker for exported n8n workflow JSON. The new release adds:

- `VF010`: blocks money and privileged actions without an outcome contract;
- `VF011`: warns about uncontracted customer communications and destructive writes;
- `VF012`: detects error paths that notify nobody;
- `VF013`: requires compensation, rollback, or replay evidence.

For a contracted action, the checker verifies structural evidence in the workflow graph:

- an atomic idempotency claim cannot be bypassed;
- a durable audit write happens before the action;
- approval, amount, and counterparty checks have real allow/deny branches;
- the failure notification is connected to the action's error output;
- recovery is represented in the graph.

The important boundary: this is static preflight, not runtime enforcement. The payment/customer system must still enforce authorization, limits, counterparties, durable audit, and recovery at runtime.

There is a reproducible unsafe refund workflow and a passing contracted version in the repository:

https://github.com/domfelipe/vibeflow-n8n

Release: https://github.com/domfelipe/vibeflow-n8n/releases/tag/v0.9.0

I am especially looking for anonymized examples of:

- a real-world action the classifier misses;
- a false positive where the workflow is demonstrably safe;
- a control that looks present in JSON but can still be bypassed;
- a recovery pattern that does not fit compensate/rollback/replay.

Please remove credentials and customer data before sharing workflow fragments. The best reports will become paired unsafe/safe regression fixtures.

## Short reply to the original commenters

Your distinction between dangerous nodes and dangerous outcomes became the core of v0.9. The release now detects ordinary HTTP/database/message nodes by impact and validates idempotency, approval, amount/counterparty limits, durable audit, operator-visible failures, and recovery evidence. I kept runtime enforcement explicitly outside the claim. Thank you — this materially improved the project.

## GitHub Discussion

### Title

Vibeflow v0.9: help test outcome contracts against real n8n workflows

### Body

Vibeflow v0.9 adds outcome-aware preflight policies for money, customer, privileged, and destructive-data actions. The implementation was driven by community feedback that ordinary nodes can still produce dangerous real-world outcomes.

Please test an exported workflow and report anonymized false positives, missed actions, bypassable controls, or recovery patterns. Useful reports need a minimal unsafe case, the expected safe case, and the exported JSON fields that distinguish them.

- Release: https://github.com/domfelipe/vibeflow-n8n/releases/tag/v0.9.0
- Demo: https://github.com/domfelipe/vibeflow-n8n/blob/v0.9.0/docs/demo.md
- False-positive report: https://github.com/domfelipe/vibeflow-n8n/issues/new?template=false-positive.yml
- Policy proposal: https://github.com/domfelipe/vibeflow-n8n/issues/new?template=rule-proposal.yml

Never attach credentials, customer data, or a private production workflow.

## Evidence rules

- Do not ask for artificial stars, forks, or empty PRs.
- Record only public, attributable usage or anonymized audit outcomes.
- Convert actionable feedback into an issue and paired unsafe/safe fixture.
- Never publish customer workflow names, IDs, node names, credentials, or infrastructure identifiers.
