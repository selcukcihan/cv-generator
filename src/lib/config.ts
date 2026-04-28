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
  const scoreReportPath = typeof args["score-report-out"] === "string" ? args["score-report-out"] : undefined;

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
    scoreEnabled: args["no-score"] !== true,
    scoreReportPath,
    theme: themeValue,
    pageSize: pageSizeValue
  };
}

export function printUsage(): string {
  return [
    "CV Generator",
    "",
    "Create a PDF CV from a YAML profile.",
    "",
    "Usage:",
    "  cv-generator --profile candidate-profile.yaml --out output/cv.pdf",
    "",
    "Options:",
    "  --profile <path>    Your YAML profile file",
    "  --out <path>        Where the PDF should be written",
    "  --html-out <path>   Also save an HTML copy",
    "  --json-out <path>   Also save the rendered JSON",
    "  --no-score          Skip the automatic quality check",
    "  --score-report-out <path> Save the quality report as JSON",
    "  --theme <name>      classic, modern, or compact",
    "  --page-size <name>  A4 or Letter",
    "",
    "Examples:",
    "  cv-generator --profile candidate-profile.yaml --out output/cv.pdf",
    "  cv-generator --profile candidate-profile.yaml --out output/cv.pdf --html-out output/cv.html"
  ].join("\n");
}
