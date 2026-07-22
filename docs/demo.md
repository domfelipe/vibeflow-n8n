# Reproducible demo

## Safe workflow

```bash
node bin/vibeflow.mjs check examples/safe-support-agent.workflow.json
```

Expected result: exit `0`, zero findings.

## Unsafe workflow

```bash
node bin/vibeflow.mjs check examples/unsafe-support-agent.workflow.json --fail-on never
```

Expected result: VF001-VF009 findings covering secrets, dangerous nodes, webhook authentication, error handling, idempotency, AI safety, timeouts, and retries.

## Automation output

```bash
node bin/vibeflow.mjs check examples/unsafe-support-agent.workflow.json --format json --fail-on never
node bin/vibeflow.mjs check examples/unsafe-support-agent.workflow.json --format sarif --output vibeflow.sarif --fail-on never
```

For pull requests or other untrusted checkouts, add `--locked`. The bundled GitHub Action does this automatically.

## Full project gate

```bash
npm run verify
```
