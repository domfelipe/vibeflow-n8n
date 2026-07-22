# Codex for Open Source — submission pack

Application: <https://openai.com/pt-BR/form/codex-for-oss/>

Program overview: <https://developers.openai.com/community/codex-for-oss>

Program terms: <https://learn.chatgpt.com/docs/codex-for-oss-terms>

Prepared: 2026-07-22

## Recommendation

Submit in **English**, even through the PT-BR form. OpenAI publishes no language requirement and no evidence that language changes selection odds. English is recommended only to reduce translation friction for a global technical review.

Submit now. Stars, forks, downloads, repository usage, ecosystem importance, and active maintenance are evaluation signals, not published minimum thresholds. Vibeflow's strongest evidence is its Codex-native engineering and its first real 92-node audit, not early popularity metrics.

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

Select: **Principal maintainer**.

### Why is this repository eligible?

Character count: **420/500**.

> Vibeflow is an MIT-licensed safety and contract gate for AI-generated n8n workflows, rebuilt end-to-end with Codex. Its v0.8.0 plugin audited a real 92-node workflow in read-only mode and produced provenance-backed results: 3 blocking AI-safety findings, 57 prioritized warnings, and concrete revalidation gates. It fills a growing n8n need: deterministic pre-production checks for workflows created by people or agents.

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

Character count: **431/500**.

> Vibeflow is a public case study in Codex-native OSS development. Codex helped reposition an old prototype, implement the CLI, run repeated Red Team reviews, fix regressions, package a GitHub Action and Codex plugin, open and merge PRs, and publish v0.8.0. Its first production-scale audit exposed workflow risks and analyzer limitations, creating a concrete maintenance backlog. Adoption is early; the engineering evidence is real.

## PT-BR review translation

These translations are for review only. Paste the English versions above into the form.

### Repository eligibility

> Vibeflow é um gate MIT de segurança e contratos para workflows n8n gerados por IA, reconstruído de ponta a ponta com Codex. O plugin v0.8.0 auditou em modo somente leitura um workflow real de 92 nós e produziu resultados com proveniência: 3 bloqueios de segurança de IA, 57 avisos priorizados e gates concretos de revalidação. Ele atende a uma necessidade crescente do ecossistema n8n: checks determinísticos antes da produção para workflows criados por pessoas ou agentes.

### API-credit use

> Os créditos financiariam fluxos de manutenção OSS: transformar falhas anonimizadas em fixtures adversariais, avaliar novas políticas, reproduzir falsos positivos, revisar regras contribuídas, triar issues e gerar auditorias de release. O Codex auxiliaria esses fluxos; o scanner Vibeflow permanecerá local, sem dependências ou telemetria, e não enviará nem processará workflows privados de clientes.

### Additional context

> Vibeflow é um estudo de caso público de desenvolvimento open source nativo em Codex. O Codex ajudou a reposicionar um protótipo antigo, implementar a CLI, executar Red Teams repetidos, corrigir regressões, empacotar uma GitHub Action e um plugin Codex, mesclar PRs e publicar a v0.8.0. A primeira auditoria em escala de produção revelou riscos do workflow e limitações do analisador, criando um backlog concreto. A adoção ainda é inicial; a evidência de engenharia é real.

## Evidence map

Use these links only if OpenAI requests verification; the form has no dedicated evidence field.

- Public MIT repository: <https://github.com/domfelipe/vibeflow-n8n>
- Executable release: <https://github.com/domfelipe/vibeflow-n8n/releases/tag/v0.8.0>
- Reproducible demo: <https://github.com/domfelipe/vibeflow-n8n/blob/main/docs/demo.md>
- Release and Red Team audit: <https://github.com/domfelipe/vibeflow-n8n/blob/main/docs/release-audit.md>
- CI history: <https://github.com/domfelipe/vibeflow-n8n/actions/workflows/ci.yml>
- Launch discussion: <https://github.com/domfelipe/vibeflow-n8n/discussions/3>
- Engineering PRs: <https://github.com/domfelipe/vibeflow-n8n/pulls?q=is%3Apr+is%3Amerged>

## Evidence snapshot

Captured on 2026-07-22:

- public repository with MIT license;
- `v0.8.0` release;
- 26 adversarial tests on Node.js 20, 22, and 24;
- dependency-free CLI, GitHub Action, and installable Codex plugin;
- 3 maintainer PRs merged with green CI;
- 2 stars, 0 forks, and no verified external contributor yet;
- first real audit: anonymized 92-node workflow, 3 blocking findings, 57 warnings, no workflow mutation;
- Codex used across product repositioning, implementation, review, Red Team, remediation, packaging, CI, release, and real-workflow audit.

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
- [x] Role is principal maintainer.
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

1. publish the r/n8n post;
2. invite users to report anonymized false positives and missed unsafe cases;
3. respond to every issue or discussion with reproducible evidence;
4. keep releases, CI, and the public maintenance trail current;
5. never request artificial stars, forks, or empty PRs.

OpenAI reviews applications continuously. If additional evidence is requested, provide a fresh public snapshot and the anonymized outcome of subsequent real-world audits.
