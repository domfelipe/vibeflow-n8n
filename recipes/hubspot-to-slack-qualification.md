# Recipe: HubSpot to Slack Qualification

## Goal

Create an n8n workflow that listens for new or updated HubSpot leads, evaluates qualification rules, and sends only promising leads to Slack with a concise summary.

## Why it demos well

- popular stack
- simple trigger, filter, and notification pattern
- easy to narrate as a sales ops use case

## Suggested steps

1. Trigger on lead created or updated
2. Map company, role, source, and score fields
3. Apply qualification rules
4. Send qualified leads to Slack
5. Log non-qualified leads for later review
6. Emit failure alerts when processing breaks

## Critical questions

- Which HubSpot event should trigger the flow?
- What rules define a qualified lead?
- What Slack channel should receive alerts?
- Should the workflow update HubSpot properties too?

## Safe defaults

- qualify by score threshold and role/company fit
- send concise Slack message with source and score
- log rejected leads to a review table
- leave CRM write-back optional
