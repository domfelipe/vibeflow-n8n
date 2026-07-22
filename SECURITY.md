# Security policy

## Reporting

Use GitHub private vulnerability reporting for this repository. Do not open a public issue containing exploit details, credentials, or customer workflow data.

## Supported versions

Security fixes target the latest tagged release.

## Scope

Vibeflow reads local JSON and optionally writes a caller-selected report. It does not contact n8n, execute workflows, collect telemetry, or upload workflow content.

The secret rule is a defensive heuristic, not a replacement for repository secret scanning. A clean report is not proof of runtime security.
