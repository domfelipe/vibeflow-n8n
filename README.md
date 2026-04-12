# Vibeflow n8n

Build complete n8n workflows through MCP with any coding agent.
Ask for the goal, generate a plan, build the workflow, validate it, and hand back a usable automation fast.

**Planning-first n8n workflow generation for Codex, Claude Code, OpenCode, and other MCP-capable clients.**

Português logo abaixo.

## What you get

- A practical **system prompt** for planning-first workflow generation
- A **conversation contract** that keeps discovery short and useful
- A normalized **plan schema** before any workflow is built
- Client setup examples for **Codex**, **Claude Code**, and **OpenCode**
- Demo-friendly **recipes**, visuals, launch copy, and release assets

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

## How it works

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

## Start here

- `docs/getting-started.md`
- `docs/install.md`
- `templates/system-prompt.md`
- `docs/conversation-contract.md`
- `schemas/plan.schema.json`

## Quick start

1. Connect an MCP-capable client to the n8n MCP server.
2. Load the system prompt and conversation contract from this repo.
3. Ask the agent to design or build a workflow in natural language.
4. Let the agent gather the missing details, generate a plan, and build.

Example request:

```text
Build me an n8n workflow that watches a Gmail inbox for invoices,
saves PDF attachments to Google Drive, extracts key fields,
logs them to a spreadsheet, and posts failures to Slack.
Use safe defaults and ask only critical missing questions.
```

## What makes the workflow handoff good

A successful run should leave the user with:

- a clearly named workflow
- a documented trigger and end state
- noted assumptions and safe defaults
- credential gaps called out explicitly
- a compact test plan
- obvious next upgrades

## Demo-first assets

Use these files to create a polished first impression:

- `docs/demo-assets.md`
- `docs/demo-script.md`
- `docs/real-demo-playbook.md`
- `docs/recipes-gallery.md`
- `assets/hero-banner.svg`
- `assets/terminal-demo.svg`
- `assets/workflow-demo.svg`
- `assets/final-report-demo.svg`

## Recipes to try first

Fastest value demos:

- `recipes/lead-triage.md`
- `recipes/support-triage.md`
- `recipes/invoice-reminder.md`
- `recipes/ai-lead-enrichment.md`
- `recipes/slack-to-notion-triage.md`
- `recipes/customer-support-escalation.md`
- `recipes/hubspot-to-slack-qualification.md`

## Publish-ready extras

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
- `docs/readme-premium-checklist.md`

## Suggested launch stack

For the first public version, ship with:

- 1 hero banner
- 3 to 5 screenshots or SVG placeholders
- 1 short terminal GIF
- 3 strong recipes in the README
- 1 release with screenshots attached

## Roadmap

Current release line: `0.7.0`

Planned improvements include:

- sample workflow exports for safe local testing
- recipe packs by team or department
- validation helpers for plan payloads
- screenshots and GIFs from real runs
- optional quality scoring for generated workflows

See `docs/roadmap.md`.

---

# Vibeflow n8n

Crie workflows completos no n8n via MCP com qualquer agente de código.
Descreva o objetivo, deixe o agente planejar, construir, validar e devolver uma automação utilizável.

**Geração de workflows no n8n com foco em planejamento, pronta para Codex, Claude Code, OpenCode e outros clientes MCP.**

## O que você recebe

- um **system prompt** prático para geração de workflows com planejamento prévio
- um **contrato de conversa** para discovery curto e útil
- um **schema de plano** normalizado antes da construção
- exemplos de configuração para **Codex**, **Claude Code** e **OpenCode**
- **recipes**, visuais, copy de lançamento e assets para vitrine

## Por que esse projeto existe

A maioria das pessoas não quer montar JSON na unha, decorar detalhes de nodes ou descobrir cada exceção antes do primeiro teste. Elas querem explicar o que precisam e deixar o agente fazer a parte pesada.

O Vibeflow n8n é um kit open source orientado a skill para agentes e CLIs com suporte a MCP. Ele ajuda o agente a:

- fazer as perguntas certas
- transformar as respostas em um plano estruturado
- criar ou atualizar workflows no n8n via MCP
- validar a construção antes da entrega
- reportar suposições, lacunas e próximos passos com clareza

## O fluxo da skill

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
- `schemas/plan.schema.json`

## Demonstração e vitrine

Arquivos para montar uma landing page forte dentro do próprio README:

- `docs/demo-assets.md`
- `docs/demo-script.md`
- `docs/real-demo-playbook.md`
- `docs/recipes-gallery.md`
- `assets/hero-banner.svg`
- `assets/terminal-demo.svg`
- `assets/workflow-demo.svg`
- `assets/final-report-demo.svg`

## Recipes para mostrar valor rápido

- `recipes/lead-triage.md`
- `recipes/support-triage.md`
- `recipes/invoice-reminder.md`
- `recipes/ai-lead-enrichment.md`
- `recipes/slack-to-notion-triage.md`
- `recipes/customer-support-escalation.md`
- `recipes/hubspot-to-slack-qualification.md`
