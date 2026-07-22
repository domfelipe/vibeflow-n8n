# Vibeflow

[![CI](https://github.com/domfelipe/vibeflow-n8n/actions/workflows/ci.yml/badge.svg)](https://github.com/domfelipe/vibeflow-n8n/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Safety and contract checks for AI-generated n8n workflows.**

Vibeflow answers one question before deployment: **does this workflow deserve to reach production?**

It inspects exported n8n JSON for embedded secrets, dangerous nodes, exposed webhooks, missing failure paths, absent idempotency, unsafe AI paths, unbounded execution, and risky retries.

Vibeflow is not another workflow builder or MCP server. It is a deterministic quality gate for workflows built by people or agents.

## Quick start

```bash
npx --yes github:domfelipe/vibeflow-n8n#4998605ed7dc12b9b867d69d7005d25778c7e109 check workflow.json
```

Or from a checkout:

```bash
node bin/vibeflow.mjs check workflow.json
```

A safe workflow exits `0`. Blocking findings exit `1`; invalid usage exits `2`.

```text
✖ examples/unsafe-support-agent.workflow.json (Unsafe support agent)
  ERROR VF001 [Send response] Literal secret-like value
  ERROR VF002 [Run Shell] Host-level node is blocked
  ERROR VF006 [AI Agent] No upstream kill switch

Checked 1 workflow(s): 3 error(s), 8 warning(s)
```

Run the reproducible fixtures:

```bash
node bin/vibeflow.mjs check examples/safe-support-agent.workflow.json
node bin/vibeflow.mjs check examples/unsafe-support-agent.workflow.json --fail-on never
```

## Policies

| ID | Default | Check |
|---|---|---|
| VF000 | error | Valid n8n workflow JSON |
| VF001 | error | Literal credentials in node parameters |
| VF002 | error | Host-level command, SSH, and local-file nodes |
| VF003 | warning | Webhooks without supported auth and a credential reference |
| VF004 | warning | External actions without a connected failure path |
| VF005 | warning | Inbound side effects without an atomic idempotency claim |
| VF006 | error | AI entry paths that bypass a structural kill switch |
| VF007 | warning | AI paths without a reachable external human handoff |
| VF008 | warning | Workflows without a 1-3600 second execution timeout |
| VF009 | warning | Retries without idempotency, bounds, or backoff |

Static analysis cannot prove runtime correctness. Configure severity and domain vocabulary in `.vibeflow.json`; document every waiver.

Use `--locked` in untrusted CI. It rejects disabled or downgraded rules, changed vocabulary, and removal of default banned node types. The bundled GitHub Action always enables it.

## Automation

```bash
vibeflow check workflow.json --format json
vibeflow check workflow.json --format sarif --output vibeflow.sarif
vibeflow check workflows/ --fail-on warning
```

Directories are searched recursively for `*.workflow.json` files.

### GitHub Action

```yaml
- uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
- uses: domfelipe/vibeflow-n8n@4998605ed7dc12b9b867d69d7005d25778c7e109 # v0.8.0 code
  with:
    path: workflows/
    output: vibeflow.sarif
```

## Codex plugin

```bash
codex plugin marketplace add domfelipe/vibeflow-n8n --ref 4998605ed7dc12b9b867d69d7005d25778c7e109
```

Install **Vibeflow** from the Plugins Directory, then ask:

```text
Use $vibeflow to audit this n8n workflow and fix blocking findings.
```

## Boundaries

No hosted service, new MCP server, workflow generation, telemetry, secret collection, or live n8n mutation. The CLI uses only the Node.js 20+ standard library.

## Documentation

- [Product brief](docs/product-brief.md)
- [Architecture and limitations](docs/architecture.md)
- [Reproducible demo](docs/demo.md)
- [v0.8.0 release audit](docs/release-audit.md)
- [Roadmap](docs/roadmap.md)
- [Codex for Open Source application gate](docs/codex-for-oss-application.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

`v0.8.0` is the first executable release. The original documentation prototype is preserved at `legacy-v0.7.0`.

MIT licensed.
