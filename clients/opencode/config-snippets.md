# OpenCode config snippets

These snippets are examples. Replace placeholder URLs and names with your real n8n MCP configuration.

## Guided setup

```bash
opencode mcp add
opencode mcp list
```

## Example `opencode.jsonc`

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "n8n": {
      "type": "remote",
      "url": "https://YOUR-N8N-MCP-ENDPOINT",
      "enabled": true
    }
  }
}
```

## Suggested agent instruction

```text
When the task is about n8n workflows, use the n8n MCP server and follow the Vibeflow n8n repository contract. Produce a normalized plan first, then build, validate, and report.
```
