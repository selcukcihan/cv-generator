# CV Generator

LLM-assisted software engineering CV generator.

The generator uses:

- a structured candidate profile in YAML
- a strict profile schema
- CV generation principles from `PRINCIPLES.md`
- a pluggable LLM provider layer
- HTML rendering plus PDF export

Profile behavior:

- summary is user-provided, not LLM-generated
- contact data uses one generic URL field
- contact data no longer includes location
- skills are stored and rendered as one flat list
- references are stored in the profile and rendered directly
- the profile schema is intentionally minimal and follows the actual data shape used in `candidate-profile.yaml`
- experience entries are minimal: title, company, dates, URL, and descriptions
- references use name, title, contact, and summary

## Current Provider Support

- OpenAI API

The provider layer is intentionally separated so other providers can be added later.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Fill in at least:

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=your_model_here
```

4. Copy and fill the candidate profile template:

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
- `--json-out`: save generated structured CV JSON
- `--provider`: select the LLM provider
- `--model`: override model without editing `.env`
- `--company`: override target company for one run
- `--role-title`: override target role title for one run
- `--theme`: `classic`, `modern`, or `compact`
- `--page-size`: `A4` or `Letter`
- `--temperature`: override sampling behavior

## Main Files

- `candidate-profile.template.yaml`: source-of-truth candidate data
- `candidate-profile.schema.json`: schema for candidate profile validation
- `PRINCIPLES.md`: LLM-facing generation rules
- `PROMPTS.md`: running prompt and requirement history
- `scripts/generate-cv.ts`: generator CLI entrypoint
- `scripts/validate-candidate-profile.ts`: profile validator CLI
- `src/providers/openai-provider.ts`: first provider implementation

## Notes

- The generator validates the candidate profile before trying to generate a CV.
- The generated CV content is validated again before rendering.
- PDF rendering uses Puppeteer.
