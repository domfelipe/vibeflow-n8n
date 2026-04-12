# Publishing Guide

## 1. Choose the repo shape

Recommended public repository name:

- `vibeflow-n8n`

## 2. Add baseline project files

Recommended extras:

- `LICENSE`
- `.gitignore`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `SECURITY.md`

## 3. First release scope

Keep v1 small and useful:

- one main system prompt,
- one conversation contract,
- one delivery template,
- examples for common workflow requests,
- setup snippets for Codex, Claude Code, and OpenCode.

## 4. What to show in the README

The homepage should answer quickly:

- What is this?
- Who is it for?
- How does it work?
- Which clients are supported?
- How do I install it?
- How do I use it?
- What are the limitations?

## 5. Suggested release roadmap

### v0.1.0
- public repo
- core prompt and docs
- 3 examples

### v0.2.0
- client-specific setup guides
- stronger validation checklist
- workflow naming conventions

### v0.3.0
- recipe library
- vertical templates: support, CRM, AI agents, finance ops

### v1.0.0
- stable docs
- broad examples
- community contribution guide

## 6. Community strategy

Useful GitHub labels:

- `good first issue`
- `template-request`
- `client-support`
- `docs`
- `examples`
- `bug`
- `enhancement`

## 7. Good demo ideas

Use examples that are instantly understandable:

- Typeform -> AI summary -> Slack -> Airtable
- Gmail -> classify with AI -> route to Notion
- Webhook -> validate -> score -> HubSpot
- Schedule -> fetch API -> transform -> Google Sheets

## 8. Keep the promise narrow

Do not promise that the agent can fully solve:

- missing credentials,
- closed-source app quirks,
- broken third-party APIs,
- runtime approvals/human loops through MCP-triggered execution.

## 9. Badges you may want

- License
- Release
- Docs status
- MCP compatible
- n8n compatible

## 10. Launch checklist

- README clear and short
- examples tested
- client instructions readable
- limitations explicit
- sample prompts included
