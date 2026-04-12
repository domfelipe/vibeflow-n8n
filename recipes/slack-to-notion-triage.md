# Recipe: Slack to Notion Triage

## Goal

Capture important Slack mentions, classify them, create a Notion item for tracking, and route urgent cases to an escalation channel.

## Typical trigger

- mention of a bot in Slack
- reactions on flagged messages
- specific channel messages matching a pattern

## Systems involved

- Slack
- Notion
- optional AI classification step
- optional email or secondary Slack alert

## Core steps

1. Listen for the configured Slack trigger.
2. Normalize message text, author, channel, and timestamp.
3. Classify urgency and category.
4. Create a Notion page or database item.
5. Route urgent messages to an escalation destination.
6. Write a final status field for reporting.

## Important assumptions

- urgency rules should be explicit and editable
- Notion database schema is known or mapped in advance
- Slack formatting should be simplified before storage

## What makes this recipe good for demos

- looks modern and relatable
- easy to understand visually
- strong before-and-after story from message to tracked item

## Validation checklist

- trigger fires only for intended messages
- urgency logic is deterministic
- Notion fields are mapped correctly
- urgent path and normal path both succeed
- duplicate handling is defined
