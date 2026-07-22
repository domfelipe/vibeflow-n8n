# Product brief

## Product

Vibeflow is an open-source safety and contract gate for exported n8n workflows, especially customer-facing workflows produced or edited by coding agents.

## Problem

Natural-language workflow generation is now common. The remaining failure is operational: a structurally valid workflow can still leak a credential, answer while disabled, duplicate a side effect, lack a human fallback, retry unsafely, or run forever.

Existing builders and MCP servers should keep building. Vibeflow checks the result before production.

## Primary users

- n8n maintainers reviewing generated workflow changes;
- automation consultancies shipping customer-facing agents;
- platform teams enforcing workflow policy in pull requests;
- coding agents that need deterministic feedback rather than another prompt.

## Promise

Given an exported workflow, produce a reproducible pass/fail report with concrete remediation and no network access.

## Version 0.8 scope

- dependency-free Node.js CLI;
- text, JSON, and SARIF output;
- configurable VF000-VF009 policies;
- safe and unsafe fixtures;
- GitHub Action;
- Codex skill and plugin package.

## Non-goals

- generating workflows;
- replacing n8n, n8n-mcp, or workflow-as-code tools;
- executing or mutating live workflows;
- proving runtime correctness;
- hosting a SaaS dashboard.

## Differentiation

Vibeflow starts with policies learned from real conversational-agent operations: an off switch before inference, human handoff after low-confidence output, duplicate-event protection, explicit error paths, bounded retries, and trust-boundary hygiene.

## Evidence gate

The project is ready to launch when its own safe fixture passes, unsafe fixture fails, plugin validates, package packs, and CI is green. It becomes a strong Codex for Open Source candidate only after external usage and maintainer work are visible.
