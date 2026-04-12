# Real Demo Playbook

Use this playbook when you want a real, credible public demo instead of a static repository tour.

## Goal

Show a full path from plain-English request to final n8n workflow handoff in less than five minutes.

## Suggested demo storyline

1. Start in the terminal with a connected MCP-capable client.
2. Paste a short brief with one trigger, one transformation, and one notification path.
3. Let the agent ask only one to three critical follow-up questions.
4. Show the normalized plan before the build happens.
5. Switch to n8n and show the created workflow.
6. End with the final implementation report.

## Best demo characteristics

- one trigger
- two to five core nodes
- one error path
- one obvious business outcome
- one missing credential called out cleanly

## Good public demo candidates

- support triage to Slack
- invoice reminder workflow
- lead enrichment with CRM update
- Slack to Notion intake sorter

## What to avoid

- giant workflows with many credentials
- fragile scraping flows
- binary-heavy flows for the first public demo
- human approval loops during the live build
- anything that needs ten minutes of setup before value appears

## Demo capture checklist

- terminal font large enough to read in social clips
- n8n canvas zoom at readable level
- one file or pane open with the implementation report
- timestamps or release tags hidden if they look messy
- fake or test credentials only

## Suggested timing

- 30s context
- 60s planning
- 90s build
- 45s n8n review
- 30s final report and next steps

## Closing line

"Describe the workflow. The agent asks only what matters, builds via MCP, and hands back something usable."
