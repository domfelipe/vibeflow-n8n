---
name: vibeflow
description: Audit and repair exported n8n workflow JSON with deterministic safety and contract checks. Use when reviewing AI-generated or customer-facing n8n workflows before deployment, investigating Vibeflow VF000-VF009 findings, adding kill switches or human handoffs, checking secrets, retries, and webhook exposure, or preparing workflow changes for CI and pull requests.
---

# Vibeflow

Use the CLI as the source of truth. Do not infer that a workflow is safe from its README, prompt, or visual layout.

## Workflow

1. Locate the exported workflow JSON. Never inspect or mutate a live production workflow unless the user explicitly requests it.
2. Run Vibeflow from a repository checkout:

   ```bash
   node bin/vibeflow.mjs check path/to/workflow.json
   ```

   For a released version without a checkout:

   ```bash
   npx --yes github:domfelipe/vibeflow-n8n#v0.8.0 check path/to/workflow.json
   ```

3. Read [references/policies.md](references/policies.md) when interpreting or repairing a finding.
4. Fix errors before warnings. Preserve credential references, expressions, node IDs, and unrelated workflow behavior.
5. Re-run the check after every repair. Stop only when blocking findings are gone or explicitly waived in `.vibeflow.json` with a documented reason.
6. Report changed nodes, remaining warnings, and what still needs runtime validation in n8n.

## Safety boundaries

- Never copy literal credentials into a workflow to silence `VF001`.
- Never disable `VF006` for customer-facing agents without explicit user approval; an off switch must block inference and all AI responses.
- Treat static analysis as a preflight, not proof of runtime correctness.
- Prefer fixing a shared upstream node over duplicating guards across branches.
- Keep fixes local to the exported workflow until the user authorizes deployment.

## Output

Return the CLI result, the smallest safe repair, and any unresolved runtime check. Use SARIF for GitHub code scanning and JSON for automation.
