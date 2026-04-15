# CV Generator Instruction Spec

This file is written for LLM consumption.

Use it as an instruction layer when generating a software engineering CV.

Primary source distilled into this spec: [Software Engineer Resume - Austen McDonald and Neo Kim](https://newsletter.systemdesign.one/p/software-engineer-resume)

## Objective

Generate a software engineering CV that is:

- ATS-safe
- easy for recruiters to scan quickly
- strong enough to support interviewer follow-up
- clearly relevant to the target role

Treat the CV as a conversion document, not a life summary.

The CV must work for four readers:

1. ATS / screening systems
2. Recruiters
3. Interviewers
4. Hiring managers

## Instruction Priority

When rules conflict, apply this priority order:

1. Truthfulness and factual consistency
2. Relevance to the target role
3. Clarity and scannability
4. ATS-safe formatting
5. Brevity / one-page fit
6. Completeness

If a candidate has too much material for one page, compress low-value or old content before weakening relevance or clarity.

## Output Contract

The generated CV should:

- use standard resume section names
- read clearly in plain text
- avoid decorative structure that may break ATS parsing
- present the strongest evidence early
- sound specific and grounded, not generic or hype-driven

The generated CV must not:

- invent facts
- claim skills or impact unsupported by the input
- use keyword stuffing
- optimize for style at the expense of scannability

## Required Rules

### Required: Structure

Use standard section names when those sections exist:

- Contact Information
- Summary
- Experience
- Education
- Projects
- Skills

Default order:

1. Contact Information
2. Summary
3. Experience
4. Education
5. Projects
6. Skills

You may reorder sections only when doing so materially improves relevance for the target role.

Examples:

- New grad: move `Projects` above `Experience` if projects carry the strongest signal.
- Experienced engineer: de-emphasize `Education`.
- Career pivot: move the most relevant proof higher.

### Required: ATS Safety

Generate content that remains easy to parse if exported to PDF or plain text.

Use:

- simple section titles
- straightforward line structure
- conventional job titles and company labeling

Avoid:

- tables
- text boxes
- icons
- images
- nonstandard section names
- decorative layout dependencies

### Required: Summary

Do not generate the summary.

If a summary section is rendered, it must come directly from user-provided input.

The generator may place the user-provided summary in the output, but it must not invent, rewrite, or expand it.

If the user provides a summary, prefer:

- short, specific wording
- direct relevance to the target role
- no generic AI-style phrasing

If no summary is provided, omit the summary section.

### Required: Experience Bullets

Experience is the highest-value section for most candidates.

Each bullet should show business or product value created through technical work.

Preferred bullet pattern:

`[Strong action verb] + [what changed] + [how it was done] + [scope / metric / constraint]`

Good bullets usually include one or more of:

- measurable impact
- scale
- ownership
- technical complexity
- leadership
- reliability or performance improvement
- business outcome

Bad bullets usually focus only on:

- tasks
- participation
- vague collaboration
- tool lists with no outcome

### Required: Bullet Ordering

Within each role:

- place the strongest and most relevant bullets first
- do not order bullets purely by chronology

Across the CV:

- allocate more space to recent or flagship experience
- compress older or weaker experience
- reduce low-signal roles to fewer bullets or one line when necessary

### Required: Skills

Include a skills section when skills are available.

Skills must be:

- truthful
- relevant
- compact
- presented as a single flat list
- ordered by relevance to the target role

Do not include every technology ever touched.

### Required: References

If references are provided in the candidate input, include a references section.

References must:

- come directly from user-provided data
- preserve factual contact and relationship details
- not be invented, expanded, or paraphrased into stronger claims

### Required: Tailoring

If a target role or job description is available, tailor the CV.

Tailoring actions:

1. identify repeated concepts and technologies
2. identify must-haves versus nice-to-haves
3. infer the core hiring need
4. emphasize matching evidence from the candidate input
5. reorder sections, bullets, and skills based on relevance

Tailor by selection and ordering first. Rewrite only where needed.

### Required: Truthfulness

Never fabricate:

- metrics
- ownership
- scope
- technologies used
- dates
- titles
- leadership claims

If the input does not support a strong claim, use a weaker but truthful phrasing.

## Preferred Rules

### Preferred: Contact Information

Include:

- name
- email
- one generic URL when available

Include only if clearly helpful:

- phone number

Exclude low-quality or redundant links that weaken the application.

### Preferred: Quantification

Quantify impact whenever credible.

Useful evidence types:

- latency
- uptime
- throughput
- conversion
- revenue
- cost
- adoption
- user count
- data volume
- delivery time
- defect reduction
- team or project scope

If exact numbers are unavailable, use bounded or directional language only if justified by the input.

### Preferred: Project Selection

Projects matter most for:

- new grads
- career pivots
- weak direct experience matches
- roles where side work is the strongest evidence

Project bullets should favor:

- initiative
- interesting technical decisions
- shipped outcomes
- depth over generic app descriptions

### Preferred: Scannability

Make the CV easy to scan in under 10 seconds.

Prioritize:

- strongest content near the top
- clear role boundaries
- recognizable company and title information
- short, high-signal bullets
- consistent formatting

### Preferred: Tone

Write in a direct, specific, professional tone.

Prefer:

- concrete verbs
- clear nouns
- grounded claims

Avoid:

- hype
- buzzwords
- empty self-description
- corporate filler

## Forbidden Rules

Never include:

- age
- photo
- full street address
- irrelevant social links
- references available upon request
- hobbies unless directly relevant
- ATS gaming tactics such as hidden keywords
- filler content that does not help a hiring decision

Avoid these phrases unless the input explicitly requires them and they add real meaning:

- results-driven
- passionate
- detail-oriented
- team player
- cross-functional
- hardworking
- innovative

## Deterministic Generation Workflow

Follow these steps in order.

### Step 1: Parse Inputs

Extract:

- candidate identity
- roles, dates, titles, employers
- achievements
- technologies
- education
- projects
- target role or job description

### Step 2: Rank Evidence

Rank candidate evidence by:

1. relevance to target role
2. impact
3. recency
4. credibility / specificity

### Step 3: Choose Section Strategy

Select section order based on candidate type:

- experienced candidate: `Experience` dominates
- new grad: `Projects` may move higher
- pivot candidate: surface strongest relevant proof first

### Step 4: Draft Summary

Use the user-provided summary as-is when present. Do not generate or rewrite a summary.

### Step 5: Build Experience

For each role:

- choose the most relevant bullets
- rewrite bullets to lead with outcome
- embed technologies naturally when relevant
- place the best bullet first

### Step 6: Add Supporting Sections

Add:

- summary only if user-provided
- education if relevant or expected
- projects if they improve fit
- skills as a flat relevant list
- references if provided

### Step 7: Compress

Reduce low-value content until the CV is compact enough.

Compression order:

1. remove irrelevant details
2. shorten old roles
3. reduce weak project content
4. trim skills to relevant items
5. shorten wording without losing meaning

### Step 8: Validate

Run the validation checklist below before finalizing output.

## Validation Checklist

A valid CV should pass all checks below.

### Pass / Fail Checks

- The CV is factually consistent with the input.
- The target role is clearly reflected in the summary or top experience bullets.
- If a summary is present, it matches user-provided text rather than generated text.
- The top of the CV contains the strongest evidence.
- The CV uses standard section names.
- The bullets describe outcomes, not just responsibilities.
- The skills section contains relevant and believable skills.
- Irrelevant or filler content has been removed.
- The document is easy to read in plain text.
- The document is likely to remain ATS-parseable.

### Strong Output Checks

- A recruiter could understand candidate fit in under 10 seconds.
- If a summary is present, it sounds specific to this candidate.
- The first bullet under each recent role is one of the strongest bullets.
- Metrics appear where credible.
- Technologies appear in context, not as random keyword stuffing.
- Older experience is compressed appropriately.

## Conflict Resolution Rules

If forced to choose:

- prefer truth over impressiveness
- prefer relevance over completeness
- prefer clarity over cleverness
- prefer strong evidence over broad coverage
- prefer fewer strong bullets over many weak bullets
- prefer ATS safety over visually creative formatting

## Fallback Rules

If job description is missing:

- optimize for the candidate's most credible strengths
- emphasize broadly valuable engineering signals such as ownership, impact, reliability, performance, scale, and delivery

If metrics are missing:

- do not invent numbers
- still write outcome-oriented bullets using concrete change language

If experience is weak:

- elevate strong projects, open source, writing, or adjacent evidence

If information is sparse:

- keep the CV short
- avoid generic filler to pad length

## Short Generator Reminder

Generate a truthful, tailored, ATS-safe software engineering CV that surfaces the candidate's strongest relevant evidence quickly. Optimize for recruiter comprehension, interviewer defensibility, and hiring-manager relevance. Avoid generic language, weak bullets, and decorative formatting.
