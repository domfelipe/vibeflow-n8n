# Product brief

## Product

Vibeflow is an open-source safety and contract gate for exported n8n workflows, especially customer-facing workflows produced or edited by coding agents.

## Problem

Natural-language workflow generation is now common. The remaining failure is operational: a structurally valid workflow can still leak a credential, answer while disabled, duplicate a side effect, lack a human fallback, retry unsafely, run forever, issue a refund, notify a customer, or destroy data without the required controls.

Existing builders and MCP servers should keep building. Vibeflow checks the result before production.

## Primary users

- n8n maintainers reviewing generated workflow changes;
- automation consultancies shipping customer-facing agents;
- platform teams enforcing workflow policy in pull requests;
- coding agents that need deterministic feedback rather than another prompt.

## Promise

Given an exported workflow, produce a reproducible pass/fail report with concrete remediation and no network access.

## Version 0.9 scope

- dependency-free Node.js CLI;
- text, JSON, and SARIF output;
- configurable VF000-VF013 policies;
- outcome contracts for money, customer, privileged, and destructive-data actions;
- structural checks for approval, durable audit, idempotency, limits, failure notification, and recovery;
- safe and unsafe support and refund fixtures;
- GitHub Action;
- Codex skill and plugin package.

## Non-goals

- generating workflows;
- replacing n8n, n8n-mcp, or workflow-as-code tools;
- executing or mutating live workflows;
- proving runtime correctness;
- hosting a SaaS dashboard.

## Differentiation

Vibeflow starts with policies learned from real operations: an off switch before inference, human handoff after low-confidence output, duplicate-event protection, explicit error paths, bounded retries, trust-boundary hygiene, and declared controls around real-world outcomes. It asks not only whether the workflow is valid JSON or uses a suspicious node, but what it can do when input is messy or a model is wrong.

## Evidence gate

The project is ready to launch when its own safe fixture passes, unsafe fixture fails, plugin validates, package packs, and CI is green. It becomes a strong Codex for Open Source candidate only after external usage and maintainer work are visible.
