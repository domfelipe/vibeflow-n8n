# Recipe: Customer Support Escalation

## Goal

Create an n8n workflow that watches a support inbox or helpdesk webhook, detects priority signals, enriches the ticket context, and escalates high-risk items to Slack with a clear summary.

## Why it demos well

- obvious business value
- clear trigger and escalation outcome
- easy to explain in less than two minutes
- one branch can demonstrate prioritization logic

## Suggested steps

1. Trigger from webhook or helpdesk event
2. Normalize ticket payload
3. Score urgency using rules or an LLM step
4. Route high-priority items to Slack
5. Log normal-priority items to a sheet or database
6. Add error notifications

## Critical questions

- What tool sends the ticket event?
- What counts as urgent?
- Who should receive escalations?
- Should every item be logged, or only urgent ones?

## Safe defaults

- urgency based on keywords, SLA breach flag, and VIP marker
- Slack notification for high priority only
- spreadsheet log for all processed tickets
- retry once before failure alert
