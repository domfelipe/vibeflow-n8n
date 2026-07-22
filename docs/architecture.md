# Architecture

## Data flow

```text
workflow JSON -> parser -> graph + parameter analysis -> findings -> text | JSON | SARIF
```

The CLI reads local files, validates their basic n8n shape, builds forward and reverse node graphs, runs deterministic policies, sorts findings, and sets an exit code from the selected threshold.

## Components

- `bin/vibeflow.mjs`: argument parsing, output selection, and exit codes.
- `src/vibeflow.mjs`: configuration, file discovery, policies, graph traversal, and formatters.
- `.vibeflow.json`: repository policy defaults.
- `schemas/`: editor-facing configuration schema.
- `examples/`: reproducible safe and unsafe workflows.
- `plugins/vibeflow/`: Codex packaging; it calls the same CLI rather than duplicating policy logic.
- `action.yml`: composite GitHub Action using the checked-in CLI.

## Policy model

Rules have a stable ID, default severity, description, and remediation. Trusted local users may change severity, vocabulary, and banned node types. VF000 remains non-configurable because invalid input cannot be audited safely.

Graph policies use the validated n8n `main` connection shape, not node order; AI resource wiring is not control flow. VF005 requires a high-confidence atomic ledger gate that emits no item for duplicate claims and dominates inbound paths to side effects. VF006 rejects any AI entry path that bypasses a positive IF check against a direct agent-status reference. VF007 requires a reachable external handoff action.

VF010-VF013 introduce outcome contracts. High-confidence classification inspects a side-effect node's name, type, operation, URL, and parameters for money, customer communication, privileged access, and destructive-data semantics. Explicit `outcomeContracts` cover domain actions the built-in vocabulary does not recognize.

For a contracted action, the analyzer verifies graph evidence rather than labels alone:

- an atomic idempotency claim dominates the action;
- durable audit storage dominates the action;
- approval, amount, and counterparty guards are IF/Switch nodes with both an allowed route and a route that cannot reach the action;
- the declared failure notification is reachable from the action's error output;
- compensation and rollback nodes are downstream from the action; replay nodes must exist and carry recovery semantics.

Money and privileged outcomes default to blocking VF010. Customer communications and destructive writes default to advisory VF011. Missing recovery and silent error paths are separate findings so teams can triage them independently.

`--locked` rejects configuration that weakens built-in severity, changes safety vocabulary, or removes a default banned node. The GitHub Action always enables locked mode so a pull request cannot silence its own findings by editing `.vibeflow.json`.

## Trust boundaries

Workflow JSON is untrusted input. Vibeflow never evaluates expressions, imports workflow code, runs nodes, follows symlinks during directory discovery, or contacts URLs found in parameters. It caps files, bytes, nodes, edges, configuration vocabulary, and findings; graph traversal is iterative and linear in the validated graph.

Output paths are selected by the caller. The GitHub Action passes inputs as quoted environment values.

## Known limitations

- Static structure cannot prove that a condition, SQL claim, or handoff works at runtime.
- Outcome contracts cannot prove caller authorization, amount calculation, counterparty identity, audit durability, or successful compensation at runtime.
- Automatic outcome classification is intentionally conservative and can miss domain-specific actions; declare them explicitly in configuration.
- Secret detection can miss unusual key names and can produce false positives.
- Community nodes unknown to the side-effect catalog need explicit policy additions.
- Locked mode protects policy content, but repository owners must still review changes to the CI workflow itself.
- Runtime credentials, permissions, network controls, and n8n version compatibility remain outside the report.

These ceilings are deliberate. Add runtime integration only when real users demonstrate that static exports are insufficient.
