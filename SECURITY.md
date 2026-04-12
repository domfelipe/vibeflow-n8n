# Security Policy

## Scope

This repository contains prompts, conventions, examples, and packaging guidance for agent-driven workflow creation in n8n.

It does not store production secrets by design.

## Reporting a vulnerability

If you discover a security issue related to:
- secret handling guidance,
- destructive workflow defaults,
- unsafe recipe recommendations,
- risky prompt behavior,

please report it privately before opening a public issue.

Use a private contact method for the maintainer when available.

## Security expectations for contributors

Contributors should avoid introducing guidance that:
- assumes access to credentials that may not exist,
- performs destructive actions without explicit user intent,
- sends external communications without confirmation,
- hides compliance-sensitive assumptions,
- suggests storing plaintext secrets in repo files.

## Safe defaults

The skill should prefer:
- placeholders over fake credentials,
- explicit assumptions over silent guesses,
- confirmation for destructive or externally visible actions,
- human-readable reports for manual review.

## Out of scope

This repository does not guarantee:
- security of any third-party MCP server,
- security of any n8n deployment,
- security of a user's local machine,
- correctness of external vendor SDKs or CLIs.
