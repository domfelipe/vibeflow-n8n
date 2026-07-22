# Vibeflow policy reference

| ID | Default | Meaning | Minimum repair |
|---|---|---|---|
| VF000 | error | Invalid workflow export | Export valid n8n JSON with a `nodes` array. |
| VF001 | error | Literal secret in parameters | Use n8n credentials, a vault, or an environment expression. |
| VF002 | error | Host-level node | Remove it or explicitly approve the node type in policy. |
| VF003 | warning | Webhook without supported auth and a credential reference | Add header/basic/JWT auth backed by an n8n credential. |
| VF004 | warning | External action without a connected failure path | Connect a `continueErrorOutput` branch or configure `settings.errorWorkflow`. |
| VF005 | warning | Inbound side effects without an atomic deduplication gate | Use a claim that emits no item for duplicates, such as `INSERT ... ON CONFLICT DO NOTHING ... RETURNING`, on every path. |
| VF006 | error | An AI entry path bypasses the structural kill switch | Put a real IF/Switch/Code gate that reads agent status on every entry path. |
| VF007 | warning | AI Agent without a reachable external handoff action | Add a downstream ticket, chat, email, or equivalent human escalation action. |
| VF008 | warning | Missing or excessive execution timeout | Set the workflow timeout between 1 and 3600 seconds. |
| VF009 | warning | Unsafe retry policy | Add idempotency, bound attempts, and configure backoff. |
| VF010 | error | Money or privileged action lacks verified policy evidence | Declare the action and connect dominating approval, durable audit, atomic idempotency, limits where applicable, failure notification, and recovery. |
| VF011 | warning | Customer communication or destructive write lacks an outcome contract | Declare the impact and connect durable audit, atomic idempotency, failure notification, and recovery evidence. |
| VF012 | warning | Connected error path terminates silently | Route the action's error output to a recognized operator alert, ticket, incident, or escalation node. |
| VF013 | warning | High-impact write has no recovery contract | Declare compensation, rollback, or replay and reference the implementing node. |

Configuration changes severity or domain vocabulary; it does not prove the suppressed risk is safe. Keep waivers visible in `.vibeflow.json` and explain them in the pull request.

Outcome contracts are static evidence. Runtime systems must still authorize approvers, enforce limits and counterparties server-side, create durable audit entries before acting, deduplicate atomically, and test recovery behavior.
