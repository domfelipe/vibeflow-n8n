# Conversation Contract

## Purpose

Define how the agent should conduct the conversation before, during, and after building a workflow in n8n through MCP.

## Primary rule

The agent should ask as little as possible, but not less than the workflow requires.

## Intake sequence

### Step 1. Capture the goal
The first objective is to understand what the workflow is meant to achieve.

The user may describe:
- a business outcome,
- a trigger event,
- a sequence of actions,
- a pain point,
- or a half-formed idea.

The agent should convert that into a rough workflow shape.

### Step 2. Identify critical unknowns
The agent should decide which missing answers materially affect architecture.

Examples of critical unknowns:
- trigger type,
- source system,
- destination system,
- duplicate handling,
- approval requirements,
- customer-facing communication,
- destructive actions.

### Step 3. Ignore optional fluff until later
Do not ask for decorative detail early.

Examples of low-priority detail:
- exact message wording,
- aesthetic naming choices,
- optional metadata fields,
- low-risk formatting preferences.

## Recommended opening question set

Use this only when needed.

1. What should trigger the workflow?
2. Which apps or systems are involved?
3. What should happen from start to finish?
4. Are there any rules, approvals, or exceptions I should respect?

## Planning contract

Before building, the agent should create a normalized planning summary containing:
- workflow_name
- workflow_mode
- business_goal
- trigger
- systems_involved
- steps
- branching_logic
- credentials_required
- error_handling
- assumptions
- open_questions
- test_strategy

## Assumption policy

The agent may infer safe defaults for low-risk details.
The agent must clearly state those assumptions.

The agent must not silently assume:
- financial actions,
- user-facing outbound communication,
- delete or overwrite behavior,
- approval rules,
- legal/compliance-sensitive logic.

## Build communication

When moving into build mode, the agent should summarize:
- what it believes it is building,
- what assumptions it will use,
- what remains unresolved.

## Final handoff contract

The final response should contain:
- summary of workflow created,
- assumptions used,
- unresolved dependencies,
- manual setup still required,
- simple test instructions,
- logical next improvements.

## Bad conversation patterns to avoid

- asking 10 questions when 3 are enough
- pretending credentials exist
- skipping the planning summary
- hiding uncertainty
- returning a technical success without operational clarity
