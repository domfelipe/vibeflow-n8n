# Release audit — v0.8.0

Date: 2026-07-22

## Decision

**APTO COM RESSALVAS** for the first public executable release.

No blocking defect remains in the reviewed static-analysis boundary. The remaining caveats require runtime or node-specific knowledge that an exported JSON gate cannot prove.

## QA evidence

- 26 automated tests pass, including one safe and one intentionally unsafe workflow.
- The safe fixture produces zero findings; the unsafe fixture produces VF001-VF009.
- Text, JSON, and SARIF output paths are exercised.
- Node 20, 22, and 24 are required in CI; local verification used the available Node runtime and the remote matrix is the release gate.
- JSON/YAML parsing, package dry-run, official skill/plugin validators, `npm audit`, and `git diff --check` are part of the final gate.

## Red Team

The first implementation was rejected. Regression tests now cover the reproduced bypasses:

- declared webhook authentication without the matching credential reference;
- literal secrets in raw headers, URLs, expressions, pinned data, and static data;
- disconnected, nominal, or non-gating idempotency controls;
- parallel AI paths that bypass a kill switch, inverted or constant conditions, and decorative Code/NoOp nodes;
- resource connections misread as control flow and fabricated connection shapes;
- disconnected or cyclic error handling;
- read-only HTTP requests mislabeled as handoff;
- excessive or non-numeric timeouts and unsafe retry settings;
- policy weakening from an untrusted checkout;
- terminal-control injection, deep JSON, excessive nodes/edges/files/config terms, finding amplification, and quadratic traversal.

At the 5,000-node limit, the corrected linear traversal completed the synthetic chain in tens of milliseconds on the development machine. Finding truncation always adds blocking VF000.

## Supply chain

- GitHub-owned actions are pinned to full verified commit SHAs.
- Checkout credentials are not persisted; workflow permissions are `contents: read`.
- Jobs have a ten-minute timeout and package installation ignores scripts.
- The package has no runtime dependencies and uses a publish allowlist.
- The bundled action always enables `--locked`.

The first merge SHA, `4998605ed7dc12b9b867d69d7005d25778c7e109`, pins the CLI, GitHub Action, and Codex marketplace examples before the release tag is created.

## Residual limitations

- Static analysis cannot prove a referenced credential exists or works.
- SQL and IF checks are high-confidence structural evidence, not runtime execution proofs.
- An HTTP POST labeled as a ticket or handoff may still fail or target the wrong service.
- Unknown community nodes may require a new side-effect adapter and regression fixture.
- Repository owners must still review changes to the CI workflow itself.

The official Codex Security workspace was opened, but its setup was never submitted through the app interface; no result from that scanner is claimed here. The release decision is based on the direct QA, independent Red Team, supply-chain review, and regression evidence above.
