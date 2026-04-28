#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { loadCliOptions, printUsage } from "../src/lib/config";
import { readTextFile, writeTextFile, resolveFromCwd } from "../src/lib/fs";
import { formatValidationSummary, validateGeneratedPdf } from "../src/lib/pdf-validator";
import { loadProfileYaml, validateProfile } from "../src/lib/profile";
import { createRenderableCv } from "../src/lib/renderable-cv";
import { renderHtml } from "../src/render/html";
import { renderPdf } from "../src/render/pdf";

function getBundledTemplatePath(): string {
  return path.resolve(__dirname, "..", "..", "candidate-profile.template.yaml");
}

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log(printUsage());
    return;
  }

  const options = loadCliOptions(process.argv.slice(2));

  if (options.initMode) {
    const profilePath = resolveFromCwd(options.profilePath);

    if (fs.existsSync(profilePath) && !options.force) {
      throw new Error(
        `Profile already exists: ${profilePath}\nUse --force to overwrite it, or pass --profile <path> to choose another file.`
      );
    }

    const template = readTextFile(getBundledTemplatePath());
    writeTextFile(profilePath, template);
    console.log(`Created starter profile: ${profilePath}`);
    return;
  }

  const profile = loadProfileYaml(options.profilePath);
  validateProfile(profile.data);

  const renderableCv = createRenderableCv(profile.data);
  const html = renderHtml(renderableCv, options.theme, options.pageSize);
  const pdfPath = resolveFromCwd(options.outputPdfPath);

  await renderPdf(html, pdfPath, options.pageSize);

  if (options.outputHtmlPath) {
    writeTextFile(resolveFromCwd(options.outputHtmlPath), html);
  }

  if (options.outputJsonPath) {
    writeTextFile(resolveFromCwd(options.outputJsonPath), `${JSON.stringify(renderableCv, null, 2)}\n`);
  }

  let reportPath: string | undefined;
  if (options.scoreEnabled) {
    const report = await validateGeneratedPdf(pdfPath);
    if (options.scoreReportPath) {
      reportPath = resolveFromCwd(options.scoreReportPath);
      writeTextFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    }
    console.log(formatValidationSummary(report));
  }

  console.log(`Generated PDF: ${pdfPath}`);
  if (options.outputHtmlPath) {
    console.log(`Generated HTML: ${resolveFromCwd(options.outputHtmlPath)}`);
  }
  if (options.outputJsonPath) {
    console.log(`Generated JSON: ${resolveFromCwd(options.outputJsonPath)}`);
  }
  if (reportPath) {
    console.log(`Generated quality report: ${reportPath}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(message);
  process.exit(1);
});
