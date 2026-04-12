# Example Final Report

## Summary
A workflow named `Lead Intake and Triage` was created to receive incoming lead data, score urgency using AI, send high-priority leads to Slack, and store all leads in HubSpot.

## What was created
- Webhook trigger for incoming lead payloads
- Validation step for required lead fields
- AI scoring and summarization step
- Conditional branch for hot leads
- Slack notification for hot leads
- HubSpot create/update action
- Generic failure notification path

## Assumptions used
- Lead uniqueness is based on email
- Slack notifications are required only for hot leads
- Missing optional fields do not block processing

## Manual setup still required
- Connect OpenAI credentials
- Connect Slack credentials
- Connect HubSpot credentials
- Review final field mappings for HubSpot properties

## How to test
1. Send a sample payload to the webhook
2. Confirm the AI score is produced
3. Verify hot leads appear in Slack
4. Verify the record is stored in HubSpot
