# Release audit — v0.9.0 candidate

Target release: 2026-07-24

## Decision

**APTO COM RESSALVAS** for the Friday release, pending the remote CI and released-install checks listed below.

No blocking defect remains in the reviewed static-analysis boundary. Vibeflow can verify structural evidence in an exported workflow, but it cannot enforce authorization, amount limits, counterparty identity, audit durability, or recovery behavior in the executing systems.

## QA evidence

- 36 automated tests pass, including safe and unsafe support workflows and a fully contracted refund workflow.
- The unsafe refund fixture detects an ordinary HTTP node as a money outcome and produces VF010, VF012, and VF013.
- The contracted refund fixture exits 0 in normal and `--locked` modes.
- Text, JSON, SARIF, configuration validation, package packing, and CLI exit behavior are exercised.
- `npm run verify`, `npm audit --omit=dev`, JSON parsing, and `git diff --check` pass locally.
- The package remains dependency-free and targets Node.js 20+.

## Red Team

The first v0.9 implementation was hardened after adversarial review. Regression tests now cover:

1. ordinary HTTP refunds that would evade a dangerous-node-only policy;
2. read-only refund queries, preventing an obvious classifier false positive;
3. named or disconnected approval, amount, counterparty, audit, and idempotency controls;
4. constant approval conditions and decorative amount values;
5. read-only or fail-open audit nodes, including an audit error branch that still reaches the action;
6. fail-open idempotency nodes and idempotency error branches that still reach the side effect;
7. prototype-like contract keys, self-referential notification/recovery evidence, and audit-like labels used to hide a money action;
8. connected error paths that terminate without a recognized operator notification.

The graph checks use actual `main` edges, require dominating controls, and reject evidence that reaches the action after the control itself fails.

## Guardião security review

### In scope

- local CLI parsing of untrusted workflow/configuration JSON;
- graph and parameter analysis;
- text, JSON, and SARIF output;
- npm package contents, GitHub Action boundary, and Codex plugin instructions.

### Controls confirmed

- no runtime dependencies, telemetry, hosted service, or live n8n mutation;
- no workflow expressions or embedded code are evaluated;
- no URLs found in a workflow are contacted;
- file, node, edge, contract, vocabulary, and finding budgets are bounded;
- terminal text is sanitized and prototype-like contract keys are handled as data;
- the GitHub Action uses locked policy mode so a pull request cannot disable its own built-in checks;
- examples contain credential references and reserved invalid domains, not live secrets.

### Residual limitations

- an exported graph cannot prove a referenced credential, approval identity, SQL policy, external API limit, notification, or compensation works at runtime;
- custom/community nodes may need explicit impact declarations or new regression-backed adapters;
- repository owners may intentionally weaken policy outside `--locked` mode;
- remote Node 20/22/24 CI and released `npx`/plugin installation can only be confirmed after the candidate is pushed and tagged.

## Release blockers

- [ ] Pull request CI passes on Node.js 20, 22, and 24.
- [ ] Release commit is merged without unrelated changes.
- [ ] `v0.9.0` tag and GitHub release are published on 2026-07-24.
- [ ] Released CLI and Codex plugin install paths are smoke-tested.

## Final gate

There are zero known critical or high security findings in the local candidate. The release remains **APTO COM RESSALVAS** until the four remote gates above are complete; a failed gate blocks publication or requires an immediate corrective release.
