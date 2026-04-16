# CV Generator

Deterministic software engineering CV generator.

This project started from the resume principles discussed in [Software Engineer Resume](https://open.substack.com/pub/systemdesignone/p/software-engineer-resume?utm_campaign=post-expanded-share&utm_medium=post%20viewer), and the repository keeps a distilled version of those ideas in `PRINCIPLES.md`.

The generator uses:

- a structured candidate profile in YAML
- a strict profile schema
- CV generation principles from `PRINCIPLES.md`
- HTML rendering plus PDF export

Profile behavior:

- summary is user-provided
- contact data uses one generic URL field
- contact data no longer includes location
- skills are stored and rendered as one flat list
- references are stored in the profile and rendered directly
- the profile schema is intentionally minimal and follows the actual data shape used in `candidate-profile.yaml`
- experience entries are minimal: title, company, dates, URL, and descriptions
- references use name, title, contact, and testimonial

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy and fill the candidate profile template:

```bash
cp candidate-profile.template.yaml candidate-profile.yaml
```

## Validate The Profile

```bash
npm run validate:profile
node dist/scripts/validate-candidate-profile.js candidate-profile.yaml
```

## Generate A CV

```bash
npm run generate -- --profile candidate-profile.yaml --out output/cv.pdf
```

Useful debug outputs:

```bash
npm run generate -- \
  --profile candidate-profile.yaml \
  --out output/cv.pdf \
  --html-out output/cv.html \
  --json-out output/cv.json
```

## Per-Run Configuration

These are the right things to vary per run:

- `--profile`: which candidate profile to use
- `--out`: output PDF path
- `--html-out`: save rendered HTML for debugging
- `--json-out`: save rendered CV JSON
- `--theme`: `classic`, `modern`, or `compact`
- `--page-size`: `A4` or `Letter`

## Main Files

- `candidate-profile.template.yaml`: source-of-truth candidate data
- `candidate-profile.schema.json`: schema for candidate profile validation
- `PRINCIPLES.md`: CV-writing and content principles
- `PROMPTS.md`: running prompt and requirement history
- `scripts/generate-cv.ts`: generator CLI entrypoint
- `scripts/validate-candidate-profile.ts`: profile validator CLI

## Notes

- The generator validates the candidate profile before trying to generate a CV.
- The generator deterministically maps profile data to the rendered CV.
- PDF rendering uses Puppeteer.
