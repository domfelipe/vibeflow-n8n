# Tutorial: como subir o Vibeflow n8n no GitHub

Este guia foi feito para você publicar o projeto de forma prática, sem virar refém de um labirinto de menus.

## Antes de começar

Tenha em mãos:

- uma conta no GitHub
- Git instalado no computador, se for usar terminal
- a pasta local do projeto ou o ZIP extraído
- um nome final para o repositório, por exemplo `vibeflow-n8n`

O GitHub permite criar um novo repositório pela interface web ou subir um projeto local pela linha de comando com GitHub CLI. A documentação oficial cobre os dois caminhos. citeturn863639search0turn863639search3turn863639search14

## Caminho 1: subir pelo site do GitHub + Git local

### 1) Crie o repositório vazio

No GitHub:

- clique no canto superior direito em **New repository**
- escolha o nome do repositório, por exemplo `vibeflow-n8n`
- adicione uma descrição curta
- escolha **Public**
- não marque README, `.gitignore` ou licença, porque este projeto já contém esses arquivos
- clique em **Create repository**

Esses passos seguem o fluxo atual do GitHub para criação de repositórios. citeturn863639search0

### 2) Extraia o ZIP da V5 no seu computador

Descompacte o pacote em uma pasta local. Exemplo:

```bash
unzip n8n-workflow-skill-kit-v0.5.0.zip
cd n8n-workflow-skill-kit
```

### 3) Inicialize o Git localmente

Se a pasta ainda não for um repositório Git:

```bash
git init
git add .
git commit -m "feat: launch Vibeflow n8n v0.5.0"
```

### 4) Conecte ao repositório remoto

Copie a URL do seu repositório recém-criado e rode:

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/vibeflow-n8n.git
git push -u origin main
```

A própria documentação do GitHub cobre o fluxo de adicionar código local a um repositório remoto. citeturn863639search9turn863639search19

## Caminho 2: subir usando GitHub CLI

Se você usa `gh`, o caminho fica bem mais liso.

### 1) Entre na pasta do projeto

```bash
cd n8n-workflow-skill-kit
```

### 2) Inicialize e faça o primeiro commit

```bash
git init
git add .
git commit -m "feat: launch Vibeflow n8n v0.5.0"
```

### 3) Crie e publique com `gh`

```bash
gh repo create vibeflow-n8n --public --source=. --remote=origin --push
```

O GitHub CLI documenta esse fluxo oficialmente para criar um repositório e subir um projeto local existente. citeturn863639search3turn863639search14

## Depois do push: arrumando a vitrine do repositório

### 1) Ajuste descrição e website

Na página principal do repositório:

- clique no ícone de engrenagem na área de About
- adicione a descrição
- opcionalmente, adicione um site ou link de demo

Sugestão de descrição:

```text
Build complete n8n workflows through MCP with any coding agent.
```

### 2) Adicione topics

Topics ajudam o projeto a ser encontrado. O GitHub recomenda usá-los para classificar o repositório por assunto e finalidade. citeturn863639search5turn863639search11

Sugestão de topics:

```text
n8n, mcp, automation, ai-agents, codex, claude-code, opencode, workflow-automation, vibe-coding
```

### 3) Configure a social preview

No GitHub:

- abra **Settings**
- procure a área **Social preview**
- envie uma imagem de capa

O GitHub suporta customização da imagem de preview social diretamente nas configurações do repositório. citeturn863639search2turn863639search8

### 4) Faça a primeira release

Na aba principal do repositório:

- clique em **Releases**
- clique em **Draft a new release**
- use a tag `v0.5.0`
- título sugerido: `Vibeflow n8n v0.5.0`
- cole as release notes com base em `docs/release-notes-template.md`
- publique

O fluxo de criação de release está documentado pelo GitHub na área de releases do repositório. citeturn863639search1

## Ordem recomendada de publicação

Use esta sequência:

1. extraia o ZIP
2. ajuste nome final do projeto, se quiser
3. faça `git init`
4. commit inicial
5. crie o repo no GitHub
6. push da branch `main`
7. revise README e About
8. adicione topics
9. suba social preview
10. publique a release `v0.5.0`
11. compartilhe

## Checklist de comando rápido

### Via Git puro

```bash
cd n8n-workflow-skill-kit
git init
git add .
git commit -m "feat: launch Vibeflow n8n v0.5.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/vibeflow-n8n.git
git push -u origin main
```

### Via GitHub CLI

```bash
cd n8n-workflow-skill-kit
git init
git add .
git commit -m "feat: launch Vibeflow n8n v0.5.0"
gh repo create vibeflow-n8n --public --source=. --remote=origin --push
```

## Erros comuns

### O GitHub rejeitou o push porque o repositório remoto já tinha arquivos

Isso normalmente acontece se você criou README ou `.gitignore` no GitHub na hora de criar o repositório. A saída mais limpa é criar outro repositório vazio, sem arquivos iniciais.

### Subi arquivos sensíveis sem querer

Pare e remova imediatamente. O GitHub alerta para não commitar segredos ou credenciais em repositórios remotos. citeturn863639search4

### O ZIP foi extraído com uma pasta a mais

Entre na pasta correta antes de rodar `git init`, senão você publica um matrioshka de diretórios.

## Texto pronto para o About do repositório

**Description**

```text
Build complete n8n workflows through MCP with any coding agent.
```

**Website**

Use seu futuro site, post, demo ou deixe em branco.

**Topics**

```text
n8n
mcp
automation
ai-agents
workflow-automation
codex
claude-code
opencode
vibe-coding
```

## Texto pronto para a primeira release

**Tag**

```text
v0.5.0
```

**Title**

```text
Vibeflow n8n v0.5.0
```

**Summary**

```text
First public launch of Vibeflow n8n, a skill-first open-source kit for building complete n8n workflows through MCP with coding agents like Codex CLI, Claude Code, and OpenCode.
```

