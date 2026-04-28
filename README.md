# CV Generator

![CV Generator icon](assets/icon.svg)

Turn a simple YAML file into a clean PDF CV.

This project started from the resume ideas in [Software Engineer Resume](https://open.substack.com/pub/systemdesignone/p/software-engineer-resume?utm_campaign=post-expanded-share&utm_medium=post%20viewer). Those ideas are summarized in [PRINCIPLES.md](PRINCIPLES.md).

Package name: `@scihan/cv-generator`

Documentation site: GitHub Pages from [`docs/index.html`](docs/index.html)

## What You Need

- Node.js
- your own `candidate-profile.yaml` file

## Quick Start

1. Install the tool:

```bash
npm install -g @scihan/cv-generator
```

2. Create a starter profile:

```bash
cv-generator --init
```

3. Fill in your details in `candidate-profile.yaml`.

4. Generate your PDF:

```bash
cv-generator --profile candidate-profile.yaml --out output/cv.pdf
```

The tool will also run a simple quality check automatically after generating the PDF. This includes bot readability checks based on OpenResume-style parser heuristics.

## Optional Outputs

If you also want an HTML copy:

```bash
cv-generator --profile candidate-profile.yaml --out output/cv.pdf --html-out output/cv.html
```

If you also want a JSON quality report:

```bash
cv-generator --profile candidate-profile.yaml --out output/cv.pdf --score-report-out output/cv-report.json
```

## Files In This Repo

- [candidate-profile.template.yaml](candidate-profile.template.yaml): example profile you can copy
- [candidate-profile.schema.json](candidate-profile.schema.json): checks that your YAML is valid
- [PRINCIPLES.md](PRINCIPLES.md): the CV writing rules used by this project

## Notes

- Your summary is written by you, not generated.
- Skills are a simple flat list.
- References are included directly from your profile.
- The tool checks your profile before creating the PDF.
- The tool also scores the final PDF for bot readability, structure, content, and layout.
- Use `--no-score` if you want to skip the quality check.
- Use `cv-generator --init --force` if you want to recreate the starter file.

## For Developers

Development, publishing, and release notes live in [PUBLISHING.md](PUBLISHING.md).
