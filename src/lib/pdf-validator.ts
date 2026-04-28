import fs from "node:fs";

import { CvValidationCategory, CvValidationCategoryScores, CvValidationFinding, CvValidationMetrics, CvValidationReport, CvValidationStatus } from "./types";

// The parser-side checks here intentionally follow the OpenResume parser's
// broad approach: read PDF text items, group them into lines, detect resume
// sections from line patterns, and then score how reliably core fields can be
// extracted from the final PDF.

type PdfTextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
};

type PdfLine = {
  page: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
};

type PdfPage = {
  pageNumber: number;
  width: number;
  height: number;
  lines: PdfLine[];
};

type PdfSection = {
  title: string;
  lines: PdfLine[];
};

type ExperienceParseResult = {
  entryCount: number;
  bullets: string[];
};

const SECTION_TITLES = ["Summary", "Experience", "Projects", "Education", "Certifications", "Skills", "References"];
const SECTION_TITLE_MAP = new Map(SECTION_TITLES.map((title) => [title.toUpperCase(), title]));
const CORE_SECTIONS = ["Experience", "Education", "Skills"];
const ACTION_VERBS = new Set([
  "built",
  "created",
  "delivered",
  "designed",
  "developed",
  "drove",
  "enabled",
  "implemented",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "mentored",
  "optimized",
  "reduced",
  "scaled",
  "shipped",
  "streamlined",
  "supported"
]);
const FILLER_PHRASES = ["responsible for", "worked on", "helped with", "involved in", "tasked with"];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isSectionHeading(text: string): boolean {
  return SECTION_TITLE_MAP.has(normalizeWhitespace(text).toUpperCase());
}

function canonicalSectionTitle(text: string): string | null {
  return SECTION_TITLE_MAP.get(normalizeWhitespace(text).toUpperCase()) ?? null;
}

function looksLikeDateLine(text: string): boolean {
  return /\b(19|20)\d{2}\b/.test(text);
}

function looksLikeUrl(text: string): boolean {
  return /(?:https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i.test(text);
}

function addFinding(
  findings: CvValidationFinding[],
  category: CvValidationCategory,
  severity: CvValidationFinding["severity"],
  message: string,
  page?: number
): void {
  findings.push({ category, severity, message, page });
}

async function extractPdfPages(pdfPath: string): Promise<PdfPage[]> {
  const bytes = fs.readFileSync(pdfPath);
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(bytes),
    useSystemFonts: true
  } as never);
  const document = await loadingTask.promise;
  const pages: PdfPage[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();
    const items = textContent.items.filter((item) => "str" in item) as PdfTextItem[];

    pages.push({
      pageNumber,
      width: viewport.width,
      height: viewport.height,
      lines: groupItemsIntoLines(items, pageNumber)
    });
  }

  return pages;
}

function groupItemsIntoLines(items: PdfTextItem[], pageNumber: number): PdfLine[] {
  const sorted = items
    .map((item) => {
      const x = item.transform[4] ?? 0;
      const y = item.transform[5] ?? 0;
      const width = Math.max(0, item.width ?? 0);
      const height = Math.abs(item.height ?? 0);

      return {
        text: normalizeWhitespace(item.str ?? ""),
        x,
        y,
        width,
        height,
        right: x + width
      };
    })
    .filter((item) => item.text.length > 0)
    .sort((left, right) => {
      if (Math.abs(right.y - left.y) > 2) {
        return right.y - left.y;
      }
      return left.x - right.x;
    });

  const groups: Array<Array<typeof sorted[number]>> = [];

  for (const item of sorted) {
    const currentGroup = groups.at(-1);
    if (!currentGroup) {
      groups.push([item]);
      continue;
    }

    const referenceY = currentGroup[0]?.y ?? item.y;
    if (Math.abs(referenceY - item.y) <= 2.5) {
      currentGroup.push(item);
      continue;
    }

    groups.push([item]);
  }

  return groups
    .map((group) => {
      const pieces = [...group].sort((left, right) => left.x - right.x);
      const text = normalizeWhitespace(pieces.map((piece) => piece.text).join(" "));
      const x = Math.min(...pieces.map((piece) => piece.x));
      const right = Math.max(...pieces.map((piece) => piece.right));
      const y = Math.max(...pieces.map((piece) => piece.y));
      const height = Math.max(...pieces.map((piece) => piece.height || 0));

      return {
        page: pageNumber,
        text,
        x,
        y,
        width: right - x,
        height,
        right
      };
    })
    .filter((line) => line.text.length > 0)
    .sort((left, right) => right.y - left.y || left.x - right.x);
}

function buildSections(pages: PdfPage[]): PdfSection[] {
  const allLines = pages.flatMap((page) => page.lines);
  const sections: PdfSection[] = [];
  let currentSection: PdfSection | null = null;

  for (const line of allLines) {
    const title = canonicalSectionTitle(line.text);
    if (title) {
      currentSection = { title, lines: [] };
      sections.push(currentSection);
      continue;
    }

    currentSection?.lines.push(line);
  }

  return sections;
}

function parseExperienceSection(section: PdfSection | undefined): ExperienceParseResult {
  if (!section) {
    return { entryCount: 0, bullets: [] };
  }

  let entryCount = 0;
  let inEntryBody = false;
  const bullets: string[] = [];

  for (const line of section.lines) {
    const text = normalizeWhitespace(line.text);
    if (!text) {
      continue;
    }

    if (looksLikeDateLine(text)) {
      entryCount += 1;
      inEntryBody = true;
      continue;
    }

    if (!inEntryBody) {
      continue;
    }

    if (text.length >= 25 && !looksLikeUrl(text) && !isSectionHeading(text)) {
      bullets.push(text);
    }
  }

  return { entryCount, bullets };
}

function scoreExtractability(pages: PdfPage[], sections: PdfSection[], findings: CvValidationFinding[]): number {
  let score = 100;
  const allText = pages.flatMap((page) => page.lines.map((line) => line.text)).join("\n");
  const totalCharacters = allText.length;
  const averageCharactersPerPage = totalCharacters / Math.max(1, pages.length);

  if (pages.length === 0 || totalCharacters === 0) {
    addFinding(findings, "extractability", "error", "The PDF does not expose readable text.");
    return 0;
  }

  if (totalCharacters < 400) {
    score -= 60;
    addFinding(findings, "extractability", "error", "The PDF contains very little extractable text.");
  } else if (totalCharacters < 900) {
    score -= 20;
    addFinding(findings, "extractability", "warning", "The PDF text content is shorter than expected for a full CV.");
  }

  if (averageCharactersPerPage < 300) {
    score -= 15;
    addFinding(findings, "extractability", "warning", "The text density per page is low, which can indicate poor extraction quality.");
  }

  if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(allText)) {
    score -= 10;
    addFinding(findings, "extractability", "warning", "No email address was detected in the extracted PDF text.");
  }

  if (!looksLikeUrl(allText)) {
    score -= 5;
    addFinding(findings, "extractability", "warning", "No URL was detected in the extracted PDF text.");
  }

  if (allText.includes("�")) {
    score -= 15;
    addFinding(findings, "extractability", "warning", "The extracted text contains replacement characters, which can confuse ATS parsers.");
  }

  if (sections.length === 0) {
    score -= 25;
    addFinding(findings, "extractability", "error", "No recognizable section headings were detected in the PDF text.");
  }

  return clampScore(score);
}

function scoreStructure(
  pages: PdfPage[],
  sections: PdfSection[],
  findings: CvValidationFinding[]
): { score: number; experience: ExperienceParseResult } {
  let score = 100;
  const detectedTitles = sections.map((section) => section.title);
  const experience = parseExperienceSection(sections.find((section) => section.title === "Experience"));

  for (const title of CORE_SECTIONS) {
    if (!detectedTitles.includes(title)) {
      score -= 18;
      addFinding(findings, "structure", "error", `Missing core section: ${title}.`);
    }
  }

  const expectedOrder = ["Summary", "Experience", "Education", "Skills", "References"];
  const orderIndexes = expectedOrder
    .map((title) => ({ title, index: detectedTitles.indexOf(title) }))
    .filter((entry) => entry.index >= 0);

  for (let index = 1; index < orderIndexes.length; index += 1) {
    if (orderIndexes[index - 1]!.index > orderIndexes[index]!.index) {
      score -= 12;
      addFinding(findings, "structure", "warning", "Section order is unusual, which may hurt quick scanning.");
      break;
    }
  }

  if (experience.entryCount === 0) {
    score -= 35;
    addFinding(findings, "structure", "error", "No recognizable experience entries were detected.");
  } else if (experience.entryCount < 3) {
    score -= 10;
    addFinding(findings, "structure", "warning", "The PDF contains only a small number of detectable experience entries.");
  }

  if (experience.bullets.length < experience.entryCount) {
    score -= 12;
    addFinding(findings, "structure", "warning", "Some experience entries do not appear to have readable bullet descriptions.");
  }

  for (const section of sections) {
    if (section.lines.length === 0) {
      score -= 8;
      addFinding(findings, "structure", "warning", `Section "${section.title}" is empty.`);
    }
  }

  const pageEndHeadings = pages
    .slice(0, -1)
    .map((page) => page.lines.slice(-2))
    .flat()
    .filter((line) => line && isSectionHeading(line.text));

  for (const line of pageEndHeadings) {
    score -= 8;
    addFinding(findings, "structure", "warning", `Section heading "${line.text}" appears at the end of a page.`, line.page);
  }

  return { score: clampScore(score), experience };
}

function scoreContent(sections: PdfSection[], experience: ExperienceParseResult, findings: CvValidationFinding[]): number {
  let score = 100;
  const summarySection = sections.find((section) => section.title === "Summary");
  const summaryText = summarySection ? normalizeWhitespace(summarySection.lines.map((line) => line.text).join(" ")) : "";
  const bullets = experience.bullets;

  if (!summaryText) {
    score -= 15;
    addFinding(findings, "content", "warning", "No summary text was detected.");
  } else if (summaryText.length < 80) {
    score -= 10;
    addFinding(findings, "content", "warning", "The summary is very short.");
  } else if (summaryText.length > 420) {
    score -= 12;
    addFinding(findings, "content", "warning", "The summary is long and may be hard to scan quickly.");
  }

  if (bullets.length === 0) {
    score -= 40;
    addFinding(findings, "content", "error", "No readable experience bullets were detected.");
    return clampScore(score);
  }

  const bulletWordCounts = bullets.map((bullet) => bullet.split(/\s+/).filter(Boolean).length);
  const averageBulletWords = bulletWordCounts.reduce((sum, count) => sum + count, 0) / bullets.length;

  if (averageBulletWords < 6) {
    score -= 15;
    addFinding(findings, "content", "warning", "Experience bullets are very short and may lack enough detail.");
  } else if (averageBulletWords > 26) {
    score -= 15;
    addFinding(findings, "content", "warning", "Experience bullets are long and may be hard for recruiters to scan.");
  }

  const bulletStarts = bullets.map((bullet) => bullet.match(/[A-Za-z]+/)?.[0]?.toLowerCase() ?? "").filter((value) => value.length > 0);
  const actionStarts = bulletStarts.filter((start) => ACTION_VERBS.has(start)).length;
  const actionRatio = actionStarts / Math.max(1, bulletStarts.length);

  if (actionRatio < 0.45) {
    score -= 15;
    addFinding(findings, "content", "warning", "Many bullets do not start with clear action-oriented wording.");
  }

  const quantifiedBullets = bullets.filter((bullet) => /(\d|%|\$|million|billion|thousand)/i.test(bullet)).length;
  if (quantifiedBullets === 0) {
    score -= 8;
    addFinding(findings, "content", "warning", "No measurable outcomes were detected in the experience bullets.");
  }

  const repeatedStarts = bulletStarts.reduce<Record<string, number>>((counts, start) => {
    counts[start] = (counts[start] ?? 0) + 1;
    return counts;
  }, {});
  const maxRepeat = Math.max(0, ...Object.values(repeatedStarts));
  if (maxRepeat >= 4) {
    score -= 10;
    addFinding(findings, "content", "warning", "Many bullets start with the same verb, which weakens variety.");
  }

  for (const phrase of FILLER_PHRASES) {
    if (bullets.some((bullet) => bullet.toLowerCase().includes(phrase))) {
      score -= 5;
      addFinding(findings, "content", "warning", `Detected filler phrasing such as "${phrase}".`);
      break;
    }
  }

  return clampScore(score);
}

function scoreLayout(pages: PdfPage[], findings: CvValidationFinding[]): number {
  let score = 100;

  if (pages.length > 2) {
    score -= 12;
    addFinding(findings, "layout", "warning", "The CV spans more than two pages.");
  }

  for (const page of pages) {
    if (page.lines.length === 0) {
      score -= 20;
      addFinding(findings, "layout", "error", "A page in the PDF appears to be empty.", page.pageNumber);
      continue;
    }

    const left = Math.min(...page.lines.map((line) => line.x));
    const right = Math.min(...page.lines.map((line) => page.width - line.right));
    const marginDifference = Math.abs(left - right);

    if (left < 24 || right < 24) {
      score -= 10;
      addFinding(findings, "layout", "warning", "Text appears close to the page edge.", page.pageNumber);
    }

    if (marginDifference > 36) {
      score -= 10;
      addFinding(findings, "layout", "warning", "Left and right margins are noticeably uneven.", page.pageNumber);
    }

    const widestLine = Math.max(...page.lines.map((line) => line.width));
    if (widestLine > page.width * 0.88) {
      score -= 10;
      addFinding(findings, "layout", "warning", "Some lines are very wide and may be hard to scan.", page.pageNumber);
    }

    const bottomMostLine = Math.min(...page.lines.map((line) => line.y));
    if (bottomMostLine < 28) {
      score -= 5;
      addFinding(findings, "layout", "warning", "Content runs very close to the bottom of the page.", page.pageNumber);
    }
  }

  return clampScore(score);
}

function finalStatus(score: number, minScore: number, findings: CvValidationFinding[]): CvValidationStatus {
  if (score < minScore || findings.some((finding) => finding.severity === "error")) {
    return "fail";
  }

  if (findings.some((finding) => finding.severity === "warning")) {
    return "pass_with_warnings";
  }

  return "pass";
}

function buildMetrics(pages: PdfPage[], sections: PdfSection[], experience: ExperienceParseResult): CvValidationMetrics {
  const totalCharacters = pages.flatMap((page) => page.lines).reduce((sum, line) => sum + line.text.length, 0);
  const bulletWordCounts = experience.bullets.map((bullet) => bullet.split(/\s+/).filter(Boolean).length);

  return {
    pageCount: pages.length,
    totalCharacters,
    totalLines: pages.flatMap((page) => page.lines).length,
    detectedSections: sections.map((section) => section.title),
    experienceEntryCount: experience.entryCount,
    experienceBulletCount: experience.bullets.length,
    averageBulletWords:
      bulletWordCounts.length > 0
        ? Math.round((bulletWordCounts.reduce((sum, count) => sum + count, 0) / bulletWordCounts.length) * 10) / 10
        : 0
  };
}

function weightedScore(categoryScores: CvValidationCategoryScores): number {
  return clampScore(
    categoryScores.extractability * 0.35 +
      categoryScores.structure * 0.25 +
      categoryScores.content * 0.25 +
      categoryScores.layout * 0.15
  );
}

export async function validateGeneratedPdf(pdfPath: string, minScore = 70): Promise<CvValidationReport> {
  const pages = await extractPdfPages(pdfPath);
  const sections = buildSections(pages);
  const findings: CvValidationFinding[] = [];

  const extractability = scoreExtractability(pages, sections, findings);
  const structureResult = scoreStructure(pages, sections, findings);
  const content = scoreContent(sections, structureResult.experience, findings);
  const layout = scoreLayout(pages, findings);
  const categoryScores: CvValidationCategoryScores = {
    extractability,
    structure: structureResult.score,
    content,
    layout
  };
  const score = weightedScore(categoryScores);
  const metrics = buildMetrics(pages, sections, structureResult.experience);
  const status = finalStatus(score, minScore, findings);

  return {
    pdfPath,
    score,
    minScore,
    status,
    categoryScores,
    findings,
    metrics
  };
}

export function formatValidationReport(report: CvValidationReport): string {
  const lines: string[] = [
    "CV PDF Validation Report",
    "",
    `File: ${report.pdfPath}`,
    `Status: ${report.status}`,
    `Score: ${report.score}/100`,
    `Threshold: ${report.minScore}`,
    "",
    "Category scores:",
    `  Extractability: ${report.categoryScores.extractability}`,
    `  Structure: ${report.categoryScores.structure}`,
    `  Content: ${report.categoryScores.content}`,
    `  Layout: ${report.categoryScores.layout}`,
    "",
    "Metrics:",
    `  Pages: ${report.metrics.pageCount}`,
    `  Characters: ${report.metrics.totalCharacters}`,
    `  Lines: ${report.metrics.totalLines}`,
    `  Sections: ${report.metrics.detectedSections.join(", ") || "none"}`,
    `  Experience entries: ${report.metrics.experienceEntryCount}`,
    `  Experience bullets: ${report.metrics.experienceBulletCount}`,
    `  Average bullet words: ${report.metrics.averageBulletWords}`,
    ""
  ];

  if (report.findings.length === 0) {
    lines.push("Findings:", "  No issues detected.");
    return lines.join("\n");
  }

  lines.push("Findings:");
  for (const finding of report.findings) {
    const prefix = finding.page ? `  [${finding.severity}] [${finding.category}] page ${finding.page}` : `  [${finding.severity}] [${finding.category}]`;
    lines.push(`${prefix}: ${finding.message}`);
  }

  return lines.join("\n");
}

export function formatValidationSummary(report: CvValidationReport): string {
  const lines = [
    `Quality check: ${report.score}/100 (${report.status})`,
    `Bot readability ${report.categoryScores.extractability}, structure ${report.categoryScores.structure}, content ${report.categoryScores.content}, layout ${report.categoryScores.layout}`
  ];

  const importantFindings = report.findings.filter((finding) => finding.severity !== "info").slice(0, 3);
  if (importantFindings.length > 0) {
    lines.push("Main issues:");
    for (const finding of importantFindings) {
      lines.push(`- ${finding.message}`);
    }
  }

  return lines.join("\n");
}
