# Claude Code

## Goal

Use Vibeflow n8n as a reusable instruction layer for building n8n workflows through MCP.

## Recommended setup idea

- connect Claude Code to the n8n MCP server
- add the prompt from `templates/system-prompt.md` to your skill or instructions layer
- keep the docs folder available so the agent can reference the behavior contract

## Suggested operating mode

The best default is `balanced` mode:
- few but useful questions
- planning before build
- explicit assumptions
- readable delivery report

## Prompt seed

```text
Follow the Vibeflow n8n skill from this repository. Gather the minimum viable requirements, produce a normalized plan, create or update the workflow through MCP, validate it, and give me a concise final report.
```

See `config-snippets.md` for example `claude mcp add --scope project` and `.mcp.json` setup.
