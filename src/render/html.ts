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

function displayUrl(value: string): string {
  return value.replace(/^https?:\/\//, "");
}

function renderMaybeLink(value: string): string {
  if (!nonEmpty(value)) {
    return "";
  }

  if (/^https?:\/\//.test(value)) {
    const href = escapeHtml(value);
    const label = escapeHtml(displayUrl(value));
    return `<a href="${href}">${label}</a>`;
  }

  return escapeHtml(value);
}

function renderContactRow(cv: RenderableCv): string {
  const items = [cv.contact.email, cv.contact.url]
    .filter(nonEmpty)
    .map((item) => `<span>${renderMaybeLink(item)}</span>`);

  return items.length > 0 ? `<div class="contact-row">${items.join("<span class=\"sep\">•</span>")}</div>` : "";
}

function renderBullets(items: string[]): string {
  const filtered = items.filter(nonEmpty);
  if (filtered.length === 0) {
    return "";
  }

  return `<ul>${filtered.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function sectionClassName(title: string): string {
  return `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
}

function renderSection(title: string, body: string): string {
  if (!body.trim()) {
    return "";
  }

  return `<section class="${sectionClassName(title)}"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function renderExperience(cv: RenderableCv): string {
  return cv.experience
    .map((entry) => {
      const metaParts = [entry.dates ? escapeHtml(entry.dates) : "", entry.url ? renderMaybeLink(entry.url) : ""].filter(nonEmpty);
      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(entry.company)}</h3>
              <div class="entry-subtitle">${escapeHtml(entry.title)}</div>
            </div>
            <div class="entry-meta">${metaParts.join(" | ")}</div>
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
      const testimonial = nonEmpty(reference.testimonial)
        ? `<blockquote class="testimonial">${escapeHtml(reference.testimonial)}</blockquote>`
        : "";

      return `
        <article class="entry">
          <div class="entry-head">
            <div>
              <h3>${escapeHtml(reference.name)}</h3>
              ${nonEmpty(meta) ? `<div class="entry-subtitle">${escapeHtml(meta)}</div>` : ""}
            </div>
          </div>
          ${testimonial}
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
            background: white;
            line-height: 1.35;
            padding: 24px;
          }
          .page {
            width: 100%;
            max-width: 960px;
            margin: 0 auto;
            padding: 0;
          }
          @media print {
            body {
              padding: 0;
            }
            .page {
              max-width: none;
            }
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
          .section-summary,
          .section-skills,
          .section-certifications {
            break-inside: avoid-page;
            page-break-inside: avoid;
          }
          h2 {
            margin: 0 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid var(--border);
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--accent);
            break-after: avoid-page;
            page-break-after: avoid;
          }
          h3 { margin: 0; font-size: 15px; }
          .entry {
            margin-top: 10px;
            break-inside: avoid-page;
            page-break-inside: avoid;
          }
          .entry:first-child { margin-top: 0; }
          .entry-head {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 12px;
            break-after: avoid-page;
            page-break-after: avoid;
          }
          .entry-subtitle { margin-top: 2px; color: var(--muted); font-size: 12px; }
          .entry-meta { color: var(--muted); font-size: 12px; text-align: right; white-space: nowrap; }
          a { color: inherit; text-decoration: none; }
          a:hover { text-decoration: underline; }
          p { margin: 0; }
          blockquote {
            margin: 8px 0 0;
            padding: 10px 12px;
            border-left: 3px solid var(--accent);
            background: #f8fafc;
            break-inside: avoid-page;
            page-break-inside: avoid;
          }
          ul { margin: 8px 0 0 18px; padding: 0; }
          ul, li {
            break-inside: avoid-page;
            page-break-inside: avoid;
          }
          li {
            margin: 4px 0;
            font-size: 12px;
          }
          .summary, .flat-list { font-size: 13px; }
          .testimonial { font-size: 12px; color: #334155; }
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
