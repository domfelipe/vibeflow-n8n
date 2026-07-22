import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MAX_FINDINGS_PER_FILE,
  MAX_NODES,
  checkFile,
  checkPaths,
  formatText,
  formatSarif,
  inspectWorkflow,
  normalizeConfig,
} from "../src/vibeflow.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const safe = path.join(root, "examples/safe-support-agent.workflow.json");
const unsafe = path.join(root, "examples/unsafe-support-agent.workflow.json");
const invalid = path.join(root, "test/fixtures/invalid.workflow.json");

test("safe workflow passes all default policies", async () => {
  const result = await checkFile(safe);
  assert.deepEqual(result.findings, []);
});

test("unsafe workflow exercises every v0.8 policy", async () => {
  const result = await checkFile(unsafe);
  assert.deepEqual(
    [...new Set(result.findings.map((finding) => finding.ruleId))],
    ["VF001", "VF002", "VF003", "VF004", "VF005", "VF006", "VF007", "VF008", "VF009"],
  );
});

test("invalid workflow produces VF000", async () => {
  const result = await checkFile(invalid);
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].ruleId, "VF000");
});

test("rule severity and vocabulary are configurable", async () => {
  const workflow = JSON.parse(await readFile(unsafe, "utf8"));
  workflow.nodes.unshift({
    id: "custom-guard",
    name: "Emergency brake",
    type: "n8n-nodes-base.if",
    parameters: { conditions: { boolean: [{ value1: "={{ $json.emergency_brake }}", value2: true }] } },
  });
  workflow.connections["Public Webhook"] = {
    main: [[{ node: "Emergency brake", type: "main", index: 0 }]],
  };
  workflow.connections["Emergency brake"] = {
    main: [[{ node: "AI Agent", type: "main", index: 0 }], []],
  };

  const config = normalizeConfig({
    rules: { VF003: "off" },
    terms: { killSwitch: ["emergency brake"] },
  });
  const findings = inspectWorkflow(workflow, config);
  assert.equal(findings.some((finding) => finding.ruleId === "VF003"), false);
  assert.equal(findings.some((finding) => finding.ruleId === "VF006"), false);
});

test("SARIF report contains rules and file locations", async () => {
  const report = await checkPaths([unsafe]);
  const sarif = JSON.parse(formatSarif(report));
  assert.equal(sarif.version, "2.1.0");
  assert.equal(sarif.runs[0].tool.driver.name, "Vibeflow");
  assert.ok(sarif.runs[0].results.length >= 8);
  assert.equal(sarif.runs[0].results[0].locations[0].physicalLocation.region.startLine, 1);
});

test("CLI exits 1 on errors and supports non-blocking automation", () => {
  const blocking = runCli(["check", unsafe, "--format", "json"]);
  assert.equal(blocking.status, 1, blocking.stderr);
  assert.equal(JSON.parse(blocking.stdout).summary.errors > 0, true);

  const advisory = runCli(["check", unsafe, "--fail-on", "never"]);
  assert.equal(advisory.status, 0, advisory.stderr);
});

test("plugin and skill manifests contain no scaffold placeholders", async () => {
  const pluginPath = path.join(root, "plugins/vibeflow/.codex-plugin/plugin.json");
  const skillPath = path.join(root, "plugins/vibeflow/skills/vibeflow/SKILL.md");
  const plugin = JSON.parse(await readFile(pluginPath, "utf8"));
  const skill = await readFile(skillPath, "utf8");
  assert.equal(plugin.name, "vibeflow");
  assert.equal(plugin.version, "0.9.0");
  assert.match(skill, /^---\nname: vibeflow\ndescription: .+\n---/);
  assert.doesNotMatch(`${JSON.stringify(plugin)}\n${skill}`, /\[TODO:/);
});

test("unknown policy configuration fails closed", () => {
  assert.throws(() => normalizeConfig({ rules: { VF999: "off" } }), /Unknown configurable rule/);
  assert.throws(() => normalizeConfig({ surprise: true }), /Unknown config key/);
});

test("locked policy rejects configuration weakening", () => {
  assert.throws(() => normalizeConfig({ rules: { VF001: "off" } }, { locked: true }), /cannot weaken VF001/);
  assert.throws(() => normalizeConfig({ terms: { killSwitch: ["anything"] } }, { locked: true }), /cannot change/);
  assert.throws(() => normalizeConfig({ bannedNodeTypes: [] }, { locked: true }), /cannot remove/);
  assert.equal(normalizeConfig({ rules: { VF003: "error" } }, { locked: true }).rules.VF003, "error");
});

test("webhook authentication requires a supported mode and credential reference", () => {
  const webhook = { name: "Webhook", type: "n8n-nodes-base.webhook", parameters: { authentication: "headerAuth" } };
  assert.equal(hasRule(workflowWith([webhook]), "VF003"), true);
  webhook.credentials = { httpHeaderAuth: { id: "credential-reference", name: "Header Auth" } };
  assert.equal(hasRule(workflowWith([webhook]), "VF003"), false);
  webhook.credentials = { httpHeaderAuth: {} };
  assert.equal(hasRule(workflowWith([webhook]), "VF003"), true);
  webhook.credentials = { unrelatedCredential: { id: "credential-reference" } };
  assert.equal(hasRule(workflowWith([webhook]), "VF003"), true);
  webhook.parameters.authentication = "madeUpAuth";
  assert.equal(hasRule(workflowWith([webhook]), "VF003"), true);
});

test("raw headers and URL query credentials trigger VF001", () => {
  const workflow = workflowWith([{
    name: "Payload",
    type: "n8n-nodes-base.noOp",
    parameters: {
      jsonHeaders: "{\"Authorization\":\"Bearer live_example_0123456789abcdef\"}",
      url: "https://api.invalid/v1?access_token=live_0123456789abcdef",
      mixed: "Bearer literal_0123456789abcdef {{ $json.id }}",
      expressionLiteral: "={{ 'Bearer live_secret_0123456789abcdef' }}",
    },
  }]);
  const secrets = inspectWorkflow(workflow).filter((finding) => finding.ruleId === "VF001");
  assert.equal(secrets.length, 4);
});

test("pinned and static workflow data are scanned for secrets", () => {
  const workflow = workflowWith([{ name: "Manual", type: "n8n-nodes-base.manualTrigger", parameters: {} }]);
  workflow.pinData = { Manual: [{ json: { access_token: "live_0123456789abcdef" } }] };
  workflow.staticData = { password: "literal_password_0123456789" };
  const paths = inspectWorkflow(workflow).filter((finding) => finding.ruleId === "VF001").map((finding) => finding.path);
  assert.deepEqual(paths, ["pinData.Manual[0].json.access_token", "staticData.password"]);
});

test("idempotency must be atomic and dominate inbound side-effect paths", () => {
  const nodes = [
    { name: "Webhook", type: "n8n-nodes-base.webhook", parameters: { authentication: "none" } },
    { name: "Send", type: "n8n-nodes-base.httpRequest", parameters: {} },
    { name: "Idempotency note", type: "n8n-nodes-base.noOp", parameters: {} },
  ];
  const disconnected = workflowWith(nodes, {
    Webhook: { main: [[connection("Send")]] },
  });
  assert.equal(findingFor(disconnected, "VF005", "Send"), true);

  const guard = {
    name: "Claim idempotency event",
    type: "n8n-nodes-base.postgres",
    parameters: { query: "INSERT INTO event_ledger VALUES ($1) ON CONFLICT DO NOTHING RETURNING event_id" },
  };
  const guarded = workflowWith([nodes[0], guard, nodes[1]], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection("Send")]] },
  });
  assert.equal(findingFor(guarded, "VF005", "Send"), false);

  guard.parameters.query = "SELECT 'event id' AS label, 'on conflict' AS note";
  const superficial = workflowWith([nodes[0], guard, nodes[1]], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection("Send")]] },
  });
  assert.equal(findingFor(superficial, "VF005", "Send"), true);

  guard.parameters.query = "INSERT INTO audit(message) VALUES ('idempotency'); -- ON CONFLICT (event_id) DO NOTHING";
  assert.equal(findingFor(workflowWith([nodes[0], guard, nodes[1]], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection("Send")]] },
  }), "VF005", "Send"), true);

  guard.parameters.query = "INSERT INTO event_ledger VALUES ($1) ON CONFLICT DO NOTHING RETURNING event_id";
  guard.continueOnFail = true;
  assert.equal(findingFor(workflowWith([nodes[0], guard, nodes[1]], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection("Send")]] },
  }), "VF005", "Send"), true);

  guard.continueOnFail = false;
  guard.onError = "continueErrorOutput";
  assert.equal(findingFor(workflowWith([nodes[0], guard, nodes[1]], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection("Send")], [connection("Send")]] },
  }), "VF005", "Send"), true);
});

test("kill switches must be structural and dominate every AI entry path", () => {
  const webhook = { name: "Webhook", type: "n8n-nodes-base.webhook", parameters: { authentication: "none" } };
  const guard = {
    name: "Agent enabled kill switch",
    type: "n8n-nodes-base.if",
    parameters: { conditions: { boolean: [{ value1: "={{ $json.agent_enabled }}", value2: true }] } },
  };
  const ai = { name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", parameters: {} };
  const bypassed = workflowWith([webhook, guard, ai], {
    Webhook: { main: [[connection(guard.name), connection(ai.name)]] },
    [guard.name]: { main: [[connection(ai.name)]] },
  });
  assert.equal(findingFor(bypassed, "VF006", ai.name), true);

  const namedNoOp = { ...guard, name: "Agent enabled check", type: "n8n-nodes-base.noOp" };
  const superficial = workflowWith([webhook, namedNoOp, ai], {
    Webhook: { main: [[connection(namedNoOp.name)]] },
    [namedNoOp.name]: { main: [[connection(ai.name)]] },
  });
  assert.equal(findingFor(superficial, "VF006", ai.name), true);

  const constantGuard = {
    ...guard,
    parameters: { conditions: { boolean: [{ value1: true, value2: true }], note: "agent enabled" } },
  };
  const constant = workflowWith([webhook, constantGuard, ai], {
    Webhook: { main: [[connection(constantGuard.name)]] },
    [constantGuard.name]: { main: [[connection(ai.name)]] },
  });
  assert.equal(findingFor(constant, "VF006", ai.name), true);

  const invertedGuard = {
    ...guard,
    parameters: { conditions: { boolean: [{ value1: "={{ $json.agent_enabled }}", value2: false }] } },
  };
  const inverted = workflowWith([webhook, invertedGuard, ai], {
    Webhook: { main: [[connection(invertedGuard.name)]] },
    [invertedGuard.name]: { main: [[connection(ai.name)], []] },
  });
  assert.equal(findingFor(inverted, "VF006", ai.name), true);

  const codeComment = {
    name: "Agent enabled kill switch",
    type: "n8n-nodes-base.code",
    parameters: { jsCode: "// {{ $json.agent_enabled }}\nreturn items;" },
  };
  const decorativeCode = workflowWith([webhook, codeComment, ai], {
    Webhook: { main: [[connection(codeComment.name)]] },
    [codeComment.name]: { main: [[connection(ai.name)], []] },
  });
  assert.equal(findingFor(decorativeCode, "VF006", ai.name), true);

  const guarded = workflowWith([webhook, guard, ai], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection(ai.name)], []] },
  });
  assert.equal(findingFor(guarded, "VF006", ai.name), false);
});

test("human handoff requires a reachable external action", () => {
  const ai = { name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", parameters: {} };
  const fake = { name: "Human handoff ticket", type: "n8n-nodes-base.noOp", parameters: {} };
  const superficial = workflowWith([ai, fake], { [ai.name]: { main: [[connection(fake.name)]] } });
  assert.equal(findingFor(superficial, "VF007", ai.name), true);

  const slack = { ...fake, type: "n8n-nodes-base.slack" };
  const real = workflowWith([ai, slack], { [ai.name]: { main: [[connection(slack.name)]] } });
  assert.equal(findingFor(real, "VF007", ai.name), false);

  const getTicket = {
    name: "Human handoff ticket",
    type: "n8n-nodes-base.httpRequest",
    parameters: { method: "GET", url: "https://support.invalid/tickets" },
  };
  const readOnly = workflowWith([ai, getTicket], { [ai.name]: { main: [[connection(getTicket.name)]] } });
  assert.equal(findingFor(readOnly, "VF007", ai.name), true);
});

test("common mutable SaaS nodes receive side-effect policies", () => {
  const webhook = {
    name: "Webhook",
    type: "n8n-nodes-base.webhook",
    parameters: { authentication: "headerAuth" },
    credentials: { httpHeaderAuth: { id: "credential-reference" } },
  };
  const airtable = {
    name: "Create Airtable record",
    type: "n8n-nodes-base.airtable",
    retryOnFail: true,
    maxTries: 99,
    waitBetweenTries: 0,
    parameters: { operation: "create" },
  };
  const workflow = workflowWith([webhook, airtable], {
    Webhook: { main: [[connection(airtable.name)]] },
  }, {});
  const rules = new Set(inspectWorkflow(workflow).map((finding) => finding.ruleId));
  for (const rule of ["VF004", "VF005", "VF008", "VF009"]) assert.equal(rules.has(rule), true, rule);
});

test("error handling must be connected or configured at workflow level", () => {
  const request = { name: "Request", type: "n8n-nodes-base.httpRequest", continueOnFail: true, parameters: {} };
  const disconnectedError = { name: "Error", type: "n8n-nodes-base.errorTrigger", parameters: {} };
  assert.equal(findingFor(workflowWith([request, disconnectedError]), "VF004", request.name), true);

  const stop = { name: "Failure stop", type: "n8n-nodes-base.noOp", parameters: {} };
  request.onError = "continueErrorOutput";
  const handled = workflowWith([request, stop], {
    Request: { main: [[], [connection(stop.name)]] },
  });
  assert.equal(findingFor(handled, "VF004", request.name), false);

  const selfLoop = workflowWith([request], {
    Request: { main: [[], [connection(request.name)]] },
  });
  assert.equal(findingFor(selfLoop, "VF004", request.name), true);

  const loop = { name: "Loop", type: "n8n-nodes-base.noOp", parameters: {} };
  const indirectLoop = workflowWith([request, loop], {
    Request: { main: [[], [connection(loop.name)]] },
    Loop: { main: [[connection(request.name)]] },
  });
  assert.equal(findingFor(indirectLoop, "VF004", request.name), true);
});

test("ordinary HTTP money actions require a critical outcome contract", () => {
  const refund = {
    name: "Issue refund",
    type: "n8n-nodes-base.httpRequest",
    parameters: { method: "POST", url: "https://payments.invalid/refund" },
  };
  const workflow = workflowWith([refund], {}, { executionTimeout: 120, errorWorkflow: "global-errors" });
  assert.equal(findingFor(workflow, "VF010", refund.name), true);
  assert.equal(findingFor(workflow, "VF013", refund.name), true);

  refund.parameters.method = "GET";
  assert.equal(findingFor(workflow, "VF010", refund.name), false);
});

test("complete money outcome contract passes VF010 through VF013", () => {
  const { workflow, config } = moneyOutcomeFixture();
  const findings = inspectWorkflow(workflow, config);
  for (const ruleId of ["VF010", "VF011", "VF012", "VF013"]) {
    assert.equal(findings.some((finding) => finding.ruleId === ruleId), false, ruleId);
  }
});

test("incomplete money contracts report missing structural policy evidence", () => {
  const { workflow } = moneyOutcomeFixture();
  workflow.connections.Webhook = { main: [[connection("Record refund audit")]] };
  const config = normalizeConfig({ outcomeContracts: { "Issue refund": { impact: "money" } } });
  const findings = inspectWorkflow(workflow, config);
  const critical = findings.find((finding) => finding.ruleId === "VF010" && finding.node?.name === "Issue refund");
  assert.match(critical.message, /auditNode/);
  assert.match(critical.message, /idempotency/);
  assert.match(critical.message, /approvalNode/);
  assert.match(critical.message, /amountGuard/);
  assert.match(critical.message, /counterpartyGuard/);
  assert.equal(findingForWithConfig(workflow, config, "VF013", "Issue refund"), true);
});

test("customer communications and destructive writes require external outcome contracts", () => {
  const customerMessage = {
    name: "Notify customer",
    type: "n8n-nodes-base.httpRequest",
    parameters: { method: "POST", url: "https://messaging.invalid/customer-message" },
  };
  const destructiveWrite = {
    name: "Execute maintenance query",
    type: "n8n-nodes-base.postgres",
    parameters: { operation: "executeQuery", query: "DELETE FROM records WHERE id = $1" },
  };
  const workflow = workflowWith([customerMessage, destructiveWrite], {}, {
    executionTimeout: 120,
    errorWorkflow: "global-errors",
  });
  assert.equal(findingFor(workflow, "VF011", customerMessage.name), true);
  assert.equal(findingFor(workflow, "VF011", destructiveWrite.name), true);
});

test("audit-like labels cannot hide an uncontracted money action", () => {
  const paymentHistory = {
    name: "Update payment history",
    type: "n8n-nodes-base.postgres",
    parameters: { operation: "update", table: "payment_history" },
  };
  const workflow = workflowWith([paymentHistory], {}, { executionTimeout: 120, errorWorkflow: "global-errors" });
  assert.equal(findingFor(workflow, "VF010", paymentHistory.name), true);
});

test("connected error paths must reach a recognized operator notification", () => {
  const request = {
    name: "Create external record",
    type: "n8n-nodes-base.httpRequest",
    onError: "continueErrorOutput",
    parameters: { method: "POST" },
  };
  const stop = { name: "Failure stop", type: "n8n-nodes-base.noOp", parameters: {} };
  const silent = workflowWith([request, stop], {
    [request.name]: { main: [[], [connection(stop.name)]] },
  });
  assert.equal(findingFor(silent, "VF012", request.name), true);

  const alert = {
    name: "Operator error alert",
    type: "n8n-nodes-base.slack",
    onError: "continueErrorOutput",
    parameters: { channel: "operations", text: "Failure alert" },
  };
  const notified = workflowWith([request, alert, stop], {
    [request.name]: { main: [[], [connection(alert.name)]] },
    [alert.name]: { main: [[], [connection(stop.name)]] },
  });
  assert.equal(findingFor(notified, "VF012", request.name), false);
});

test("named but disconnected policy nodes cannot satisfy an outcome contract", () => {
  const { workflow, config } = moneyOutcomeFixture();
  workflow.connections.Webhook = { main: [[connection("Issue refund")]] };
  assert.equal(findingForWithConfig(workflow, config, "VF010", "Issue refund"), true);
});

test("constant approvals and read-only audit labels do not satisfy outcome contracts", () => {
  const constantApproval = moneyOutcomeFixture();
  constantApproval.workflow.nodes.find((node) => node.name === "Approve refund").parameters = {
    conditions: { boolean: [{ value1: true, value2: true }] },
    note: "approved",
  };
  assert.equal(findingForWithConfig(constantApproval.workflow, constantApproval.config, "VF010", "Issue refund"), true);

  const readOnlyAudit = moneyOutcomeFixture();
  readOnlyAudit.workflow.nodes.find((node) => node.name === "Record refund audit").parameters = {
    operation: "executeQuery",
    query: "SELECT * FROM refund_audit",
  };
  assert.equal(findingForWithConfig(readOnlyAudit.workflow, readOnlyAudit.config, "VF010", "Issue refund"), true);

  const decorativeAmount = moneyOutcomeFixture();
  decorativeAmount.workflow.nodes.find((node) => node.name === "Limit refund amount").parameters = {
    conditions: { boolean: [{ value1: true, value2: true }] },
    note: "={{ $json.amount }}",
    maximum: 500,
    currency: "USD",
  };
  assert.equal(findingForWithConfig(decorativeAmount.workflow, decorativeAmount.config, "VF010", "Issue refund"), true);

  const failOpenAudit = moneyOutcomeFixture();
  const auditNode = failOpenAudit.workflow.nodes.find((node) => node.name === "Record refund audit");
  auditNode.onError = "continueErrorOutput";
  failOpenAudit.workflow.connections["Record refund audit"] = {
    main: [[connection("Approve refund")], [connection("Issue refund")]],
  };
  assert.equal(findingForWithConfig(failOpenAudit.workflow, failOpenAudit.config, "VF010", "Issue refund"), true);
});

test("outcome contracts resist prototype keys and self-referential evidence", () => {
  const prototypeConfig = normalizeConfig(JSON.parse(`{
    "outcomeContracts": {
      "__proto__": { "impact": "customer" }
    }
  }`));
  assert.equal(Object.hasOwn(prototypeConfig.outcomeContracts, "__proto__"), true);
  assert.equal(Object.getPrototypeOf(prototypeConfig.outcomeContracts), Object.prototype);

  const { workflow } = moneyOutcomeFixture();
  const config = normalizeConfig({
    outcomeContracts: {
      "Issue refund": {
        impact: "money",
        approvalNode: "Approve refund",
        auditNode: "Record refund audit",
        failureNotificationNode: "Issue refund",
        amountGuard: { node: "Limit refund amount", maximum: 500, currency: "USD" },
        counterpartyGuard: { node: "Allow refund account", allowed: ["merchant-primary"] },
        recovery: { strategy: "compensate", node: "Issue refund" },
      },
    },
  });
  const findings = inspectWorkflow(workflow, config);
  assert.equal(findings.some((finding) => finding.ruleId === "VF010" && /failureNotificationNode/.test(finding.message)), true);
  assert.equal(findings.some((finding) => finding.ruleId === "VF013"), true);
});

test("outcome contract configuration rejects ambiguous shapes", () => {
  assert.throws(() => normalizeConfig({ outcomeContracts: [] }), /must be an object/);
  assert.throws(() => normalizeConfig({ outcomeContracts: { Refund: { impact: "physical" } } }), /must declare impact/);
  assert.throws(() => normalizeConfig({
    outcomeContracts: { Refund: { impact: "money", amountGuard: { node: "Limit", maximum: -1, currency: "usd" } } },
  }), /positive finite number/);
  assert.throws(() => normalizeConfig({
    outcomeContracts: { Refund: { impact: "money", recovery: { node: "Undo", strategy: "hope" } } },
  }), /must be compensate, rollback, or replay/);
});

test("malformed connection metadata cannot fabricate graph edges", () => {
  const workflow = workflowWith([
    { name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", parameters: {} },
    { name: "Human handoff", type: "n8n-nodes-base.slack", parameters: {} },
  ], {
    "AI Agent": { metadata: [[{ node: "Human handoff", type: "metadata", index: 0 }]] },
  });
  assert.equal(inspectWorkflow(workflow)[0].ruleId, "VF000");
});

test("timeouts have a finite upper bound", () => {
  const workflow = workflowWith([
    { name: "Request", type: "n8n-nodes-base.httpRequest", parameters: {} },
  ], {}, { executionTimeout: 1e300 });
  assert.equal(hasRule(workflow, "VF008"), true);
  workflow.settings.executionTimeout = true;
  assert.equal(hasRule(workflow, "VF008"), true);
});

test("AI resource connections do not create control-flow bypasses", () => {
  const trigger = { name: "Webhook", type: "n8n-nodes-base.webhook", parameters: { authentication: "none" } };
  const guard = {
    name: "Agent enabled kill switch",
    type: "n8n-nodes-base.if",
    parameters: { conditions: { boolean: [{ value1: "={{ $json.agent_enabled }}", value2: true }] } },
  };
  const ai = { name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", parameters: {} };
  const model = { name: "Chat Model", type: "@n8n/n8n-nodes-langchain.lmChatOpenAi", parameters: {} };
  const workflow = workflowWith([trigger, guard, ai, model], {
    Webhook: { main: [[connection(guard.name)]] },
    [guard.name]: { main: [[connection(ai.name)], []] },
    [model.name]: { ai_languageModel: [[{ node: ai.name, type: "ai_languageModel", index: 0 }]] },
  });
  assert.equal(findingFor(workflow, "VF006", ai.name), false);
});

test("analysis budgets cap nodes and findings", () => {
  const tooManyNodes = Array.from({ length: MAX_NODES + 1 }, (_, index) => ({
    name: `Node ${index}`,
    type: "n8n-nodes-base.noOp",
    parameters: {},
  }));
  assert.equal(inspectWorkflow(workflowWith(tooManyNodes))[0].ruleId, "VF000");

  const parameters = Object.fromEntries(Array.from({ length: MAX_FINDINGS_PER_FILE + 100 }, (_, index) => [
    `token_${index}`,
    `literal-secret-${index.toString().padStart(8, "0")}`,
  ]));
  const findings = inspectWorkflow(workflowWith([{ name: "Secrets", type: "n8n-nodes-base.noOp", parameters }]));
  assert.equal(findings.length, MAX_FINDINGS_PER_FILE + 1);
  assert.equal(findings.some((finding) => finding.ruleId === "VF000"), true);
});

test("late-stage finding truncation always fails closed", () => {
  const webhook = {
    name: "Webhook",
    type: "n8n-nodes-base.webhook",
    parameters: { authentication: "headerAuth" },
    credentials: { httpHeaderAuth: { id: "credential-reference" } },
  };
  const ai = { name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", parameters: {} };
  const sideEffects = Array.from({ length: MAX_FINDINGS_PER_FILE + 1 }, (_, index) => ({
    name: `Request ${index}`,
    type: "n8n-nodes-base.httpRequest",
    parameters: {},
  }));
  const connections = {
    Webhook: { main: [[...sideEffects.map((node) => connection(node.name)), connection(ai.name)]] },
  };
  const findings = inspectWorkflow(workflowWith([webhook, ai, ...sideEffects], connections, {
    executionTimeout: 120,
    errorWorkflow: "error-handler-id",
  }));
  assert.equal(findings.some((finding) => finding.ruleId === "VF000"), true);
  assert.equal(findings.some((finding) => finding.severity === "error"), true);
});

test("duplicate node names fail workflow validation", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "vibeflow-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, "duplicate.workflow.json");
  await writeFile(file, JSON.stringify({
    nodes: [
      { name: "Duplicate", type: "n8n-nodes-base.manualTrigger", parameters: {} },
      { name: "Duplicate", type: "n8n-nodes-base.noOp", parameters: {} },
    ],
    connections: {},
  }));

  const result = await checkFile(file);
  assert.equal(result.findings[0].ruleId, "VF000");
  assert.match(result.findings[0].message, /Duplicate node name/);
});

test("text output strips terminal control characters", () => {
  const report = {
    tool: { name: "vibeflow", version: "0.8.0" },
    files: [{
      file: "bad\u001b[2J.workflow.json",
      workflowName: "hostile\nname",
      findings: [{
        ruleId: "VF000",
        severity: "error",
        message: "bad\rmessage",
        node: { name: "node\u001b[31m" },
      }],
    }],
    summary: { files: 1, errors: 1, warnings: 0 },
  };

  const output = formatText(report);
  assert.doesNotMatch(output, /\u001b|\r/);
  assert.doesNotMatch(output, /hostile\nname/);
});

test("CLI sanitizes control characters in error output", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "vibeflow-config-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const config = path.join(directory, "hostile.json");
  await writeFile(config, JSON.stringify({ "\u001b[2J\u202e": true }));

  const result = runCli(["check", safe, "--config", config]);
  assert.equal(result.status, 2);
  assert.doesNotMatch(result.stderr, /\u001b|\u202e/);
  assert.match(result.stderr, /Unknown config key/);
});

test("deeply nested AI parameters do not overflow the call stack", () => {
  let parameters = { value: "safe" };
  for (let index = 0; index < 15_000; index += 1) parameters = { nested: parameters };
  const findings = inspectWorkflow({
    name: "Deep workflow",
    nodes: [{ name: "AI Agent", type: "@n8n/n8n-nodes-langchain.agent", parameters }],
    connections: {},
    settings: { executionTimeout: 120 },
  });

  assert.equal(findings.some((finding) => finding.ruleId === "VF006"), true);
});

function workflowWith(nodes, connections = {}, settings = { executionTimeout: 120 }) {
  return { name: "Test workflow", nodes, connections, settings };
}

function connection(node) {
  return { node, type: "main", index: 0 };
}

function hasRule(workflow, ruleId) {
  return inspectWorkflow(workflow).some((finding) => finding.ruleId === ruleId);
}

function findingFor(workflow, ruleId, nodeName) {
  return inspectWorkflow(workflow).some((finding) => finding.ruleId === ruleId && finding.node?.name === nodeName);
}

function findingForWithConfig(workflow, config, ruleId, nodeName) {
  return inspectWorkflow(workflow, config).some((finding) => finding.ruleId === ruleId && finding.node?.name === nodeName);
}

function moneyOutcomeFixture() {
  const nodes = [
    {
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      parameters: { authentication: "headerAuth" },
      credentials: { httpHeaderAuth: { id: "credential-reference" } },
    },
    {
      name: "Claim idempotency event",
      type: "n8n-nodes-base.postgres",
      parameters: { query: "INSERT INTO event_ledger VALUES ($1) ON CONFLICT DO NOTHING RETURNING event_id" },
    },
    {
      name: "Record refund audit",
      type: "n8n-nodes-base.postgres",
      parameters: { operation: "insert", table: "refund_audit" },
    },
    {
      name: "Approve refund",
      type: "n8n-nodes-base.if",
      parameters: { conditions: { boolean: [{ value1: "={{ $json.approved }}", value2: true }] } },
    },
    {
      name: "Limit refund amount",
      type: "n8n-nodes-base.if",
      parameters: { conditions: { number: [{ value1: "={{ $json.amount }}", operation: "smallerEqual", value2: 500 }] }, currency: "USD" },
    },
    {
      name: "Allow refund account",
      type: "n8n-nodes-base.switch",
      parameters: { value: "={{ $json.counterparty }}", rules: [{ value: "merchant-primary" }] },
    },
    {
      name: "Issue refund",
      type: "n8n-nodes-base.httpRequest",
      onError: "continueErrorOutput",
      parameters: { method: "POST", url: "https://payments.invalid/refund" },
    },
    {
      name: "Notify refund failure",
      type: "n8n-nodes-base.slack",
      parameters: { channel: "operations", text: "Notify failure for refund" },
    },
    {
      name: "Compensate transaction",
      type: "n8n-nodes-base.httpRequest",
      parameters: { method: "POST", url: "https://payments.invalid/reverse", operation: "compensate" },
    },
  ];
  const connections = {
    Webhook: { main: [[connection("Claim idempotency event")]] },
    "Claim idempotency event": { main: [[connection("Record refund audit")]] },
    "Record refund audit": { main: [[connection("Approve refund")]] },
    "Approve refund": { main: [[connection("Limit refund amount")], []] },
    "Limit refund amount": { main: [[connection("Allow refund account")], []] },
    "Allow refund account": { main: [[connection("Issue refund")], []] },
    "Issue refund": { main: [[], [connection("Notify refund failure"), connection("Compensate transaction")]] },
  };
  const workflow = workflowWith(nodes, connections, { executionTimeout: 120, errorWorkflow: "global-errors" });
  const config = normalizeConfig({
    outcomeContracts: {
      "Issue refund": {
        impact: "money",
        approvalNode: "Approve refund",
        auditNode: "Record refund audit",
        failureNotificationNode: "Notify refund failure",
        amountGuard: { node: "Limit refund amount", maximum: 500, currency: "USD" },
        counterpartyGuard: { node: "Allow refund account", allowed: ["merchant-primary"] },
        recovery: { strategy: "compensate", node: "Compensate transaction" },
      },
    },
  });
  return { workflow, config };
}

function runCli(args) {
  return spawnSync(process.execPath, [path.join(root, "bin/vibeflow.mjs"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
}
