#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import {
  VERSION,
  checkPaths,
  formatJson,
  formatSarif,
  formatText,
  loadConfig,
  safeDisplay,
} from "../src/vibeflow.mjs";

const HELP = `Vibeflow ${VERSION}

Usage:
  vibeflow check <workflow.json|directory>... [options]

Options:
  --config <path>        Policy configuration (default: .vibeflow.json)
  --format <type>        text, json, or sarif (default: text)
  --output <path>        Write the report to a file
  --fail-on <level>      error, warning, or never (default: error)
  --locked               Reject configuration that weakens built-in policy
  --version              Print the version
  --help                 Print this help

Directories are searched recursively for *.workflow.json files.
Exit codes: 0 passed, 1 policy failure, 2 invalid input or usage.`;

function parseArgs(argv) {
  const options = {
    command: null,
    inputs: [],
    configPath: null,
    format: "text",
    output: null,
    failOn: "error",
    locked: false,
    help: false,
    version: false,
  };

  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--version" || arg === "-v") options.version = true;
    else if (arg === "--config") options.configPath = requireValue(arg, args);
    else if (arg === "--format") options.format = requireValue(arg, args);
    else if (arg === "--output") options.output = requireValue(arg, args);
    else if (arg === "--fail-on") options.failOn = requireValue(arg, args);
    else if (arg === "--locked") options.locked = true;
    else if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
    else if (!options.command) options.command = arg;
    else options.inputs.push(arg);
  }

  if (!options.help && !options.version) {
    if (options.command !== "check") throw new Error("The only command is: check");
    if (!options.inputs.length) throw new Error("Pass at least one workflow file or directory");
    if (!["text", "json", "sarif"].includes(options.format)) {
      throw new Error("--format must be text, json, or sarif");
    }
    if (!["error", "warning", "never"].includes(options.failOn)) {
      throw new Error("--fail-on must be error, warning, or never");
    }
  }

  return options;
}

function requireValue(option, args) {
  const value = args.shift();
  if (!value || value.startsWith("-")) throw new Error(`${option} requires a value`);
  return value;
}

function shouldFail(report, failOn) {
  if (failOn === "never") return false;
  if (failOn === "warning") return report.summary.errors + report.summary.warnings > 0;
  return report.summary.errors > 0;
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      console.log(HELP);
      return;
    }
    if (options.version) {
      console.log(VERSION);
      return;
    }

    const config = await loadConfig(options.configPath, process.cwd(), options.locked);
    const report = await checkPaths(options.inputs, config);
    const rendered = options.format === "json"
      ? formatJson(report)
      : options.format === "sarif"
        ? formatSarif(report)
        : formatText(report);

    if (options.output) await writeFile(options.output, `${rendered}\n`, "utf8");
    else console.log(rendered);

    if (shouldFail(report, options.failOn)) process.exitCode = 1;
  } catch (error) {
    console.error(`vibeflow: ${safeDisplay(error.message)}`);
    process.exitCode = 2;
  }
}

await main();
