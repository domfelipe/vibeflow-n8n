# Codex for Open Source application gate

Application: <https://openai.com/pt-BR/form/codex-for-oss/>

## Current position

Vibeflow is public, MIT-licensed, owned by its principal maintainer, and aligned with Codex maintainer workflows. Version 0.8.0 establishes active engineering evidence but does not manufacture adoption.

**Current decision: do not submit.** The release is live, but the external-usage gate is not yet met.

## Practical submission gate

These are internal quality targets, not official OpenAI thresholds:

- a tagged public release with green CI;
- at least three unrelated external users or teams with verifiable feedback;
- at least one external issue, discussion, or pull request with maintainer activity;
- current traffic, clone, installation, or dependent-project evidence;
- no confidential information in the application.

## Live evidence snapshot

Captured from GitHub on 2026-07-22 immediately after release:

- GitHub stars: 1; ownership is not attributed, so it is not counted as external adoption.
- forks: 0.
- traffic: 2 unique clones in the available 14-day window, both before release and not attributable to external users.
- releases: 1; `v0.8.0` published on 2026-07-22.
- external contributors: 0.
- external users or independent public references: 0 verified.
- maintainer evidence: [PR #1](https://github.com/domfelipe/vibeflow-n8n/pull/1), [PR #2](https://github.com/domfelipe/vibeflow-n8n/pull/2), [release v0.8.0](https://github.com/domfelipe/vibeflow-n8n/releases/tag/v0.8.0), and [launch discussion #3](https://github.com/domfelipe/vibeflow-n8n/discussions/3).

## Form draft

### Role

Principal maintainer.

### Why is this repository eligible?

> Vibeflow is an MIT-licensed safety gate for AI-generated n8n workflows. It catches embedded secrets, unsafe webhooks, missing kill switches, human handoffs, idempotency, error paths, timeouts, and risky retries before deployment. It is maintained as a dependency-free CLI, GitHub Action, and Codex plugin. External usage evidence is not yet sufficient, so submission is intentionally deferred.

### How will API credits be used?

> Credits will support OSS maintenance: generate adversarial workflow fixtures, run reproducible policy evaluations, review contributed rules in pull requests, explain regressions, and prepare release reports. They will not fund a hosted commercial runtime or process private customer workflows.

### Anything else?

> Vibeflow comes from production lessons operating conversational automations in Brazil. It is deliberately interoperable with n8n and existing MCP tooling: it does not replace builders, it checks their output. The project ships without telemetry and keeps workflow analysis local.

## Final verification

Before submitting, capture a fresh evidence snapshot, confirm the GitHub profile and repository remain public, verify each form answer remains under 500 characters, and use accurate current evidence only. Replace the deferral sentence only after the practical submission gate is met.
