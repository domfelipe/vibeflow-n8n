import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export const VERSION = "0.9.0";
export const MAX_WORKFLOW_BYTES = 25 * 1024 * 1024;
export const MAX_CONFIG_BYTES = 256 * 1024;
export const MAX_WORKFLOW_FILES = 1_000;
export const MAX_NODES = 5_000;
export const MAX_EDGES = 20_000;
export const MAX_FINDINGS_PER_FILE = 1_000;
export const MAX_EXECUTION_TIMEOUT_SECONDS = 3_600;

export const RULES = Object.freeze({
  VF000: {
    name: "invalid-workflow",
    severity: "error",
    description: "The input must be valid JSON with an n8n nodes array.",
    remediation: "Export the workflow again and pass a valid n8n workflow JSON file.",
  },
  VF001: {
    name: "embedded-secret",
    severity: "error",
    description: "Literal credentials must not be embedded in node parameters.",
    remediation: "Move the value to n8n credentials, a secret store, or an environment expression.",
  },
  VF002: {
    name: "dangerous-node",
    severity: "error",
    description: "Host-level command, SSH, and local-file nodes expand the blast radius.",
    remediation: "Remove the node or explicitly change the bannedNodeTypes policy after review.",
  },
  VF003: {
    name: "unprotected-webhook",
    severity: "warning",
    description: "Public webhooks should authenticate callers at the trust boundary.",
    remediation: "Configure header or basic authentication, or document and suppress the rule.",
  },
  VF004: {
    name: "missing-error-handling",
    severity: "warning",
    description: "External side effects need an explicit failure path.",
    remediation: "Connect a continueErrorOutput branch or configure workflow.settings.errorWorkflow.",
  },
  VF005: {
    name: "missing-idempotency",
    severity: "warning",
    description: "Inbound workflows with side effects need duplicate-event protection.",
    remediation: "Use an atomic claim that emits no item for duplicates, such as INSERT ... ON CONFLICT DO NOTHING ... RETURNING.",
  },
  VF006: {
    name: "missing-kill-switch",
    severity: "error",
    description: "Customer-facing AI paths need an upstream off switch.",
    remediation: "Gate every AI Agent path with an enabled/status/kill-switch check before inference.",
  },
  VF007: {
    name: "missing-human-handoff",
    severity: "warning",
    description: "AI Agent paths should expose a downstream human fallback.",
    remediation: "Add a confidence or exception branch that creates a ticket or hands off to a human.",
  },
  VF008: {
    name: "missing-timeout",
    severity: "warning",
    description: "AI and external-action workflows should have a bounded execution time.",
    remediation: `Set workflow.settings.executionTimeout between 1 and ${MAX_EXECUTION_TIMEOUT_SECONDS} seconds.`,
  },
  VF009: {
    name: "unsafe-retry",
    severity: "warning",
    description: "Retries need idempotency, bounded attempts, and backoff.",
    remediation: "Add a deduplication guard, keep maxTries between 2 and 5, and wait at least 100 ms.",
  },
  VF010: {
    name: "uncontracted-critical-outcome",
    severity: "error",
    description: "Money and privileged actions need an explicit, structurally verified outcome contract.",
    remediation: "Define an outcomeContracts entry with approval, audit, idempotency, limits, failure notification, and recovery evidence.",
  },
  VF011: {
    name: "uncontracted-external-outcome",
    severity: "warning",
    description: "Customer communications and destructive data writes need an explicit outcome contract.",
    remediation: "Define an outcomeContracts entry that identifies the impact and its audit, notification, and recovery nodes.",
  },
  VF012: {
    name: "silent-error-path",
    severity: "warning",
    description: "A connected error path should notify or escalate to an operator.",
    remediation: "Route the error output to a recognized alert, incident, ticket, or human escalation node.",
  },
  VF013: {
    name: "missing-recovery-contract",
    severity: "warning",
    description: "High-impact writes need a declared compensation, rollback, or replay path.",
    remediation: "Declare a recovery strategy and reference the workflow node that implements it.",
  },
});

const DEFAULT_CONFIG = Object.freeze({
  rules: Object.fromEntries(Object.entries(RULES).map(([id, rule]) => [id, rule.severity])),
  terms: {
    killSwitch: ["agent-off", "kill switch", "agent enabled", "ai enabled", "agent status", "pause ai"],
    humanHandoff: ["human handoff", "handoff", "human review", "escalate", "manual review", "chatwoot", "ticket"],
    idempotency: ["idempotency", "idempotent", "dedupe", "deduplicate", "duplicate", "event ledger", "event id"],
    approval: ["approval", "approved", "authorize", "authorized", "human review"],
    audit: ["audit", "ledger", "journal", "event log", "history"],
    failureNotification: ["error alert", "failure alert", "notify failure", "incident", "pager", "escalate error"],
    outcomeMoney: ["refund", "payment", "payout", "charge", "transfer funds", "withdraw"],
    outcomeCustomer: ["customer message", "customer notification", "notify customer", "client message", "patient message"],
    outcomePrivileged: ["delete account", "revoke access", "grant access", "change role", "disable user", "publish"],
    outcomeData: ["delete record", "drop table", "truncate", "purge", "overwrite data"],
    recovery: ["compensate", "rollback", "replay", "reverse", "restore", "recovery"],
  },
  bannedNodeTypes: [
    "n8n-nodes-base.executecommand",
    "n8n-nodes-base.ssh",
    "n8n-nodes-base.readwritefile",
    "n8n-nodes-base.localfiletrigger",
  ],
  outcomeContracts: {},
});

const SIDE_EFFECT_SUFFIXES = [
  ".httprequest",
  ".slack",
  ".gmail",
  ".emailsend",
  ".postgres",
  ".mysql",
  ".microsoftsql",
  ".redis",
  ".supabase",
  ".stripe",
  ".hubspot",
  ".telegram",
  ".twilio",
  ".salesforce",
  ".notion",
  ".googlesheets",
  ".s3",
  ".github",
  ".airtable",
  ".baserow",
  ".mongodb",
  ".dynamodb",
  ".googledrive",
  ".microsoftonedrive",
  ".microsoftoutlook",
  ".microsoftteams",
  ".discord",
  ".zendesk",
  ".freshdesk",
  ".intercom",
  ".servicenow",
  ".jira",
  ".linear",
  ".trello",
  ".asana",
  ".clickup",
  ".woocommerce",
  ".shopify",
  ".sendgrid",
  ".mailchimp",
  ".rabbitmq",
  ".kafka",
  ".mqtt",
  ".graphql",
];

const HANDOFF_SUFFIXES = [
  ".slack",
  ".gmail",
  ".emailsend",
  ".telegram",
  ".twilio",
  ".microsoftteams",
  ".discord",
  ".zendesk",
  ".freshdesk",
  ".intercom",
  ".servicenow",
  ".jira",
];

const DURABLE_AUDIT_SUFFIXES = [
  ".postgres",
  ".mysql",
  ".microsoftsql",
  ".supabase",
  ".datatable",
  ".mongodb",
  ".dynamodb",
  ".s3",
  ".airtable",
];

const COMMUNICATION_SUFFIXES = [
  ".httprequest",
  ".slack",
  ".gmail",
  ".emailsend",
  ".telegram",
  ".twilio",
  ".microsoftteams",
  ".discord",
  ".zendesk",
  ".freshdesk",
  ".intercom",
  ".servicenow",
  ".jira",
];

const TRIGGER_SUFFIXES = [".webhook", ".formtrigger", ".chattrigger", ".telegramtrigger", ".stripetrigger"];
const SAFE_LITERAL = /^(?:<[^>]+>|redacted|change[-_ ]?me|your[-_ ].*|example(?:[-_ ].*)?|placeholder(?:[-_ ].*)?)$/i;

export async function loadConfig(explicitPath = null, cwd = process.cwd(), locked = false) {
  let configPath = explicitPath;
  if (!configPath) {
    const candidate = path.join(cwd, ".vibeflow.json");
    try {
      await access(candidate);
      configPath = candidate;
    } catch {
      return cloneDefaults();
    }
  }

  const details = await stat(configPath);
  if (details.size > MAX_CONFIG_BYTES) {
    throw new Error(`Config exceeds the ${MAX_CONFIG_BYTES} byte safety limit`);
  }
  const raw = await readFile(configPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid config JSON at ${configPath}: ${error.message}`);
  }
  return normalizeConfig(parsed, { locked });
}

export function normalizeConfig(input = {}, { locked = false } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Vibeflow config must be a JSON object");
  }
  const allowedKeys = new Set(["$schema", "rules", "terms", "bannedNodeTypes", "outcomeContracts"]);
  const unknownKey = Object.keys(input).find((key) => !allowedKeys.has(key));
  if (unknownKey) throw new Error(`Unknown config key: ${unknownKey}`);
  const config = cloneDefaults();

  if (input.rules !== undefined) {
    if (!input.rules || typeof input.rules !== "object" || Array.isArray(input.rules)) {
      throw new Error("config.rules must be an object");
    }
    for (const [ruleId, severity] of Object.entries(input.rules)) {
      if (!RULES[ruleId] || ruleId === "VF000") throw new Error(`Unknown configurable rule: ${ruleId}`);
      if (!["error", "warning", "off"].includes(severity)) {
        throw new Error(`Rule ${ruleId} must be error, warning, or off`);
      }
      if (locked && severityRank(severity) < severityRank(RULES[ruleId].severity)) {
        throw new Error(`Locked policy cannot weaken ${ruleId}`);
      }
      config.rules[ruleId] = severity;
    }
  }

  if (input.terms !== undefined) {
    if (!input.terms || typeof input.terms !== "object" || Array.isArray(input.terms)) {
      throw new Error("config.terms must be an object");
    }
    for (const key of Object.keys(input.terms)) {
      if (!Object.hasOwn(config.terms, key)) throw new Error(`Unknown terms group: ${key}`);
      const values = input.terms[key];
      if (!Array.isArray(values) || values.length > 100 || values.some((value) => typeof value !== "string" || !value.trim() || value.length > 100)) {
        throw new Error(`config.terms.${key} must contain at most 100 non-empty strings of at most 100 characters`);
      }
      if (locked && !sameStringSet(values, DEFAULT_CONFIG.terms[key])) {
        throw new Error(`Locked policy cannot change config.terms.${key}`);
      }
      config.terms[key] = values.map((value) => value.toLowerCase());
    }
  }

  if (input.bannedNodeTypes !== undefined) {
    if (!Array.isArray(input.bannedNodeTypes) || input.bannedNodeTypes.length > 1_000 || input.bannedNodeTypes.some((value) => typeof value !== "string" || !value.trim() || value.length > 200)) {
      throw new Error("config.bannedNodeTypes must contain at most 1000 non-empty strings of at most 200 characters");
    }
    const normalizedTypes = input.bannedNodeTypes.map((value) => value.toLowerCase());
    if (locked && DEFAULT_CONFIG.bannedNodeTypes.some((value) => !normalizedTypes.includes(value))) {
      throw new Error("Locked policy cannot remove default bannedNodeTypes");
    }
    config.bannedNodeTypes = normalizedTypes;
  }

  if (input.outcomeContracts !== undefined) {
    config.outcomeContracts = normalizeOutcomeContracts(input.outcomeContracts);
  }

  return config;
}

export async function checkPaths(inputs, config = cloneDefaults()) {
  const files = await collectWorkflowFiles(inputs);
  if (!files.length) throw new Error("No workflow files found");
  if (files.length > MAX_WORKFLOW_FILES) {
    throw new Error(`Input exceeds the ${MAX_WORKFLOW_FILES} workflow file safety limit`);
  }

  const results = [];
  for (const file of files) results.push(await checkFile(file, config));
  return buildReport(results);
}

export async function checkFile(file, config = cloneDefaults()) {
  let workflow;
  try {
    const details = await stat(file);
    if (details.size > MAX_WORKFLOW_BYTES) {
      return {
        file,
        workflowName: null,
        findings: [invalidFinding(`Workflow exceeds the ${MAX_WORKFLOW_BYTES} byte safety limit`)],
      };
    }
    workflow = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    return { file, workflowName: null, findings: [invalidFinding(`Invalid JSON: ${error.message}`)] };
  }

  const shapeError = validateWorkflowShape(workflow);
  if (shapeError) return { file, workflowName: workflow?.name ?? null, findings: [invalidFinding(shapeError)] };

  return {
    file,
    workflowName: typeof workflow.name === "string" ? workflow.name : null,
    findings: inspectWorkflow(workflow, config),
  };
}

export function inspectWorkflow(workflow, config = cloneDefaults()) {
  const shapeError = validateWorkflowShape(workflow);
  if (shapeError) return [invalidFinding(shapeError)];
  const nodes = workflow.nodes;
  const { adjacency, reverse } = buildGraph(workflow.connections ?? {});
  const nodesByName = new Map(nodes.map((node) => [node.name, node]));
  const aiNodes = nodes.filter(isAiAgent);
  const triggerNodes = nodes.filter(isInboundTrigger);
  const sideEffectNodes = nodes.filter(isSideEffect);
  const entryNames = collectEntryNames(nodes, reverse);
  const aiNames = new Set(aiNodes.map((node) => node.name));
  const killSwitchNames = new Set(nodes
    .filter((node) => isKillSwitchGuard(node, config.terms.killSwitch, workflow.connections ?? {}, adjacency, aiNames))
    .map((node) => node.name));
  const handoffNames = nodes.filter((node) => isHumanHandoff(node, config.terms.humanHandoff)).map((node) => node.name);
  const idempotencyNames = new Set(nodes.filter((node) => isAtomicIdempotencyGuard(node, config.terms.idempotency)).map((node) => node.name));
  const failureNotificationNames = new Set(nodes
    .filter((node) => isFailureNotification(node, config.terms.failureNotification))
    .map((node) => node.name));
  const allReachable = traverseGraph(adjacency, entryNames);
  const reachableWithoutKillSwitch = traverseGraph(adjacency, entryNames, killSwitchNames);
  const canReachHandoff = traverseGraph(reverse, handoffNames);
  const triggerNames = triggerNodes.map((node) => node.name);
  const triggerReachable = traverseGraph(adjacency, triggerNames);
  const workflowHasErrorHandler = typeof workflow.settings?.errorWorkflow === "string" && workflow.settings.errorWorkflow.trim();
  const findings = [];
  let findingsTruncated = false;
  const add = (ruleId, message, node = null, parameterPath = null) => {
    const severity = config.rules[ruleId];
    if (severity === "off" || findingsTruncated) return;
    if (findings.length >= MAX_FINDINGS_PER_FILE) {
      findingsTruncated = true;
      return;
    }
    findings.push({
      ruleId,
      rule: RULES[ruleId].name,
      severity,
      message,
      remediation: RULES[ruleId].remediation,
      node: node ? { id: node.id ?? null, name: node.name ?? null, type: node.type ?? null } : null,
      path: parameterPath,
    });
  };

  for (const node of nodes) {
    const secretResult = findSecretPaths(node.parameters ?? {}, MAX_FINDINGS_PER_FILE - findings.length);
    for (const secretPath of secretResult.paths) {
      add("VF001", `Literal secret-like value at parameters.${secretPath}`, node, `parameters.${secretPath}`);
    }
    if (secretResult.truncated || findingsTruncated) {
      findingsTruncated = true;
      break;
    }

    if (config.bannedNodeTypes.includes(lowerType(node))) {
      add("VF002", `Node type ${node.type} is blocked by the default policy`, node);
    }

    if (lowerType(node).endsWith(".webhook")) {
      const authIssue = webhookAuthenticationIssue(node);
      if (authIssue) add("VF003", authIssue, node, "parameters.authentication");
    }

    if (isSideEffect(node) && !workflowHasErrorHandler && !hasConnectedErrorPath(node, workflow.connections ?? {})) {
      add("VF004", "External-action node has no connected error output or workflow error handler", node);
    }

    if (isSideEffect(node)
      && !failureNotificationNames.has(node.name)
      && !workflowHasErrorHandler
      && hasConnectedErrorPath(node, workflow.connections ?? {})
      && !errorBranchCanReach(node.name, failureNotificationNames, workflow.connections ?? {}, adjacency)) {
      add("VF012", "Connected error output terminates without a recognized operator notification or escalation", node);
    }

    if (isSideEffect(node) && node.retryOnFail === true) {
      const maxTries = Number(node.maxTries ?? 3);
      const waitBetweenTries = Number(node.waitBetweenTries ?? 0);
      if (!idempotencyNames.has(node.name)
        && !hasProtectedIdempotencyPath(node.name, entryNames, idempotencyNames, adjacency, workflow.connections ?? {})) {
        add("VF009", "Retry is enabled on a path without an atomic idempotency guard", node);
      }
      if (!Number.isFinite(maxTries) || maxTries < 2 || maxTries > 5) {
        add("VF009", `Retry budget is outside the safe range: maxTries=${node.maxTries ?? "invalid"}`, node, "maxTries");
      }
      if (!Number.isFinite(waitBetweenTries) || waitBetweenTries < 100) {
        add("VF009", `Retry backoff is too small: waitBetweenTries=${node.waitBetweenTries ?? 0}`, node, "waitBetweenTries");
      }
    }
  }

  if (!findingsTruncated) {
    for (const section of ["pinData", "staticData"]) {
      if (workflow[section] === undefined) continue;
      const secretResult = findSecretPaths(workflow[section], MAX_FINDINGS_PER_FILE - findings.length);
      for (const secretPath of secretResult.paths) {
        const fullPath = secretPath ? `${section}.${secretPath}` : section;
        add("VF001", `Literal secret-like value at ${fullPath}`, null, fullPath);
      }
      if (secretResult.truncated || findingsTruncated) {
        findingsTruncated = true;
        break;
      }
    }
  }

  if (findingsTruncated) {
    return finalizeFindings(findings, true);
  }

  for (const sideEffectNode of sideEffectNodes) {
    if (!failureNotificationNames.has(sideEffectNode.name)
      && !idempotencyNames.has(sideEffectNode.name)
      && triggerReachable.has(sideEffectNode.name)
      && !hasProtectedIdempotencyPath(sideEffectNode.name, triggerNames, idempotencyNames, adjacency, workflow.connections ?? {})) {
      add("VF005", "Inbound path reaches this external side effect without an atomic idempotency guard", sideEffectNode);
    }
  }

  inspectOutcomeContracts({
    nodes,
    nodesByName,
    config,
    adjacency,
    connections: workflow.connections ?? {},
    entryNames,
    allReachable,
    idempotencyNames,
    failureNotificationNames,
    add,
  });

  for (const aiNode of aiNodes) {
    if (!allReachable.has(aiNode.name) || reachableWithoutKillSwitch.has(aiNode.name)) {
      add("VF006", "At least one entry path reaches the AI Agent without a structural kill-switch gate", aiNode);
    }

    if (!canReachHandoff.has(aiNode.name)) {
      add("VF007", "AI Agent has no reachable external-action node identified as human handoff", aiNode);
    }
  }

  const executionTimeout = Number(workflow.settings?.executionTimeout ?? 0);
  if ((aiNodes.length || sideEffectNodes.length)
    && (typeof workflow.settings?.executionTimeout !== "number"
      || !Number.isFinite(executionTimeout) || executionTimeout <= 0 || executionTimeout > MAX_EXECUTION_TIMEOUT_SECONDS)) {
    add("VF008", `Workflow execution timeout must be between 1 and ${MAX_EXECUTION_TIMEOUT_SECONDS} seconds`, null, "settings.executionTimeout");
  }

  return finalizeFindings(findings, findingsTruncated);
}

export function formatText(report) {
  const lines = [];
  for (const file of report.files) {
    const fileName = safeDisplay(file.file);
    const workflowName = file.workflowName ? ` (${safeDisplay(file.workflowName)})` : "";
    lines.push(`${file.findings.length ? "✖" : "✓"} ${fileName}${workflowName}`);
    for (const finding of file.findings) {
      const node = finding.node?.name ? ` [${safeDisplay(finding.node.name)}]` : "";
      lines.push(`  ${finding.severity.toUpperCase()} ${finding.ruleId}${node} ${safeDisplay(finding.message)}`);
      lines.push(`    Fix: ${finding.remediation}`);
    }
  }
  lines.push("");
  lines.push(`Checked ${report.summary.files} workflow(s): ${report.summary.errors} error(s), ${report.summary.warnings} warning(s)`);
  return lines.join("\n");
}

export function formatJson(report) {
  return JSON.stringify(report, null, 2);
}

export function formatSarif(report) {
  const sarif = {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [{
      tool: {
        driver: {
          name: "Vibeflow",
          version: VERSION,
          informationUri: "https://github.com/domfelipe/vibeflow-n8n",
          rules: Object.entries(RULES).map(([id, rule]) => ({
            id,
            name: rule.name,
            shortDescription: { text: rule.description },
            help: { text: rule.remediation },
            defaultConfiguration: { level: sarifLevel(rule.severity) },
          })),
        },
      },
      results: report.files.flatMap((file) => file.findings.map((finding) => ({
        ruleId: finding.ruleId,
        level: sarifLevel(finding.severity),
        message: { text: `${finding.message}${finding.node?.name ? ` (node: ${finding.node.name})` : ""}` },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: relativeUri(file.file) },
            region: { startLine: 1 },
          },
        }],
      }))),
    }],
  };
  return JSON.stringify(sarif, null, 2);
}

function cloneDefaults() {
  return {
    rules: { ...DEFAULT_CONFIG.rules },
    terms: Object.fromEntries(Object.entries(DEFAULT_CONFIG.terms).map(([key, values]) => [key, [...values]])),
    bannedNodeTypes: [...DEFAULT_CONFIG.bannedNodeTypes],
    outcomeContracts: {},
  };
}

function normalizeOutcomeContracts(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("config.outcomeContracts must be an object keyed by exact node name");
  }
  const entries = Object.entries(input);
  if (entries.length > 1_000) throw new Error("config.outcomeContracts must contain at most 1000 entries");
  const normalizedEntries = [];
  for (const [nodeName, value] of entries) {
    if (!nodeName.trim() || nodeName.length > 200) {
      throw new Error("Outcome contract node names must contain 1 to 200 characters");
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Outcome contract for ${safeDisplay(nodeName)} must be an object`);
    }
    const allowedKeys = new Set([
      "impact", "approvalNode", "auditNode", "failureNotificationNode",
      "amountGuard", "counterpartyGuard", "recovery",
    ]);
    const unknownKey = Object.keys(value).find((key) => !allowedKeys.has(key));
    if (unknownKey) throw new Error(`Unknown outcome contract key for ${safeDisplay(nodeName)}: ${safeDisplay(unknownKey)}`);
    if (!["money", "customer", "privileged", "data"].includes(value.impact)) {
      throw new Error(`Outcome contract for ${safeDisplay(nodeName)} must declare impact as money, customer, privileged, or data`);
    }
    for (const field of ["approvalNode", "auditNode", "failureNotificationNode"]) {
      if (value[field] !== undefined) validateNodeReference(value[field], `${nodeName}.${field}`);
    }
    if (value.amountGuard !== undefined) {
      validateNestedContract(value.amountGuard, `${nodeName}.amountGuard`, ["node", "maximum", "currency"]);
      validateNodeReference(value.amountGuard.node, `${nodeName}.amountGuard.node`);
      if (typeof value.amountGuard.maximum !== "number" || !Number.isFinite(value.amountGuard.maximum) || value.amountGuard.maximum <= 0) {
        throw new Error(`Outcome contract ${safeDisplay(nodeName)}.amountGuard.maximum must be a positive finite number`);
      }
      if (typeof value.amountGuard.currency !== "string" || !/^[A-Z]{3}$/.test(value.amountGuard.currency)) {
        throw new Error(`Outcome contract ${safeDisplay(nodeName)}.amountGuard.currency must be a three-letter uppercase currency code`);
      }
    }
    if (value.counterpartyGuard !== undefined) {
      validateNestedContract(value.counterpartyGuard, `${nodeName}.counterpartyGuard`, ["node", "allowed"]);
      validateNodeReference(value.counterpartyGuard.node, `${nodeName}.counterpartyGuard.node`);
      if (!Array.isArray(value.counterpartyGuard.allowed)
        || !value.counterpartyGuard.allowed.length
        || value.counterpartyGuard.allowed.length > 100
        || value.counterpartyGuard.allowed.some((item) => typeof item !== "string" || !item.trim() || item.length > 100)) {
        throw new Error(`Outcome contract ${safeDisplay(nodeName)}.counterpartyGuard.allowed must contain 1 to 100 non-empty strings`);
      }
    }
    if (value.recovery !== undefined) {
      validateNestedContract(value.recovery, `${nodeName}.recovery`, ["strategy", "node"]);
      validateNodeReference(value.recovery.node, `${nodeName}.recovery.node`);
      if (!["compensate", "rollback", "replay"].includes(value.recovery.strategy)) {
        throw new Error(`Outcome contract ${safeDisplay(nodeName)}.recovery.strategy must be compensate, rollback, or replay`);
      }
    }
    normalizedEntries.push([nodeName, structuredClone(value)]);
  }
  return Object.fromEntries(normalizedEntries);
}

function validateNestedContract(value, pathName, allowedKeys) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Outcome contract ${safeDisplay(pathName)} must be an object`);
  }
  const unknownKey = Object.keys(value).find((key) => !allowedKeys.includes(key));
  if (unknownKey) throw new Error(`Unknown outcome contract key ${safeDisplay(pathName)}.${safeDisplay(unknownKey)}`);
}

function validateNodeReference(value, pathName) {
  if (typeof value !== "string" || !value.trim() || value.length > 200) {
    throw new Error(`Outcome contract ${safeDisplay(pathName)} must be a non-empty node name of at most 200 characters`);
  }
}

async function collectWorkflowFiles(inputs) {
  const files = new Set();
  for (const input of inputs) {
    const absolute = path.resolve(input);
    let details;
    try {
      details = await stat(absolute);
    } catch {
      throw new Error(`Input not found: ${input}`);
    }
    if (details.isFile()) addWorkflowFile(files, absolute);
    else if (details.isDirectory()) await collectDirectory(absolute, files);
    else throw new Error(`Unsupported input: ${input}`);
  }
  return [...files].sort();
}

async function collectDirectory(directory, files) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectDirectory(absolute, files);
    else if (entry.isFile() && entry.name.endsWith(".workflow.json")) addWorkflowFile(files, absolute);
  }
}

function addWorkflowFile(files, file) {
  files.add(file);
  if (files.size > MAX_WORKFLOW_FILES) {
    throw new Error(`Input exceeds the ${MAX_WORKFLOW_FILES} workflow file safety limit`);
  }
}

function invalidFinding(message) {
  return {
    ruleId: "VF000",
    rule: RULES.VF000.name,
    severity: "error",
    message,
    remediation: RULES.VF000.remediation,
    node: null,
    path: null,
  };
}

function buildReport(files) {
  const normalizedFiles = files.map((file) => ({ ...file, file: relativeUri(file.file) }));
  const findings = normalizedFiles.flatMap((file) => file.findings);
  return {
    tool: { name: "vibeflow", version: VERSION },
    files: normalizedFiles,
    summary: {
      files: normalizedFiles.length,
      errors: findings.filter((finding) => finding.severity === "error").length,
      warnings: findings.filter((finding) => finding.severity === "warning").length,
    },
  };
}

function buildGraph(connections) {
  const adjacency = new Map();
  const reverse = new Map();
  for (const [source, outputs] of Object.entries(connections)) {
    for (const connectionsAtIndex of outputs.main ?? []) {
      if (!connectionsAtIndex) continue;
      for (const connection of connectionsAtIndex) {
        if (connection.type !== "main") continue;
        if (!adjacency.has(source)) adjacency.set(source, new Set());
        if (!reverse.has(connection.node)) reverse.set(connection.node, new Set());
        adjacency.get(source).add(connection.node);
        reverse.get(connection.node).add(source);
      }
    }
  }
  return { adjacency, reverse };
}

function traverseGraph(graph, starts, blockers = new Set()) {
  const queue = [...starts];
  const seen = new Set();
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const name = queue[cursor];
    if (seen.has(name) || blockers.has(name)) continue;
    seen.add(name);
    for (const next of graph.get(name) ?? []) queue.push(next);
  }
  return seen;
}

function collectEntryNames(nodes, reverse) {
  const names = new Set(nodes.filter(isEntryTrigger).map((node) => node.name));
  for (const node of nodes) {
    if (!(reverse.get(node.name)?.size)) names.add(node.name);
  }
  return [...names];
}

function findSecretPaths(parameters, limit = MAX_FINDINGS_PER_FILE) {
  const findings = new Set();
  let truncated = false;
  walk(parameters, "", (value, key, object, currentPath) => {
    if (typeof value === "string" && ((isSensitiveKey(key) && isLiteralSecret(value)) || looksLikeEmbeddedSecret(value))) {
      findings.add(currentPath);
    }
    if (object && typeof object === "object" && !Array.isArray(object)) {
      const label = object.name ?? object.key ?? object.headerName;
      if (typeof label === "string" && isSensitiveKey(label) && key === "value" && isLiteralSecret(value)) {
        findings.add(currentPath);
      }
    }
    if (findings.size >= limit) {
      truncated = true;
      return false;
    }
    return true;
  });
  return { paths: [...findings].sort(), truncated };
}

function walk(value, currentPath, visitor, parent = null) {
  const stack = [{ value, currentPath, parent }];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item.value)) {
      for (let index = item.value.length - 1; index >= 0; index -= 1) {
        stack.push({ value: item.value[index], currentPath: `${item.currentPath}[${index}]`, parent: item.value });
      }
      continue;
    }
    if (!item.value || typeof item.value !== "object") continue;
    const entries = Object.entries(item.value);
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const [key, child] = entries[index];
      const childPath = item.currentPath ? `${item.currentPath}.${key}` : key;
      if (visitor(child, key, item.value, childPath, item.parent) === false) return false;
      stack.push({ value: child, currentPath: childPath, parent: item.value });
    }
  }
  return true;
}

function isSensitiveKey(key) {
  const normalized = String(key).replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (/(url|uri|name|type|id|path|field)$/.test(normalized)) return false;
  return /(apikey|accesstoken|refreshtoken|token|password|secret|authorization)/.test(normalized);
}

function isLiteralSecret(value) {
  const normalized = stripExpressions(value).trim();
  return normalized.length >= 8 && !SAFE_LITERAL.test(normalized);
}

function looksLikeEmbeddedSecret(value) {
  const original = String(value).trim();
  if (/\bbearer\s+[a-z0-9._~+/=-]{8,}/i.test(original)
    || /(?:access[_-]?token|refresh[_-]?token|api[_-]?key|client[_-]?secret|authorization|password)["'\s:=]+[a-z0-9._~+/=-]{8,}/i.test(original)
    || /^[a-z][a-z0-9+.-]*:\/\/[^/\s:]+:[^@\s]{8,}@/i.test(original)) return true;
  const normalized = stripExpressions(original).trim();
  if (normalized.length < 8 || SAFE_LITERAL.test(normalized)) return false;
  return /\bbearer\s+[a-z0-9._~+/=-]{8,}/i.test(normalized)
    || /(?:access[_-]?token|refresh[_-]?token|api[_-]?key|client[_-]?secret|authorization|password)["'\s:=]+[a-z0-9._~+/=-]{8,}/i.test(normalized)
    || /^[a-z][a-z0-9+.-]*:\/\/[^/\s:]+:[^@\s]{8,}@/i.test(normalized);
}

function stripExpressions(value) {
  return String(value)
    .replace(/\{\{[\s\S]*?\}\}/g, "")
    .replace(/\$\{[^}]*\}/g, "")
    .replace(/\$(?:env|credentials|secrets)(?:\.[a-z0-9_]+|\[[^\]]+\])/gi, "");
}

function lowerType(node) {
  return String(node?.type ?? "").toLowerCase();
}

function isAiAgent(node) {
  const type = lowerType(node);
  return type.endsWith(".agent") || type.endsWith(".chainllm") || type.endsWith(".questionandanswerchain");
}

function isInboundTrigger(node) {
  const type = lowerType(node);
  if (TRIGGER_SUFFIXES.some((suffix) => type.endsWith(suffix))) return true;
  if (!type.endsWith("trigger")) return false;
  return ![".manualtrigger", ".scheduletrigger", ".errortrigger", ".executeworkflowtrigger", ".localfiletrigger"].some((suffix) => type.endsWith(suffix));
}

function isEntryTrigger(node) {
  const type = lowerType(node);
  return isInboundTrigger(node)
    || [".manualtrigger", ".scheduletrigger", ".executeworkflowtrigger", ".errortrigger", ".cron", ".start"].some((suffix) => type.endsWith(suffix));
}

function isSideEffect(node) {
  const type = lowerType(node);
  if (SIDE_EFFECT_SUFFIXES.some((suffix) => type.endsWith(suffix))) return true;
  const operation = String(node.parameters?.operation ?? node.parameters?.resourceOperation ?? "").toLowerCase();
  return /^(?:create|update|delete|append|insert|upsert|send|post|publish|upload|move|copy|add|remove|executequery)$/.test(operation);
}

function webhookAuthenticationIssue(node) {
  const authentication = String(node.parameters?.authentication ?? "none").toLowerCase();
  if (["none", "", "undefined"].includes(authentication)) {
    return "Webhook accepts requests without n8n authentication";
  }
  if (!["basicauth", "headerauth", "jwtauth"].includes(authentication)) {
    return `Webhook uses an unrecognized authentication mode: ${safeDisplay(authentication)}`;
  }
  const credentials = node.credentials;
  const expectedCredentialKeys = {
    basicauth: ["httpbasicauth"],
    headerauth: ["httpheaderauth"],
    jwtauth: ["jwtauth"],
  }[authentication];
  const hasReference = credentials && typeof credentials === "object" && !Array.isArray(credentials)
    && Object.entries(credentials).some(([key, reference]) => expectedCredentialKeys.includes(key.toLowerCase())
      && reference && typeof reference === "object" && !Array.isArray(reference)
      && [reference.id, reference.name].some((value) => typeof value === "string" && value.trim()));
  if (!hasReference) {
    return `Webhook declares ${authentication} but has no credential reference`;
  }
  return null;
}

function hasConnectedErrorPath(node, connections) {
  if (node.onError !== "continueErrorOutput") return false;
  const mainOutputs = connections[node.name]?.main;
  return Array.isArray(mainOutputs) && mainOutputs.slice(1).some((output) => Array.isArray(output)
    && output.some((connection) => reachesTerminalWithout(connection.node, node.name, connections)));
}

function inspectOutcomeContracts({
  nodes,
  nodesByName,
  config,
  adjacency,
  connections,
  entryNames,
  allReachable,
  idempotencyNames,
  failureNotificationNames,
  add,
}) {
  const contracts = config.outcomeContracts ?? {};
  const evidenceNodeNames = new Set(Object.values(contracts).flatMap((contract) => [
    contract.auditNode,
    contract.failureNotificationNode,
    contract.recovery?.node,
  ]).filter(Boolean));
  const inspected = new Set();

  for (const node of nodes) {
    const contract = contracts[node.name];
    const impact = contract?.impact ?? (evidenceNodeNames.has(node.name) ? null : classifyOutcome(node, config.terms));
    if (!impact) continue;
    inspected.add(node.name);
    const ruleId = ["money", "privileged"].includes(impact) ? "VF010" : "VF011";
    if (!contract) {
      add(ruleId, `Detected ${impact} outcome has no outcomeContracts entry`, node);
      add("VF013", `Detected ${impact} outcome has no declared recovery strategy`, node);
      continue;
    }

    const issues = [];
    const recoveryIssues = [];
    const auditNode = nodesByName.get(contract.auditNode);
    if (!auditNode) {
      issues.push("missing auditNode reference");
    } else if (!isDurableAuditNode(auditNode, config.terms.audit)) {
      issues.push(`auditNode ${contract.auditNode} is not recognized as a durable audit write`);
    } else if (!dominatesTarget(contract.auditNode, node.name, adjacency, entryNames, allReachable)) {
      issues.push(`auditNode ${contract.auditNode} does not guard every entry path to the action`);
    } else if (errorBranchCanReach(contract.auditNode, new Set([node.name]), connections, adjacency)) {
      issues.push(`auditNode ${contract.auditNode} can reach the action after an audit failure`);
    }

    const notificationNode = nodesByName.get(contract.failureNotificationNode);
    if (!notificationNode || contract.failureNotificationNode === node.name) {
      issues.push("missing failureNotificationNode reference");
    } else if (!failureNotificationNames.has(contract.failureNotificationNode)) {
      issues.push(`failureNotificationNode ${contract.failureNotificationNode} is not recognized as an operator alert`);
    } else if (!errorBranchCanReach(node.name, new Set([contract.failureNotificationNode]), connections, adjacency)) {
      issues.push(`failureNotificationNode ${contract.failureNotificationNode} is not reachable from the action error output`);
    }

    if (!hasProtectedIdempotencyPath(node.name, entryNames, idempotencyNames, adjacency, connections)) {
      issues.push("an entry path reaches the action without an atomic idempotency claim");
    }

    if (["money", "privileged"].includes(impact)) {
      const approvalNode = nodesByName.get(contract.approvalNode);
      if (!approvalNode) {
        issues.push("missing approvalNode reference");
      } else if (!isStructuralGuard(approvalNode, node.name, adjacency, connections, entryNames, allReachable)
        || !lowerType(approvalNode).endsWith(".if")
        || !hasPositiveDynamicBooleanCondition(approvalNode.parameters ?? {}, config.terms.approval)) {
        issues.push(`approvalNode ${contract.approvalNode} is not a dominating approval gate with a deny branch`);
      }
    }

    if (impact === "money") {
      const amountNode = nodesByName.get(contract.amountGuard?.node);
      if (!amountNode) {
        issues.push("missing amountGuard node reference");
      } else if (!isStructuralGuard(amountNode, node.name, adjacency, connections, entryNames, allReachable)
        || !hasDynamicUpperBound(amountNode.parameters ?? {}, contract.amountGuard.maximum)
        || !nodeContainsExactValue(amountNode.parameters ?? {}, contract.amountGuard.currency)) {
        issues.push(`amountGuard ${contract.amountGuard.node} does not structurally enforce the declared maximum and currency`);
      }

      const counterpartyNode = nodesByName.get(contract.counterpartyGuard?.node);
      if (!counterpartyNode) {
        issues.push("missing counterpartyGuard node reference");
      } else if (!isStructuralGuard(counterpartyNode, node.name, adjacency, connections, entryNames, allReachable)
        || !valueContainsDirectDynamicReference(counterpartyNode.parameters ?? {})
        || !contract.counterpartyGuard.allowed.every((value) => nodeContainsExactValue(counterpartyNode.parameters ?? {}, value))) {
        issues.push(`counterpartyGuard ${contract.counterpartyGuard.node} does not structurally enforce every allowed counterparty`);
      }
    }

    const recoveryNode = nodesByName.get(contract.recovery?.node);
    if (!recoveryNode || contract.recovery?.node === node.name) {
      recoveryIssues.push("missing recovery node reference");
    } else if (!nodeContainsTerms(recoveryNode, config.terms.recovery)) {
      recoveryIssues.push(`recovery node ${contract.recovery.node} is not recognized as compensation, rollback, or replay logic`);
    } else if (["compensate", "rollback"].includes(contract.recovery.strategy)
      && !traverseGraph(adjacency, [node.name]).has(contract.recovery.node)) {
      recoveryIssues.push(`${contract.recovery.strategy} node ${contract.recovery.node} is not downstream from the action`);
    }

    if (issues.length) add(ruleId, `Outcome contract is incomplete: ${issues.join("; ")}`, node);
    if (recoveryIssues.length) add("VF013", `Recovery contract is incomplete: ${recoveryIssues.join("; ")}`, node);
  }

  for (const [nodeName, contract] of Object.entries(contracts)) {
    if (inspected.has(nodeName) || nodesByName.has(nodeName)) continue;
    const ruleId = ["money", "privileged"].includes(contract.impact) ? "VF010" : "VF011";
    add(ruleId, `Outcome contract references missing action node: ${nodeName}`);
  }
}

function classifyOutcome(node, terms) {
  if (!isOutcomeAction(node)) return null;
  if (nodeContainsTerms(node, terms.outcomeMoney)) return "money";
  if (nodeContainsTerms(node, terms.outcomePrivileged)) return "privileged";
  if (isDestructiveDataAction(node) || nodeContainsTerms(node, terms.outcomeData)) return "data";
  if (isCommunicationNode(node) && nodeContainsTerms(node, terms.outcomeCustomer)) return "customer";
  return null;
}

function isCommunicationNode(node) {
  return COMMUNICATION_SUFFIXES.some((suffix) => lowerType(node).endsWith(suffix));
}

function isOutcomeAction(node) {
  if (!isSideEffect(node)) return false;
  if (!lowerType(node).endsWith(".httprequest")) return true;
  return ["POST", "PUT", "PATCH", "DELETE"].includes(String(node.parameters?.method ?? "GET").toUpperCase());
}

function isDestructiveDataAction(node) {
  if (!DURABLE_AUDIT_SUFFIXES.some((suffix) => lowerType(node).endsWith(suffix))) return false;
  const operation = String(node.parameters?.operation ?? node.parameters?.resourceOperation ?? "").toLowerCase();
  if (["delete", "remove", "truncate", "drop"].includes(operation)) return true;
  return nodeContainsSqlStatement(node.parameters ?? {}, /^\s*(?:delete\s+from|drop\s+(?:table|schema|database)|truncate\b)/i);
}

function isFailureNotification(node, terms) {
  if (!isCommunicationNode(node) || !nodeContainsTerms(node, terms)) return false;
  if (!lowerType(node).endsWith(".httprequest")) return true;
  return ["POST", "PUT", "PATCH"].includes(String(node.parameters?.method ?? "GET").toUpperCase());
}

function errorBranchCanReach(nodeName, targetNames, connections, adjacency) {
  const branches = connections[nodeName]?.main;
  if (!Array.isArray(branches)) return false;
  const starts = branches.slice(1).flatMap((branch) => (branch ?? []))
    .filter((connection) => connection.type === "main")
    .map((connection) => connection.node);
  if (!starts.length) return false;
  const reachable = traverseGraph(adjacency, starts);
  return [...targetNames].some((target) => reachable.has(target));
}

function isDurableAuditNode(node, terms) {
  if (!DURABLE_AUDIT_SUFFIXES.some((suffix) => lowerType(node).endsWith(suffix))
    || !nodeContainsTerms(node, terms)
    || node.continueOnFail === true
    || node.onError === "continueRegularOutput") return false;
  const operation = String(node.parameters?.operation ?? node.parameters?.resourceOperation ?? "").toLowerCase();
  if (["create", "update", "append", "insert", "upsert", "add", "put"].includes(operation)) return true;
  if (operation && operation !== "executequery") return false;
  return nodeContainsSqlStatement(node.parameters ?? {}, /^\s*(?:insert|update|merge)\b/i);
}

function dominatesTarget(blockerName, targetName, adjacency, entryNames, allReachable) {
  if (blockerName === targetName || !allReachable.has(targetName)) return false;
  return !traverseGraph(adjacency, entryNames, new Set([blockerName])).has(targetName);
}

function isStructuralGuard(node, targetName, adjacency, connections, entryNames, allReachable) {
  if (![".if", ".switch"].some((suffix) => lowerType(node).endsWith(suffix))) return false;
  if (!dominatesTarget(node.name, targetName, adjacency, entryNames, allReachable)) return false;
  const branches = connections[node.name]?.main;
  if (!Array.isArray(branches) || branches.length < 2) return false;
  const reachesTarget = branches.map((branch) => {
    const starts = (branch ?? []).filter((connection) => connection.type === "main").map((connection) => connection.node);
    return starts.length > 0 && traverseGraph(adjacency, starts).has(targetName);
  });
  return reachesTarget.some(Boolean) && reachesTarget.some((value) => !value);
}

function nodeContainsExactValue(input, expected) {
  const normalizedExpected = typeof expected === "string" ? expected.trim().toLowerCase() : expected;
  const stack = [input];
  while (stack.length) {
    const value = stack.pop();
    if (typeof value === "string" && typeof normalizedExpected === "string" && value.trim().toLowerCase() === normalizedExpected) return true;
    if (typeof value === "number" && typeof normalizedExpected === "number" && value === normalizedExpected) return true;
    if (Array.isArray(value)) {
      for (const child of value) stack.push(child);
    } else if (value && typeof value === "object") {
      for (const child of Object.values(value)) stack.push(child);
    }
  }
  return false;
}

function hasDynamicUpperBound(input, maximum) {
  const stack = [input];
  const allowedOperations = new Set(["smaller", "smallerequal", "lessthan", "lessthanorequal", "lte"]);
  while (stack.length) {
    const value = stack.pop();
    if (Array.isArray(value)) {
      for (const child of value) stack.push(child);
      continue;
    }
    if (!value || typeof value !== "object") continue;
    const values = Object.values(value);
    const operation = String(value.operation ?? "").toLowerCase().replace(/[^a-z]/g, "");
    if (allowedOperations.has(operation)
      && values.some((child) => typeof child === "string" && isDirectDynamicReference(child))
      && values.some((child) => typeof child === "number" && child === maximum)) return true;
    for (const child of values) stack.push(child);
  }
  return false;
}

function valueContainsDirectDynamicReference(input) {
  const stack = [input];
  while (stack.length) {
    const value = stack.pop();
    if (typeof value === "string" && isDirectDynamicReference(value)) return true;
    if (Array.isArray(value)) {
      for (const child of value) stack.push(child);
    } else if (value && typeof value === "object") {
      for (const child of Object.values(value)) stack.push(child);
    }
  }
  return false;
}

function reachesTerminalWithout(start, excluded, connections) {
  const stack = [start];
  const seen = new Set();
  while (stack.length) {
    const current = stack.pop();
    if (current === excluded || seen.has(current)) continue;
    seen.add(current);
    const next = (connections[current]?.main ?? []).flatMap((output) => (output ?? []))
      .filter((connection) => connection.type === "main")
      .map((connection) => connection.node);
    if (!next.length) return true;
    for (const name of next) stack.push(name);
  }
  return false;
}

function isKillSwitchGuard(node, terms, connections, adjacency, aiNames) {
  if (!lowerType(node).endsWith(".if") || !hasPositiveDynamicBooleanCondition(node.parameters ?? {}, terms)) return false;
  const branches = connections[node.name]?.main;
  if (!Array.isArray(branches) || branches.length < 2) return false;
  const trueTargets = (branches[0] ?? []).filter((connection) => connection.type === "main").map((connection) => connection.node);
  const falseTargets = branches.slice(1).flatMap((branch) => (branch ?? [])
    .filter((connection) => connection.type === "main").map((connection) => connection.node));
  const trueReachable = traverseGraph(adjacency, trueTargets);
  const falseReachable = traverseGraph(adjacency, falseTargets);
  return [...aiNames].some((name) => trueReachable.has(name))
    && ![...aiNames].some((name) => falseReachable.has(name));
}

function hasPositiveDynamicBooleanCondition(parameters, terms) {
  const stack = [parameters];
  while (stack.length) {
    const value = stack.pop();
    if (Array.isArray(value)) {
      for (const child of value) stack.push(child);
      continue;
    }
    if (!value || typeof value !== "object") continue;
    const dynamicValue = Object.values(value).find((child) => typeof child === "string"
      && isDirectDynamicReference(child)
      && valueContainsTerms(child, terms));
    const operation = String(value.operation ?? "").toLowerCase().replace(/[^a-z]/g, "");
    const positiveOperation = !operation || ["equal", "equals", "istrue", "true"].includes(operation);
    const positiveExpectation = value.value2 === true || ["istrue", "true"].includes(operation);
    if (dynamicValue && positiveOperation && positiveExpectation) return true;
    for (const child of Object.values(value)) stack.push(child);
  }
  return false;
}

function isDirectDynamicReference(value) {
  return /^\s*=?\{\{\s*\$(?:json|vars|env|workflow)(?:\.[a-z0-9_]+|\[['"][^'"]+['"]\])+\s*\}\}\s*$/i.test(value);
}

function isHumanHandoff(node, terms) {
  if (!nodeContainsTerms(node, terms)) return false;
  const type = lowerType(node);
  if (HANDOFF_SUFFIXES.some((suffix) => type.endsWith(suffix))) return true;
  if (type.endsWith(".httprequest")) {
    return ["POST", "PUT", "PATCH"].includes(String(node.parameters?.method ?? "GET").toUpperCase());
  }
  return false;
}

function isAtomicIdempotencyGuard(node, terms) {
  if (!nodeContainsTerms(node, terms) || node.continueOnFail === true || node.onError === "continueRegularOutput") return false;
  const type = lowerType(node);
  const parameters = node.parameters ?? {};
  return type.endsWith(".postgres")
    && nodeContainsSqlStatement(parameters, /^\s*insert\b[\s\S]*\bon\s+conflict\b[\s\S]*\bdo\s+nothing\b[\s\S]*\breturning\b/i);
}

function hasProtectedIdempotencyPath(targetName, starts, idempotencyNames, adjacency, connections) {
  const validGuards = new Set([...idempotencyNames].filter((guardName) =>
    !errorBranchCanReach(guardName, new Set([targetName]), connections, adjacency)));
  if (!validGuards.size || !traverseGraph(adjacency, starts).has(targetName)) return false;
  return !traverseGraph(adjacency, starts, validGuards).has(targetName);
}

function nodeContainsSqlStatement(value, pattern) {
  let matches = false;
  walk({ value }, "", (child) => {
    if (typeof child !== "string") return true;
    const withoutComments = child.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\r\n]*/g, " ");
    const withoutLiterals = withoutComments
      .replace(/\$\$[\s\S]*?\$\$/g, "''")
      .replace(/'(?:''|[^'])*'/g, "''")
      .replace(/"(?:""|[^"])*"/g, '""');
    const firstStatement = withoutLiterals.split(";", 1)[0];
    if (pattern.test(firstStatement)) {
      matches = true;
      return false;
    }
    return true;
  });
  return matches;
}

function nodeContainsTerms(node, terms) {
  return valueContainsTerms([node.name ?? "", node.type ?? "", node.parameters ?? {}], terms);
}

function valueContainsTerms(input, terms) {
  const normalize = (value) => value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  const needles = terms.map((term) => normalize(term));
  const stack = [input];
  while (stack.length) {
    const value = stack.pop();
    if (typeof value === "string") {
      const normalized = normalize(value);
      if (needles.some((term) => normalized.includes(term))) return true;
    } else if (Array.isArray(value)) {
      for (const child of value) stack.push(child);
    } else if (value && typeof value === "object") {
      for (const child of Object.values(value)) stack.push(child);
    }
  }
  return false;
}

function sarifLevel(severity) {
  return severity === "error" ? "error" : severity === "warning" ? "warning" : "note";
}

function relativeUri(file) {
  const relative = path.isAbsolute(file) ? path.relative(process.cwd(), file) : file;
  return (relative || path.basename(file)).split(path.sep).join("/");
}

function validateWorkflowShape(workflow) {
  if (!workflow || typeof workflow !== "object" || Array.isArray(workflow) || !Array.isArray(workflow.nodes)) {
    return "Expected an object with a nodes array";
  }
  if (workflow.nodes.length > MAX_NODES) return `Workflow exceeds the ${MAX_NODES} node safety limit`;
  const names = new Set();
  for (const node of workflow.nodes) {
    if (!node || typeof node !== "object" || typeof node.name !== "string" || !node.name || typeof node.type !== "string" || !node.type) {
      return "Every node must be an object with non-empty string name and type fields";
    }
    if (names.has(node.name)) return `Duplicate node name: ${safeDisplay(node.name)}`;
    if (node.parameters !== undefined && (!node.parameters || typeof node.parameters !== "object" || Array.isArray(node.parameters))) {
      return `Node parameters must be an object: ${safeDisplay(node.name)}`;
    }
    names.add(node.name);
  }
  if (workflow.connections !== undefined && (!workflow.connections || typeof workflow.connections !== "object" || Array.isArray(workflow.connections))) {
    return "connections must be an object when present";
  }
  let edgeCount = 0;
  for (const [source, outputs] of Object.entries(workflow.connections ?? {})) {
    if (!names.has(source)) return `Connection source does not exist: ${safeDisplay(source)}`;
    if (!outputs || typeof outputs !== "object" || Array.isArray(outputs)) {
      return `Connection outputs must be an object: ${safeDisplay(source)}`;
    }
    for (const [outputType, outputGroups] of Object.entries(outputs)) {
      if (outputType !== "main" && !/^ai_[a-z][a-z0-9_]*$/i.test(outputType)) {
        return `Unsupported connection output type: ${safeDisplay(outputType)}`;
      }
      if (!Array.isArray(outputGroups)) return `Connection output ${safeDisplay(outputType)} must be an array`;
      for (const connectionsAtIndex of outputGroups) {
        if (connectionsAtIndex === null) continue;
        if (!Array.isArray(connectionsAtIndex)) return `Connection index under ${safeDisplay(outputType)} must be an array`;
        for (const connection of connectionsAtIndex) {
          if (!connection || typeof connection !== "object" || Array.isArray(connection)
            || typeof connection.node !== "string" || typeof connection.type !== "string"
            || !Number.isInteger(connection.index) || connection.index < 0) {
            return `Malformed connection from ${safeDisplay(source)}`;
          }
          if (connection.type !== outputType) return `Connection type does not match output ${safeDisplay(outputType)}`;
          if (!names.has(connection.node)) return `Connection target does not exist: ${safeDisplay(connection.node)}`;
          edgeCount += 1;
          if (edgeCount > MAX_EDGES) return `Workflow exceeds the ${MAX_EDGES} edge safety limit`;
        }
      }
    }
  }
  return null;
}

function severityRank(severity) {
  return severity === "error" ? 2 : severity === "warning" ? 1 : 0;
}

function sameStringSet(left, right) {
  const normalizedLeft = [...new Set(left.map((value) => value.toLowerCase()))].sort();
  const normalizedRight = [...new Set(right.map((value) => value.toLowerCase()))].sort();
  return normalizedLeft.length === normalizedRight.length
    && normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function sortFindings(findings) {
  return findings.sort((a, b) =>
    a.ruleId.localeCompare(b.ruleId)
    || String(a.node?.name ?? "").localeCompare(String(b.node?.name ?? ""))
    || String(a.path ?? "").localeCompare(String(b.path ?? ""))
  );
}

function finalizeFindings(findings, truncated) {
  if (truncated && !findings.some((finding) => finding.ruleId === "VF000")) {
    findings.push(invalidFinding(`Analysis stopped after ${MAX_FINDINGS_PER_FILE} findings`));
  }
  return sortFindings(findings);
}

export function safeDisplay(value) {
  return String(value).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, " ");
}
