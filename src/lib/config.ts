import { GenerateCliOptions, PageSize, ThemeName } from "./types";

function isTheme(value: string): value is ThemeName {
  return value === "classic" || value === "modern" || value === "compact";
}

function isPageSize(value: string): value is PageSize {
  return value === "A4" || value === "Letter";
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

export function loadCliOptions(argv: string[]): GenerateCliOptions {
  const args = parseArgs(argv);

  const profilePath = typeof args.profile === "string" ? args.profile : "candidate-profile.yaml";
  const outputPdfPath = typeof args.out === "string" ? args.out : "output/cv.pdf";
  const outputHtmlPath = typeof args["html-out"] === "string" ? args["html-out"] : undefined;
  const outputJsonPath = typeof args["json-out"] === "string" ? args["json-out"] : undefined;

  const themeValue = typeof args.theme === "string" ? args.theme : "classic";
  if (!isTheme(themeValue)) {
    throw new Error(`Unsupported theme: ${themeValue}`);
  }

  const pageSizeValue = typeof args["page-size"] === "string" ? args["page-size"] : "A4";
  if (!isPageSize(pageSizeValue)) {
    throw new Error(`Unsupported page size: ${pageSizeValue}`);
  }

  return {
    profilePath,
    outputPdfPath,
    outputHtmlPath,
    outputJsonPath,
    theme: themeValue,
    pageSize: pageSizeValue
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
    "  --json-out <path>      Optional rendered JSON output path",
    "  --theme <name>         classic | modern | compact",
    "  --page-size <name>     A4 | Letter"
  ].join("\n");
}
