# Architecture

## Purpose

Vibeflow n8n is a skill-first architecture for building complete n8n workflows through MCP-capable coding agents.

It is not a standalone runtime.
It is a reusable behavioral layer that can be attached to different agent clients.

## High-level components

### 1. User
The human describes the automation goal in natural language.

### 2. Agent client
A CLI or coding assistant that supports:
- custom instructions / skills,
- MCP connections,
- conversational follow-ups,
- optional local file awareness.

Examples:
- Codex CLI
- Claude Code
- OpenCode
- compatible community forks

### 3. Vibeflow skill layer
This repository provides the skill logic:
- how to interview the user,
- how to normalize requirements,
- how to decide what must be asked,
- how to create a plan,
- how to validate the build,
- how to report completion.

### 4. n8n MCP server
The execution bridge between the agent and n8n.

The skill does not directly manipulate n8n internals.
It relies on the MCP-exposed capabilities available in the connected environment.

### 5. n8n instance
The target automation environment where workflows are created, updated, and later run.

## Core architecture pattern

```text
User intent
   -> Conversational intake
   -> Normalized plan
   -> MCP build actions
   -> Validation pass
   -> Human-readable handoff
```

## Why planning-first matters

Without a planning step, agents tend to:
- over-assume missing requirements,
- create brittle node graphs,
- hide unresolved credential problems,
- return workflows that are technically created but operationally confusing.

The plan acts like a blueprint before the steel beams go up.

## Build stages

### Stage 1. Intake
The agent captures:
- business goal,
- trigger,
- systems involved,
- desired output,
- rules and exceptions.

### Stage 2. Requirement triage
The agent separates:
- critical unknowns,
- optional detail,
- safe defaults.

### Stage 3. Normalized plan
The agent produces a standard structure for execution.
This makes behavior portable across clients.

### Stage 4. MCP execution
The agent creates or updates the workflow using the available MCP tools.

### Stage 5. Validation
The agent checks for:
- broken graph structure,
- missing dependencies,
- unsupported assumptions,
- absent failure branches,
- unresolved placeholders.

### Stage 6. Delivery
The agent produces a report for the user that is operational, not ornamental.

## Recommended workflow object model

A normalized plan should include:
- workflow_name
- workflow_mode
- business_goal
- trigger
- systems_involved
- steps
- branching_logic
- data_contracts
- credentials_required
- risk_flags
- error_handling
- test_strategy
- assumptions
- open_questions

## Modes

### fast
Prototype-first mode.
Uses more defaults and fewer follow-up questions.

### balanced
Default mode.
Good mix of speed and operational sanity.

### safe
More explicit approvals, stronger validation, fewer silent assumptions.

## Portability strategy

The repository is intentionally text-first.
That means:
- prompts are markdown,
- rules are markdown,
- examples are markdown,
- client-specific notes are lightweight.

This keeps the project easy to adapt across agent ecosystems without locking it to a single vendor format.

## Non-goals

This repository does not try to:
- replace n8n documentation,
- replace the n8n MCP server,
- become a full workflow execution engine,
- hide MCP limitations,
- generate production security posture automatically.

## Future architecture extensions

Potential future additions:
- schema-driven plan JSON
- linter rules for anti-pattern detection
- recipe loader / scenario packs
- test case generator
- workflow diff summarizer
- upgrade assistant for existing workflows
