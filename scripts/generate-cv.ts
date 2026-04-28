#!/usr/bin/env node

import { loadCliOptions, printUsage } from "../src/lib/config";
import { writeTextFile, resolveFromCwd } from "../src/lib/fs";
import { loadProfileYaml, validateProfile } from "../src/lib/profile";
import { createRenderableCv } from "../src/lib/renderable-cv";
import { renderHtml } from "../src/render/html";
import { renderPdf } from "../src/render/pdf";

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log(printUsage());
    return;
  }

  const options = loadCliOptions(process.argv.slice(2));

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

  console.log(`Generated PDF: ${pdfPath}`);
  if (options.outputHtmlPath) {
    console.log(`Generated HTML: ${resolveFromCwd(options.outputHtmlPath)}`);
  }
  if (options.outputJsonPath) {
    console.log(`Generated JSON: ${resolveFromCwd(options.outputJsonPath)}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(message);
  process.exit(1);
});
