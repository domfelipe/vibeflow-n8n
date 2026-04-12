# Install and Setup

This document gives practical setup guidance for each supported client. Keep credentials and secret values out of the repository whenever possible.

## Shared prerequisites

Before setting up a client, make sure you have:
- a working n8n instance
- access to its MCP server or MCP-enabled endpoint
- a client that supports MCP
- a place to store client-level config and auth safely

## Recommended setup pattern

1. Configure the n8n MCP server in the client.
2. Keep this repository in the working directory.
3. Reference `templates/system-prompt.md` and `docs/conversation-contract.md`.
4. Ask the agent to emit a normalized plan before it builds.
5. Test with one recipe.

## Codex CLI

See `clients/codex/config-snippets.md`.

## Claude Code

See `clients/claude-code/config-snippets.md`.

## OpenCode

See `clients/opencode/config-snippets.md`.

## OpenClaude and forks

See `clients/openclaude/config-snippets.md`.

## Secrets and auth

Prefer one of these patterns:
- client-managed OAuth flow
- environment variables referenced by the client config
- local machine secret manager

Avoid putting raw secrets in:
- repository-tracked JSON files
- prompt templates
- examples intended for public publication
