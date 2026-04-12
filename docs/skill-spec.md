# Skill Specification

## Goal

Enable an AI coding agent to create, update, and validate complete n8n workflows through MCP, using a conversational intake process and a planning-first approach.

## Primary user promise

The user describes what they want.
The agent asks only the minimum useful questions.
The agent produces a plan.
The agent builds the workflow in n8n.
The agent returns a clear handoff report.

## Inputs

### Required
- workflow goal

### Usually required
- trigger type
- connected apps/services
- expected final output

### Sometimes required
- schedule/frequency
- payload schema
- approval logic
- credential ownership
- fallback behavior
- notification behavior
- testing sample

## Outputs

The skill should return:

1. a structured plan,
2. a summary of assumptions,
3. the workflow creation/update result,
4. unresolved dependencies,
5. a validation report,
6. a concise next-step checklist.

## Operational sequence

### 1. Intake
Start with the user goal.
Extract likely workflow shape.
Ask only high-impact follow-up questions.

### 2. Plan
Before touching n8n, generate a normalized plan object with:

- workflow_name
- business_goal
- trigger
- systems_involved
- steps
- branching_logic
- data_required
- credentials_required
- error_handling
- test_strategy
- open_questions
- assumptions

### 3. Build via MCP
Use the n8n MCP tools to:

- create a new workflow or update an existing one,
- add the correct trigger,
- add named nodes with sensible ordering,
- wire success and failure paths,
- add comments/descriptions where helpful,
- preserve placeholders where credentials or secrets are missing.

### 4. Validate
Check for:

- disconnected nodes,
- missing required fields,
- invalid trigger assumptions,
- absent credential references,
- branches with no terminal behavior,
- missing error handling where failure is likely.

### 5. Deliver
Provide:

- what was created,
- what assumptions were used,
- what still requires manual setup,
- how to test the workflow,
- what upgrades would make sense next.

## Guardrails

### The skill must
- prefer asking fewer but better questions,
- distinguish between critical unknowns and optional details,
- state assumptions explicitly,
- avoid pretending credentials exist when they do not,
- avoid claiming execution success without validation evidence,
- keep the workflow understandable for humans.

### The skill must not
- over-interview the user,
- hide missing data,
- create needlessly complex node graphs,
- skip the planning stage,
- silently invent production credentials.

## Defaults policy

The skill may infer safe defaults for:

- workflow naming,
- timezone if supplied elsewhere in context,
- retry behavior,
- notification formatting,
- low-risk field mappings,
- common error branches.

The skill must ask before assuming for:

- legal/compliance-sensitive logic,
- destructive actions,
- billing/payment side effects,
- approval rules,
- CRM upsert vs create-only behavior,
- external communications that could spam users.

## Recommended modes

### fast
Minimum questions, maximum assumptions, optimized for prototypes.

### balanced
Default mode. Good production-minded assumptions with limited follow-ups.

### safe
More validation, more explicit approvals, better for real operations.

## Success criteria

A good run means:

- the workflow structure matches the user intent,
- the workflow is understandable,
- missing pieces are clearly called out,
- the user can continue from the final report without confusion.
