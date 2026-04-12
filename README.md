# Vibeflow n8n

Build complete n8n workflows through MCP with any coding agent.
Ask for the goal, generate a plan, build the workflow, validate it, and hand back a usable automation fast.

Português logo abaixo.

## Why this exists

Most people do not want to handcraft automation JSON, memorize node quirks, or map every edge case before the first test. They want to describe the workflow they need and let an agent do the heavy lifting.

Vibeflow n8n is a skill-first open-source kit for agents and CLIs that support MCP. It helps an agent:

- ask the right discovery questions
- turn answers into a structured implementation plan
- create or update workflows in n8n via MCP
- validate the build before handoff
- report assumptions, gaps, and next steps clearly

## Supported clients

Officially documented targets in this repo:

- Codex CLI
- Claude Code
- OpenCode

Experimental or community compatibility:

- OpenClaude and similar MCP-capable forks

## What the skill does

The skill follows a simple five-step loop:

1. Understand the workflow goal
2. Ask only the questions that change implementation
3. Produce a normalized plan
4. Build or update the workflow in n8n via MCP
5. Return a clean implementation report

This keeps the user experience practical and intuitive, closer to vibe coding than ceremony.

## Repo map

```text
.
├── assets/
├── clients/
├── docs/
├── examples/
├── recipes/
├── schemas/
├── templates/
└── .github/
```

## Quick start

1. Connect an MCP-capable client to the n8n MCP server.
2. Load the system prompt and conversation contract from this repo.
3. Ask the agent to design or build a workflow in natural language.
4. Let the agent gather the missing details, generate a plan, and build.

Start here:

- `docs/getting-started.md`
- `docs/install.md`
- `templates/system-prompt.md`
- `docs/conversation-contract.md`

## Example prompt

```text
Build me an n8n workflow that watches a Gmail inbox for invoices,
saves PDF attachments to Google Drive, extracts key fields,
logs them to a spreadsheet, and posts failures to Slack.
Use safe defaults and ask only critical missing questions.
```

## Launch assets and publishing

This repo includes launch materials for a public release:

- GitHub description and tagline suggestions
- release notes template
- launch-day checklist
- social copy ideas
- issue and PR templates
- starter labels and community onboarding docs

See:

- `docs/github-launch.md`
- `docs/launch-assets.md`
- `docs/launch-day-checklist.md`
- `docs/tutorial-subir-github.md`

## Safety and practical limits

The n8n MCP route is powerful, but not magic. Review the upstream limits before promising full automation behavior. The current n8n docs explicitly call out constraints such as a five-minute timeout, no binary input support, and no human-in-the-loop during MCP execution. citeturn863639search0

## Roadmap

Current release line: `0.5.0`

Planned improvements include:

- richer recipes by domain
- test fixtures for client configs
- validation helpers for plan payloads
- gallery assets and demo GIFs
- community issue labels and starter tasks

See `docs/roadmap.md`.

---

# Vibeflow n8n

Crie workflows completos no n8n via MCP com qualquer agente de código.
Descreva o objetivo, deixe o agente planejar, construir, validar e devolver uma automação utilizável.

## Por que esse projeto existe

A maioria das pessoas não quer montar JSON na unha, decorar detalhes de nodes ou descobrir cada exceção antes do primeiro teste. Elas querem explicar o que precisam e deixar o agente fazer a parte pesada.

O Vibeflow n8n é um kit open source orientado a skill para agentes e CLIs com suporte a MCP. Ele ajuda o agente a:

- fazer as perguntas certas
- transformar as respostas em um plano estruturado
- criar ou atualizar workflows no n8n via MCP
- validar a construção antes da entrega
- reportar suposições, lacunas e próximos passos com clareza

## Clientes suportados

Alvos documentados oficialmente neste repositório:

- Codex CLI
- Claude Code
- OpenCode

Compatibilidade experimental ou comunitária:

- OpenClaude e forks semelhantes com suporte a MCP

## O que a skill faz

A skill segue um ciclo simples de cinco etapas:

1. Entende o objetivo do workflow
2. Pergunta apenas o que muda a implementação
3. Gera um plano normalizado
4. Cria ou atualiza o workflow no n8n via MCP
5. Entrega um relatório limpo de implementação

O resultado fica mais prático e intuitivo, bem no espírito de vibe coding.

## Início rápido

1. Conecte um cliente compatível com MCP ao servidor MCP do n8n.
2. Carregue o system prompt e o contrato de conversa deste repositório.
3. Peça ao agente, em linguagem natural, para desenhar ou construir um workflow.
4. Deixe o agente levantar as lacunas críticas, montar o plano e construir.

Comece por aqui:

- `docs/getting-started.md`
- `docs/install.md`
- `templates/system-prompt.md`
- `docs/conversation-contract.md`

## Exemplo de pedido

```text
Crie um workflow no n8n que monitore um inbox de Gmail para notas fiscais,
salve anexos PDF no Google Drive, extraia campos principais,
registre tudo em uma planilha e envie falhas para o Slack.
Use defaults seguros e pergunte só o que for crítico.
```

## Publicação no GitHub

Este repositório já inclui material para lançamento:

- sugestões de descrição e tagline
- template de release notes
- checklist de lançamento
- ideias de copy para divulgação
- templates de issues e PRs
- docs de onboarding para comunidade

Veja:

- `docs/github-launch.md`
- `docs/launch-assets.md`
- `docs/launch-day-checklist.md`
- `docs/tutorial-subir-github.md`

## Referências

- n8n MCP server docs: `docs.n8n.io`
- GitHub publishing docs: `docs.github.com`

## Licença

Consulte `LICENSE`.
