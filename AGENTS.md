# AGENTS.md

This repository is a TypeScript-based, deterministic CV generator.

Agents working in this repo must optimize for:

- correctness
- reproducibility
- clear separation of concerns
- schema-first design
- maintainable git history

## Project Intent

The generator should let users:

- maintain their own structured candidate data
- generate tailored CVs as PDFs

Current design direction:

- candidate source of truth lives in YAML
- YAML is validated against a JSON Schema
- generation principles live in `PRINCIPLES.md` as project guidance
- prompts and requirement history live in `PROMPTS.md`
- generation should deterministically map profile data into renderable CV data before rendering HTML/PDF

## Core Engineering Rules

Agents must:

- keep the implementation in TypeScript
- preserve the schema-first workflow
- validate input before generation
- keep data mapping isolated from rendering
- prefer small, composable modules over large scripts
- keep CLI behavior explicit and documented
- update documentation when behavior changes

Agents must not:

- bypass schema validation
- mix rendering concerns into profile parsing
- add dependencies without clear need
- invent candidate data or silently mutate user-owned profile content

## Repository Conventions

### Candidate Data

- `candidate-profile.yaml` is user-owned source data.
- `candidate-profile.template.yaml` is the maintained starter template.
- `candidate-profile.schema.json` is the authoritative structure contract.

When changing the profile format:

1. update the schema
2. update the template
3. update validators
4. update docs
5. preserve backward compatibility where practical, or bump `schema_version`

### Principles

- `PRINCIPLES.md` is a repository guidance document for CV-writing rules.
- Keep it concise, stable, and aligned with the deterministic generator.
- Do not treat it as an active runtime prompt unless the user explicitly reintroduces LLM generation.

### Prompt History

- `PROMPTS.md` must be maintained as a running log of user prompts for this project thread or continuation work.
- Append each new user prompt in order.
- Preserve prompt wording verbatim unless redaction is explicitly required.
- Do not silently rewrite previous prompts.
- If the thread meaningfully branches, add a small label or section header rather than deleting history.

### Rendering

- Prefer deterministic structured mapping first, then rendering.
- HTML should remain readable and deterministic.
- PDF generation must be reproducible from saved HTML where possible.
- Debug artifacts like rendered JSON or HTML should stay optional per run.

## Validation Rules

Before considering work complete, agents should run the relevant checks.

Minimum expectations:

- build succeeds
- candidate profile validation succeeds when profile-related changes are made
- generation path is smoke-tested when generator behavior changes

Expected commands include:

```bash
npm run build
npm run validate:profile
```

If generation code changes, run a real generation command when feasible.

## Git Discipline

This repository should maintain a clean, intentional git history.

Agents should:

- make small, coherent changes
- keep commits scoped to a single logical iteration where practical
- review `git diff` before committing
- avoid mixing unrelated changes in the same commit
- include docs/config updates in the same commit when they are part of the same change

Agents must not:

- create vague commits
- commit broken builds intentionally
- commit secrets, `.env` files, or user-private data unintentionally
- rewrite history unless explicitly requested

## Autonomous Commit Policy

The user wants agents in this repo to commit autonomously after each iteration.

Interpretation for this repository:

- After completing a coherent iteration of work, create a commit without waiting for an extra prompt.
- An iteration means a logically grouped change that leaves the repository in a better, working state.
- Do not create micro-commits for every file edit.
- Do not commit if the change is incomplete, broken, or blocked.
- Before committing, run the relevant validation commands for the scope of the change.
- Commit messages should be short, specific, and descriptive.

Recommended commit style:

- `add candidate profile schema validation`
- `build deterministic cv generator cli`
- `document generator setup and usage`

If a commit is not created because validation failed or the work is incomplete, state that explicitly.

## Working Style

When making changes:

1. inspect the current repository state
2. understand the existing structure before editing
3. make the smallest coherent change that solves the problem
4. validate the result
5. update docs and `PROMPTS.md` if needed
6. commit the iteration if it is complete and valid

## Documentation Expectations

When behavior changes, update the relevant files:

- `README.md` for user-facing setup and usage
- `PRINCIPLES.md` for generation rules
- `PROMPTS.md` for ongoing prompt history
- `candidate-profile.template.yaml` and schema files for data model changes

## Security and Data Handling

- Never commit `.env` files.
- Never log or print secrets unnecessarily.
- Treat candidate profile content as user-owned personal data.
- Avoid copying profile content into unrelated files unless the feature explicitly requires it.

## Decision Priorities

When tradeoffs exist, prefer:

1. correctness
2. truthfulness of generated CV content
3. validation and reproducibility
4. maintainability
5. pluggability
6. aesthetics
