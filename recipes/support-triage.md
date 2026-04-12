# Recipe: Support Ticket Triage

## Scenario

Route support requests from a form, email parser, or webhook into categorized queues with optional AI summarization and escalation.

## Suggested node sequence

1. Trigger
2. Extract or normalize ticket fields
3. AI summary and category suggestion
4. Severity classification
5. Conditional routing
6. Ticket creation or update
7. Team notification
8. Failure path

## High-value follow-ups

- What defines severity?
- Which queues or teams should receive each category?
- Should responses be internal-only or customer-facing?
- Should the workflow auto-tag, auto-assign, or only recommend?
