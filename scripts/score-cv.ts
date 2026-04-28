#!/usr/bin/env node

import { resolveFromCwd, writeTextFile } from "../src/lib/fs";
import { formatValidationReport, validateGeneratedPdf } from "../src/lib/pdf-validator";

type ScoreCliOptions = {
  pdfPath: string;
  jsonOutPath?: string;
  minScore: number;
};

function parseArgs(argv: string[]): Record<string, string | true> {
  const result: Record<string, string | true> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      result[key] = true;
      continue;
    }

    result[key] = next;
    index += 1;
  }

  return result;
}

function printUsage(): string {
  return [
    "CV Generator Score",
    "",
    "Score a generated PDF CV for machine readability, structure, content, and layout.",
    "",
    "Usage:",
    "  cv-generator-score --pdf output/cv.pdf",
    "",
    "Options:",
    "  --pdf <path>         The PDF file to score",
    "  --json-out <path>    Also save the full report as JSON",
    "  --min-score <n>      Minimum passing score, default 70",
    "",
    "Example:",
    "  cv-generator-score --pdf output/cv.pdf --json-out output/cv-report.json"
  ].join("\n");
}

function loadOptions(argv: string[]): ScoreCliOptions {
  const args = parseArgs(argv);
  const pdfPath = typeof args.pdf === "string" ? args.pdf : "";
  if (!pdfPath) {
    throw new Error("Missing required --pdf argument.");
  }

  const minScoreValue = typeof args["min-score"] === "string" ? Number(args["min-score"]) : 70;
  if (Number.isNaN(minScoreValue)) {
    throw new Error("Invalid --min-score value.");
  }

  return {
    pdfPath,
    jsonOutPath: typeof args["json-out"] === "string" ? args["json-out"] : undefined,
    minScore: minScoreValue
  };
}

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log(printUsage());
    return;
  }

  const options = loadOptions(process.argv.slice(2));
  const absolutePdfPath = resolveFromCwd(options.pdfPath);
  const report = await validateGeneratedPdf(absolutePdfPath, options.minScore);

  if (options.jsonOutPath) {
    writeTextFile(resolveFromCwd(options.jsonOutPath), `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(formatValidationReport(report));

  if (report.status === "fail") {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(message);
  process.exit(1);
});
