# Contributing

Thanks for contributing to Vibeflow n8n.

We want this project to stay practical, readable, and friendly to contributors.

## What contributions are welcome

- new recipes
- better examples
- client-specific setup improvements
- docs clarifications
- prompt refinements
- validation heuristics
- packaging improvements for open-source distribution

## Contribution principles

- prefer clarity over cleverness
- keep examples realistic
- avoid vendor lock where possible
- document assumptions explicitly
- keep the user experience friendly for non-experts

## Branch naming

Suggested branch prefixes:
- `feat/`
- `fix/`
- `docs/`
- `chore/`
- `recipe/`

Examples:
- `feat/add-plan-schema`
- `docs/improve-opencode-guide`
- `recipe/lead-qualification-pack`

## Pull requests

A good PR should:
- explain the problem,
- describe the change,
- note any breaking behavior,
- include updated docs when needed,
- include an example when behavior changes.

## Documentation expectations

If you change the skill behavior, also update at least one of:
- `docs/skill-spec.md`
- `docs/conversation-contract.md`
- `templates/system-prompt.md`
- `examples/`

## Recipes

When adding a recipe, include:
- scenario summary,
- ideal intake questions,
- suggested node structure,
- common risks,
- validation notes,
- sample final report excerpt.

## Style guide

- use markdown
- keep sections short and scannable
- write for builders, not only prompt engineers
- avoid unnecessary jargon

## Release notes

When your change matters to users, update `CHANGELOG.md`.

## Security-sensitive changes

If your contribution touches secrets, auth, external communication, or destructive actions, also review `SECURITY.md`.
