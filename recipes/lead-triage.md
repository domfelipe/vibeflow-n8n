# Recipe: Lead Triage with AI Enrichment

## Scenario

A user wants to capture incoming leads, enrich them with AI, classify urgency, notify a team, and store the lead in a structured system.

## Typical trigger

- webhook
- form submission
- CRM new record

## Systems involved

- form tool or webhook source
- AI provider
- Slack or email
- Airtable / HubSpot / CRM

## Suggested intake questions

1. What triggers the workflow?
2. Where should the lead be stored?
3. How should hot leads be defined?
4. Who should be notified and where?
5. Should the workflow create-only or upsert existing leads?

## Suggested node sequence

1. Trigger
2. Normalize payload
3. AI enrichment / classification
4. Conditional branch by priority
5. Notification for high priority
6. Store record
7. Error notification branch

## Common risks

- duplicate lead creation
- unclear hot/warm/cold criteria
- missing CRM identifiers
- over-broad notifications

## Validation checklist

- priority branch exists
- CRM mapping is explicit
- alert channel is defined
- duplicate strategy is stated
- missing credential placeholders are visible
