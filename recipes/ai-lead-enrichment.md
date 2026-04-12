# Recipe: AI Lead Enrichment

## Goal

Capture a new inbound lead, enrich the company context, generate a short structured summary, score the lead using simple rules, and write the result to the CRM.

## Typical trigger

- new CRM lead
- form submission
- webhook from a landing page

## Systems involved

- CRM such as HubSpot or Pipedrive
- enrichment source such as Clearbit-like data or internal lookup
- optional LLM step for summarization
- Slack for alerts

## Core steps

1. Receive the lead payload.
2. Normalize fields such as company name, email domain, and source.
3. Query enrichment data.
4. Generate a concise structured summary.
5. Apply a scoring rule based on company size, geography, and source.
6. Update the CRM record.
7. Notify Slack if the lead crosses a threshold.

## Important assumptions

- scoring starts with safe defaults
- enrichment can fail without blocking the whole workflow
- missing optional fields should not break CRM updates

## What makes this recipe good for demos

- shows practical AI usage
- stays grounded in business logic
- produces an output people immediately understand

## Validation checklist

- lead payload is parsed correctly
- enrichment failures are captured clearly
- summary format is stable
- score thresholds are visible and editable
- CRM update succeeds even when optional data is missing
