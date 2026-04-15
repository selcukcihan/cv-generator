import dotenv from "dotenv";

import { GenerateCliOptions, PageSize, ProviderName, ThemeName } from "./types";

function isTheme(value: string): value is ThemeName {
  return value === "classic" || value === "modern" || value === "compact";
}

function isPageSize(value: string): value is PageSize {
  return value === "A4" || value === "Letter";
}

function isProvider(value: string): value is ProviderName {
  return value === "openai";
}

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

export type AppEnv = {
  provider: ProviderName;
  openAiApiKey?: string;
  openAiModel?: string;
  openAiBaseUrl?: string;
};

export function loadEnv(): AppEnv {
  dotenv.config();

  const providerValue = process.env.LLM_PROVIDER?.trim() || "openai";
  if (!isProvider(providerValue)) {
    throw new Error(`Unsupported LLM_PROVIDER: ${providerValue}`);
  }

  return {
    provider: providerValue,
    openAiApiKey: process.env.OPENAI_API_KEY?.trim(),
    openAiModel: process.env.OPENAI_MODEL?.trim(),
    openAiBaseUrl: process.env.OPENAI_BASE_URL?.trim()
  };
}

export function loadCliOptions(argv: string[], env: AppEnv): GenerateCliOptions {
  const args = parseArgs(argv);

  const profilePath = typeof args.profile === "string" ? args.profile : "candidate-profile.template.yaml";
  const outputPdfPath = typeof args.out === "string" ? args.out : "output/cv.pdf";
  const outputHtmlPath = typeof args["html-out"] === "string" ? args["html-out"] : undefined;
  const outputJsonPath = typeof args["json-out"] === "string" ? args["json-out"] : undefined;

  const providerValue = typeof args.provider === "string" ? args.provider : env.provider;
  if (!isProvider(providerValue)) {
    throw new Error(`Unsupported provider: ${providerValue}`);
  }

  const themeValue = typeof args.theme === "string" ? args.theme : "classic";
  if (!isTheme(themeValue)) {
    throw new Error(`Unsupported theme: ${themeValue}`);
  }

  const pageSizeValue = typeof args["page-size"] === "string" ? args["page-size"] : "A4";
  if (!isPageSize(pageSizeValue)) {
    throw new Error(`Unsupported page size: ${pageSizeValue}`);
  }

  const temperatureValue = typeof args.temperature === "string" ? Number(args.temperature) : undefined;
  if (temperatureValue !== undefined && Number.isNaN(temperatureValue)) {
    throw new Error(`Invalid temperature: ${String(args.temperature)}`);
  }

  return {
    profilePath,
    outputPdfPath,
    outputHtmlPath,
    outputJsonPath,
    provider: providerValue,
    model: typeof args.model === "string" ? args.model : env.openAiModel,
    company: typeof args.company === "string" ? args.company : undefined,
    roleTitle: typeof args["role-title"] === "string" ? args["role-title"] : undefined,
    theme: themeValue,
    pageSize: pageSizeValue,
    temperature: temperatureValue
  };
}

export function printUsage(): string {
  return [
    "Usage: npm run generate -- [options]",
    "",
    "Options:",
    "  --profile <path>       Candidate profile YAML path",
    "  --out <path>           Output PDF path",
    "  --html-out <path>      Optional HTML debug output path",
    "  --json-out <path>      Optional generated JSON output path",
    "  --provider <name>      LLM provider, currently: openai",
    "  --model <name>         Model override",
    "  --company <name>       Per-run company override",
    "  --role-title <title>   Per-run role title override",
    "  --theme <name>         classic | modern | compact",
    "  --page-size <name>     A4 | Letter",
    "  --temperature <n>      Model temperature override"
  ].join("\n");
}
