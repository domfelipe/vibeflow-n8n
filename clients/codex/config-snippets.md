# Codex CLI config snippets

These snippets are examples. Replace placeholder URLs and names with your real n8n MCP configuration.

## Option 1: add with CLI

```bash
codex mcp add n8n --url https://YOUR-N8N-MCP-ENDPOINT
codex mcp list
```

## Option 2: add in config file

Project-scoped or user-scoped configuration can live in `~/.codex/config.toml` or `.codex/config.toml`.

```toml
[mcp_servers.n8n]
url = "https://YOUR-N8N-MCP-ENDPOINT"
```

## Optional instruction in AGENTS.md

```text
Always use the n8n MCP server when the request is about creating, updating, validating, or testing n8n workflows. Before building anything, produce a normalized plan that matches schemas/plan.schema.json.
```

## Suggested first prompt

```text
Use the Vibeflow n8n skill in this repository. Interview me briefly, produce a normalized plan, then build the workflow in n8n through MCP and finish with a concise handoff report.
```
