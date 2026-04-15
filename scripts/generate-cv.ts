import { loadCliOptions, loadEnv, printUsage } from "../src/lib/config";
import { writeTextFile, readTextFile, resolveFromCwd } from "../src/lib/fs";
import { validateGeneratedCv } from "../src/lib/generated-cv";
import { createProvider } from "../src/lib/providers";
import { loadProfileYaml, validateProfile } from "../src/lib/profile";
import { renderHtml } from "../src/render/html";
import { renderPdf } from "../src/render/pdf";

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log(printUsage());
    return;
  }

  const env = loadEnv();
  const options = loadCliOptions(process.argv.slice(2), env);

  const principlesPath = resolveFromCwd("PRINCIPLES.md");
  const principles = readTextFile(principlesPath);

  const profile = loadProfileYaml(options.profilePath);
  validateProfile(profile.data);

  const provider = createProvider(options.provider, env, options.model);
  const generated = await provider.generateCv(
    {
      principles,
      profileYaml: profile.raw,
      profileData: profile.data,
      companyOverride: options.company,
      roleTitleOverride: options.roleTitle
    },
    options
  );

  const validatedCv = validateGeneratedCv(generated);
  const html = renderHtml(validatedCv, options.theme, options.pageSize);
  const pdfPath = resolveFromCwd(options.outputPdfPath);

  await renderPdf(html, pdfPath, options.pageSize);

  if (options.outputHtmlPath) {
    writeTextFile(resolveFromCwd(options.outputHtmlPath), html);
  }

  if (options.outputJsonPath) {
    writeTextFile(resolveFromCwd(options.outputJsonPath), `${JSON.stringify(validatedCv, null, 2)}\n`);
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
