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

## Dangerous outcome

```bash
node bin/vibeflow.mjs check examples/unsafe-refund.workflow.json --fail-on never
```

Expected result: the ordinary HTTP refund node triggers blocking VF010 plus VF012 and VF013, even though its node type is not inherently dangerous.

## Contracted outcome

```bash
node bin/vibeflow.mjs check examples/safe-refund.workflow.json \
  --config examples/outcome-contracts.vibeflow.json
```

Expected result: exit `0`, zero findings. The graph contains a dominating atomic claim and durable audit, structural approval/amount/counterparty gates, error notification, and compensation evidence.

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
