import { GenerateCliOptions, GenerationContext } from "./types";

export function buildSystemPrompt(): string {
  return [
    "You generate high-quality software engineering CV content.",
    "You must follow the provided principles strictly.",
    "You must only use facts supported by the provided candidate profile.",
    "Do not invent metrics, projects, ownership, dates, or technologies.",
    "Return concise, specific, ATS-safe content.",
    "Prioritize relevance, clarity, and measurable impact."
  ].join(" ");
}

export function buildUserPrompt(context: GenerationContext, options: GenerateCliOptions): string {
  const targetingNotes = [
    options.company ? `Company override: ${options.company}` : "",
    options.roleTitle ? `Role title override: ${options.roleTitle}` : "",
    `Theme requested: ${options.theme}`,
    `Page size requested: ${options.pageSize}`
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "Generate structured CV content from the inputs below.",
    "Use the principles as the highest-priority writing guide after truthfulness.",
    "Do not generate or rewrite the summary. The summary is user-provided and must stay out of the generated JSON payload.",
    "Use exactly one generic contact URL field, not separate GitHub or LinkedIn fields.",
    "Return skills as one flat list, not categorized groups.",
    "Do not include references in the generated JSON payload; references are rendered directly from profile data.",
    "Do not output Markdown. Do not explain choices. Return only schema-compliant JSON.",
    "",
    "[Run Configuration]",
    targetingNotes,
    "",
    "[Principles]",
    context.principles,
    "",
    "[Candidate Profile YAML]",
    context.profileYaml
  ].join("\n");
}
