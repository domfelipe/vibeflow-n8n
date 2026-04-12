# Claude Code config snippets

These snippets are examples. Replace placeholder URLs and names with your real n8n MCP configuration.

## Add a project-scoped HTTP MCP server

```bash
claude mcp add --transport http --scope project n8n https://YOUR-N8N-MCP-ENDPOINT
```

This writes a `.mcp.json` file at the project root.

## Example `.mcp.json`

```json
{
  "mcpServers": {
    "n8n": {
      "type": "http",
      "url": "https://YOUR-N8N-MCP-ENDPOINT"
    }
  }
}
```

## Optional instruction layer

```text
Use the Vibeflow n8n behavior in this repository. Ask only essential workflow questions, generate a normalized plan before any n8n changes, build through the n8n MCP server, and return a concise final report.
```

## Notes

- `local` scope is private to your project entry inside `~/.claude.json`.
- `project` scope creates a versionable `.mcp.json`.
- `user` scope makes the server available across projects.
