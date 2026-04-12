# Getting Started

This is the fastest path from zero to first workflow.

## 1. Pick a client

Recommended order:
- Codex CLI
- Claude Code
- OpenCode

If you are testing community forks, start with OpenClaude only after one of the primary clients is working.

## 2. Make the repository available to the agent

Minimum useful context:
- `templates/system-prompt.md`
- `docs/conversation-contract.md`
- `schemas/plan.schema.json`

Good default:
- clone this repo in the same working directory as your automation project.

## 3. Connect the client to n8n via MCP

Use the client-specific notes in `clients/` and keep the n8n MCP endpoint, auth method, and environment variables outside the core prompt.

## 4. Start with one recipe

Use one of the examples in `recipes/` instead of jumping straight into a production-critical workflow.

Recommended first runs:
- support triage
- lead triage
- invoice reminder

## 5. Enforce the plan-first contract

Before the agent creates anything in n8n, it should produce a normalized plan with:
- objective
- trigger
- systems involved
- steps
- branching logic
- credentials needed
- assumptions
- validation plan

Use `schemas/plan.schema.json` as the format contract.

## 6. Approve the build

After reviewing the plan, let the agent:
- create or update the workflow in n8n
- name nodes clearly
- add placeholders when credentials are missing
- return a final report

## 7. Run the first test

Your first test should confirm:
- the trigger is reachable or scheduled correctly
- each branch is connected
- missing credentials are listed clearly
- error paths are explicit
- output nodes match the intended business result

## First prompt to try

```text
Use the Vibeflow n8n skill in this repository. Interview me briefly, produce a normalized plan that matches the schema, then build the workflow in n8n through MCP and finish with a concise handoff report.
```
