# OpenClaude and community forks: config notes

This target is best-effort.

Use these guidelines only if your fork supports:
- MCP connections
- custom instruction or skill layers
- conversational follow-up questions

## Minimal strategy

1. Point your client to the n8n MCP endpoint.
2. Load `templates/system-prompt.md`.
3. Keep `docs/conversation-contract.md` and `schemas/plan.schema.json` available.
4. Test with one simple recipe before using real workflows.

## Compatibility contract

The client should be able to:
- use an MCP server by name
- ask follow-up questions
- emit a structured plan before building
- complete a final handoff report
