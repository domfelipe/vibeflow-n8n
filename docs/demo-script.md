# Demo Script

Use this script to record a short terminal demo, GIF, or narrated walkthrough.

## Goal

Show that Vibeflow n8n turns a plain-language request into a structured plan and a workflow build process.

## Recommended demo length

- 30 to 60 seconds for a GIF
- 90 to 180 seconds for a narrated video

## Suggested scenario

"Build an n8n workflow that watches Slack mentions, creates a triage page in Notion, alerts the ops channel for urgent items, and stores a summary for later reporting."

## Demo sequence

### 1. Open the repo
Show the key files:
- `templates/system-prompt.md`
- `docs/conversation-contract.md`
- `recipes/slack-to-notion-triage.md`

### 2. Start the agent
Show the agent receiving a natural-language request.

### 3. Intake questions
Capture a short question set such as:
- Which Slack channel or mention pattern should trigger the workflow?
- What counts as urgent?
- What Notion database should receive the item?
- Should failures notify Slack or email?

### 4. Plan output
Show the normalized plan with these visible sections:
- objective
- trigger
- steps
- branching logic
- credentials needed
- validation plan

### 5. Build handoff
Show the agent summarizing what it is about to create in n8n.

### 6. Workflow view
Capture the n8n canvas or a placeholder workflow image.

### 7. Final report
Show a concise final handoff report listing:
- what was created
- assumptions used
- missing credentials
- how to test it

## Recording tips

- keep the terminal font large
- hide secrets and account names
- use a short but realistic workflow request
- crop tightly and avoid idle pauses
- prefer one clean storyline over many cuts
