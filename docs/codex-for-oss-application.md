# Codex for Open Source — submission pack

Application: <https://openai.com/pt-BR/form/codex-for-oss/>

Program overview: <https://developers.openai.com/community/codex-for-oss>

Program terms: <https://learn.chatgpt.com/docs/codex-for-oss-terms>

Prepared: 2026-07-22

Official form rechecked: 2026-07-22

## Recommendation

Submit in **English**, even through the PT-BR form. OpenAI publishes no language requirement and no evidence that language changes selection odds. English is recommended only to reduce translation friction for a global technical review.

Submit now that v0.9.0 is public. Do not wait for arbitrary star, fork, or PR targets. Vibeflow's strongest evidence is its Codex-native engineering, first real 92-node audit, and a public maintenance loop that turned community feedback into tested policy features.

## Copy-and-paste form

### First name

`Felipe`

### Last name

`Domingues`

### Email

`[FILL PRIVATELY: email associated with the ChatGPT account]`

### GitHub username

`domfelipe`

### GitHub repository URL

`https://github.com/domfelipe/vibeflow-n8n`

### Maintainer role

Select: **Primary maintainer**.

### Why is this repository eligible?

Character count: **356/500**.

> Vibeflow is an MIT-licensed safety gate for AI-generated n8n workflows, rebuilt end-to-end with Codex. It audited a real 92-node workflow in read-only mode, finding 3 blocking risks and 57 warnings. Community feedback then shaped v0.9: outcome-aware checks for refunds, customer actions, silent failures, audit, idempotency, approval, limits, and recovery.

### Interests

Select both:

- **Codex Security**
- **API credits for my project**

### OpenAI Organization ID

`[FILL PRIVATELY: org-...]`

Use the organization that should receive the API credits. Confirm it in the OpenAI Platform before submitting; do not place it in this public document.

### How will API credits be used?

Character count: **390/500**.

> API credits would power OSS maintenance workflows: turn anonymized failures into adversarial fixtures, evaluate new policies, reproduce false positives, review contributed rules, triage issues, and generate release audits. Codex would assist these workflows; the Vibeflow scanner will remain local, dependency-free, telemetry-free, and will not upload or process private customer workflows.

### Anything else we should know?

Character count: **381/500**.

> Vibeflow is a public case study in Codex-native OSS development. Codex drove the project from product repositioning through implementation, adversarial review, remediation, CI, plugin packaging, releases, a real-workflow audit, and the v0.9 response to user feedback. Adoption is early, but the engineering, maintenance history, and real-world evidence are public and reproducible.

## PT-BR review translation

These translations are for review only. Paste the English versions above into the form.

### Repository eligibility

> Vibeflow é um gate MIT de segurança para workflows n8n gerados por IA, reconstruído de ponta a ponta com Codex. Ele auditou em modo somente leitura um workflow real de 92 nós, encontrando 3 riscos bloqueantes e 57 avisos. O feedback da comunidade então moldou a v0.9: checks de resultados reais para reembolsos, ações com clientes, falhas silenciosas, auditoria, idempotência, aprovação, limites e recuperação.

### API-credit use

> Os créditos financiariam fluxos de manutenção OSS: transformar falhas anonimizadas em fixtures adversariais, avaliar novas políticas, reproduzir falsos positivos, revisar regras contribuídas, triar issues e gerar auditorias de release. O Codex auxiliaria esses fluxos; o scanner Vibeflow permanecerá local, sem dependências ou telemetria, e não enviará nem processará workflows privados de clientes.

### Additional context

> Vibeflow é um estudo de caso público de desenvolvimento open source nativo em Codex. O Codex conduziu o projeto desde o reposicionamento e implementação até revisão adversarial, correções, CI, plugin, releases, auditoria de workflow real e a resposta da v0.9 ao feedback de usuários. A adoção ainda é inicial, mas a engenharia, o histórico de manutenção e a evidência real são públicos e reproduzíveis.

## Evidence map

Use these links only if OpenAI requests verification; the form has no dedicated evidence field.

- Public MIT repository: <https://github.com/domfelipe/vibeflow-n8n>
- Executable release: <https://github.com/domfelipe/vibeflow-n8n/releases/tag/v0.9.0>
- Reproducible demo: <https://github.com/domfelipe/vibeflow-n8n/blob/main/docs/demo.md>
- Release and Red Team audit: <https://github.com/domfelipe/vibeflow-n8n/blob/main/docs/release-audit.md>
- CI history: <https://github.com/domfelipe/vibeflow-n8n/actions/workflows/ci.yml>
- Launch discussion: <https://github.com/domfelipe/vibeflow-n8n/discussions/3>
- Public r/n8n feedback that shaped v0.9: <https://www.reddit.com/r/n8n/comments/1v3is1w/i_built_an_opensource_safety_gate_for_aigenerated/>
- Engineering PRs: <https://github.com/domfelipe/vibeflow-n8n/pulls?q=is%3Apr+is%3Amerged>

## Evidence snapshot

Captured on 2026-07-23 after release:

- public repository with MIT license;
- public `v0.9.0` release, with v0.8.0 preserved in release history;
- 36 adversarial tests passing locally and in remote Node.js 20, 22, and 24 CI;
- dependency-free CLI, GitHub Action, and installable Codex plugin;
- 7 maintainer PRs merged with green CI, including the v0.9 implementation and release-evidence PR;
- 4 stars, 0 forks, and no verified external contributor yet;
- public r/n8n launch thread with several substantive comments that directly shaped VF010-VF013;
- first real audit: anonymized 92-node workflow, 3 blocking findings, 57 warnings, no workflow mutation;
- Codex used across product repositioning, implementation, review, Red Team, remediation, packaging, CI, release, real-workflow audit, and the community-feedback-driven v0.9 cycle.

Do not describe maintainer PRs, the maintainer's own workflow, clones, or unattributed stars as external adoption.

## Confidentiality boundary

Do not submit or link the full real-workflow audit. Application materials must not include:

- client, clinic, or workflow names;
- remote workflow IDs, version IDs, hashes, or timestamps;
- node names that reveal business logic;
- private workflow JSON, credentials, customer data, or infrastructure identifiers.

The approved public description is: **“a real, production-scale 92-node conversational workflow audited in read-only mode.”**

## Submission checklist

- [x] Repository is public and not archived.
- [x] GitHub username is public.
- [x] Role is primary maintainer.
- [x] Repository URL is correct.
- [x] Both requested benefits are selected.
- [x] All narrative answers are under 500 characters.
- [x] Real-workflow evidence is anonymized.
- [x] Early adoption is described honestly.
- [ ] Insert the exact ChatGPT-account email.
- [ ] Insert and verify the OpenAI Organization ID.
- [ ] Re-read the current Program Terms immediately before submission.
- [ ] Save the confirmation page and submission timestamp privately.

## After submission

Continue collecting organic evidence without delaying the application:

1. publish the v0.9 follow-up in r/n8n;
2. invite users to report anonymized false positives and missed unsafe cases;
3. respond to every issue or discussion with reproducible evidence;
4. keep releases, CI, and the public maintenance trail current;
5. never request artificial stars, forks, or empty PRs.

OpenAI reviews applications continuously. If additional evidence is requested, provide a fresh public snapshot and the anonymized outcome of subsequent real-world audits.
