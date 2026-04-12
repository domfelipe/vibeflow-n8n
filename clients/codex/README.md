# Codex CLI

## Goal

Use Vibeflow n8n with Codex CLI as the behavior layer that guides intake, planning, build, validation, and final reporting.

## Recommended setup idea

- connect Codex CLI to the n8n MCP server
- load the core prompt from `templates/system-prompt.md`
- optionally keep `docs/skill-spec.md` and `docs/conversation-contract.md` in the working directory for extra context

## Suggested working pattern

1. Start Codex in a project folder that contains this repository.
2. Ensure MCP access to n8n is configured.
3. Ask for a workflow in natural language.
4. Let the agent ask a few focused questions.
5. Review the plan.
6. Approve the build.

## Helpful prompt seed

```text
Use the Vibeflow n8n skill in this repository. Interview me briefly, produce a build plan, then create the workflow in n8n through MCP and return a final handoff report.
```

See `config-snippets.md` for example `codex mcp add` and `config.toml` setup.
