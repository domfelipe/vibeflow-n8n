# Example Plans

## Example 1 Plan

- Workflow name: Lead Intake and Triage
- Trigger: Webhook
- Systems: Webhook, OpenAI, Slack, HubSpot
- Steps:
  - Receive lead payload
  - Validate required fields
  - Score and summarize with AI
  - Branch on urgency
  - Notify Slack for hot leads
  - Upsert lead in HubSpot
- Error handling:
  - Return validation error on missing fields
  - Send Slack alert on workflow failure

## Example 2 Plan

- Workflow name: Daily Orders Digest
- Trigger: Schedule weekdays 08:00
- Systems: HTTP API, Code/Transform, Microsoft Teams
- Steps:
  - Run on schedule
  - Fetch yesterday's orders
  - Aggregate totals and deltas
  - Generate concise summary
  - Post digest to Teams
