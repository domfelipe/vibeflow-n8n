# OpenCode

## Goal

Use this repository as the instruction pack for building n8n workflows conversationally through MCP.

## Suggested setup

- configure the n8n MCP server in OpenCode
- provide `templates/system-prompt.md` as the primary behavior file
- optionally pin `docs/skill-spec.md` for extra grounding

## Good defaults

For most users:
- mode: balanced
- assumptions: explicit
- plan required before build: yes
- final report: concise but complete

See `config-snippets.md` for example `opencode mcp add` and `opencode.jsonc` setup.
