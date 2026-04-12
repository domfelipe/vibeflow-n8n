# Example Walkthroughs

## Walkthrough 1: Lead qualification

### User request
Create an n8n workflow that receives a website lead, summarizes the lead using AI, classifies urgency, sends hot leads to Slack, and saves all leads in Airtable.

### Agent follow-up questions
1. What triggers the workflow: webhook, form, or CRM event?
2. How should a hot lead be defined?
3. Should Airtable create new records only or update existing ones?
4. Which Slack channel should receive hot leads?

### Normalized plan summary
- trigger: webhook
- systems: OpenAI, Slack, Airtable
- duplicate strategy: upsert by email
- alert rule: hot if urgency score >= 8
- fallback: notify ops on failure

### Delivery excerpt
Workflow created with webhook trigger, AI enrichment, urgency classification, hot lead branch, Slack notification, Airtable upsert path, and failure alert stub.

## Walkthrough 2: Weekly finance digest

### User request
Every Monday morning, collect unpaid invoices from the ERP, summarize totals by customer, and send the finance team a Slack digest.

### Critical follow-ups
1. What ERP or source system holds the invoice data?
2. What timezone should Monday morning use?
3. Should the digest include overdue aging buckets?
4. Is Slack the only output?

### Plan summary
- trigger: schedule weekly
- output: internal Slack digest
- data grouping: by customer and due bucket
- caution: no customer-facing messages
