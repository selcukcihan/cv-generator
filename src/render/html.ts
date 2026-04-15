import { PageSize, RenderableCv, ThemeName } from "../lib/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

function renderContactRow(cv: RenderableCv): string {
  const items = [cv.contact.email, cv.contact.url]
    .filter(nonEmpty)
    .map((item) => `<span>${escapeHtml(item)}</span>`);

  return items.length > 0 ? `<div class="contact-row">${items.join("<span class=\"sep\">•</span>")}</div>` : "";
}

function renderBullets(items: string[]): string {
  const filtered = items.filter(nonEmpty);
  if (filtered.length === 0) {
    return "";
  }

  return `<ul>${filtered.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderSection(title: string, body: string): string {
  if (!body.trim()) {
    return "";
  }

  return `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function renderExperience(cv: RenderableCv): string {
  return cv.experience
    .map((entry) => {
      const meta = [entry.dates, entry.url].filter(nonEmpty).join(" | ");
      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(entry.company)}</h3>
              <div class="entry-subtitle">${escapeHtml(entry.title)}</div>
            </div>
            <div class="entry-meta">${escapeHtml(meta)}</div>
          </div>
          ${renderBullets(entry.descriptions)}
        </article>
      `;
    })
    .join("");
}

function renderProjects(cv: RenderableCv): string {
  return cv.projects
    .map((entry) => {
      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(entry.name)}</h3>
              <div class="entry-subtitle">${escapeHtml(entry.subtitle)}</div>
            </div>
          </div>
          ${renderBullets(entry.bullets)}
        </article>
      `;
    })
    .join("");
}

function renderEducation(cv: RenderableCv): string {
  return cv.education
    .map((entry) => {
      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(entry.institution)}</h3>
              <div class="entry-subtitle">${escapeHtml(entry.degree)}</div>
            </div>
            <div class="entry-meta">${escapeHtml(entry.dates)}</div>
          </div>
          ${renderBullets(entry.details)}
        </article>
      `;
    })
    .join("");
}

function renderCertifications(cv: RenderableCv): string {
  return cv.certifications
    .map((entry) => {
      const meta = [entry.issuer, entry.date].filter(nonEmpty).join(" | ");
      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(entry.name)}</h3>
              <div class="entry-subtitle">${escapeHtml(meta)}</div>
            </div>
          </div>
          ${renderBullets(entry.details)}
        </article>
      `;
    })
    .join("");
}

function renderSkills(cv: RenderableCv): string {
  const items = cv.skills.filter(nonEmpty);
  if (items.length === 0) {
    return "";
  }

  return `<p class="flat-list">${escapeHtml(items.join(", "))}</p>`;
}

function renderReferences(cv: RenderableCv): string {
  return cv.references
    .map((reference) => {
      const meta = [reference.title, reference.contact].filter(nonEmpty).join(" | ");
      const detailItems = [reference.summary].filter(nonEmpty);

      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(reference.name)}</h3>
              ${nonEmpty(meta) ? `<div class="entry-subtitle">${escapeHtml(meta)}</div>` : ""}
            </div>
          </div>
          ${renderBullets(detailItems)}
        </article>
      `;
    })
    .join("");
}

function renderExtras(cv: RenderableCv): string {
  return cv.extras
    .filter((section) => section.items.length > 0)
    .map((section) => renderSection(section.title, renderBullets(section.items)))
    .join("");
}

function themeStyles(theme: ThemeName): string {
  switch (theme) {
    case "modern":
      return `
        :root { --accent: #0b6e4f; --muted: #536471; --border: #c7d6d0; }
        body { font-family: "Aptos", "Segoe UI", sans-serif; }
        h1, h2, h3 { letter-spacing: 0.01em; }
      `;
    case "compact":
      return `
        :root { --accent: #1f3a5f; --muted: #5f6b7a; --border: #d5dbe4; }
        body { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 12px; }
        section { margin-top: 12px; }
        ul { margin: 6px 0 0 18px; }
      `;
    case "classic":
    default:
      return `
        :root { --accent: #183153; --muted: #556270; --border: #d6dde6; }
        body { font-family: Georgia, "Times New Roman", serif; }
      `;
  }
}

export function renderHtml(cv: RenderableCv, theme: ThemeName, pageSize: PageSize): string {
  const pageWidth = pageSize === "Letter" ? "8.5in" : "210mm";
  const pageHeight = pageSize === "Letter" ? "11in" : "297mm";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(cv.fullName)} CV</title>
        <style>
          ${themeStyles(theme)}
          * { box-sizing: border-box; }
          body {
            margin: 0;
            color: #111827;
            background: #f3f4f6;
            line-height: 1.35;
          }
          .page {
            width: ${pageWidth};
            min-height: ${pageHeight};
            margin: 0 auto;
            padding: 18mm 16mm;
            background: white;
          }
          header { border-bottom: 2px solid var(--accent); padding-bottom: 10px; }
          h1 { margin: 0; font-size: 28px; color: var(--accent); }
          .headline { margin-top: 4px; font-size: 15px; font-weight: 600; }
          .contact-row {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            color: var(--muted);
            font-size: 12px;
          }
          .sep { color: var(--border); }
          section { margin-top: 16px; }
          h2 {
            margin: 0 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid var(--border);
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--accent);
          }
          h3 { margin: 0; font-size: 15px; }
          .entry { margin-top: 10px; }
          .entry:first-child { margin-top: 0; }
          .entry-head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 12px;
          }
          .entry-subtitle { margin-top: 2px; color: var(--muted); font-size: 12px; }
          .entry-meta { color: var(--muted); font-size: 12px; text-align: right; white-space: nowrap; }
          p { margin: 0; }
          ul { margin: 8px 0 0 18px; padding: 0; }
          li { margin: 4px 0; }
          .summary, .flat-list { font-size: 13px; }
        </style>
      </head>
      <body>
        <main class="page">
          <header>
            <h1>${escapeHtml(cv.fullName)}</h1>
            ${nonEmpty(cv.headline) ? `<div class="headline">${escapeHtml(cv.headline)}</div>` : ""}
            ${renderContactRow(cv)}
          </header>
          ${nonEmpty(cv.summary) ? renderSection("Summary", `<p class="summary">${escapeHtml(cv.summary)}</p>`) : ""}
          ${renderSection("Experience", renderExperience(cv))}
          ${renderSection("Projects", renderProjects(cv))}
          ${renderSection("Education", renderEducation(cv))}
          ${renderSection("Certifications", renderCertifications(cv))}
          ${renderSection("Skills", renderSkills(cv))}
          ${renderSection("References", renderReferences(cv))}
          ${renderExtras(cv)}
        </main>
      </body>
    </html>
  `;
}
