# Thread Prompts

## 1

I've read a nice blog post about CVs in tech companies and I want to create a cv generator app based on the principles in this blog post. I want you to first create a markdown file that the cv generator will then use while generating CVs to make sure the generated CV is based on the principles outlined in that markdown file. The name of the markdown file will be PRINCIPLES.md and the blog post is on https://open.substack.com/pub/systemdesignone/p/software-engineer-resume?utm_campaign=post-expanded-share&utm_medium=post%20viewer

## 2

The [PRINCIPLES.md](PRINCIPLES.md) file will be read by LLMs, do you think it is suitable? Or do we need to refactor it to tailor for LLM processing?

## 3

Yes please, let's make that

## 4

Before we write the generator app, let's focus on which information we'll request from the user. We must make it easy for users to provide that information, so a structured document would be great. The user can maintain the source document, it can have sections like name, interests, roles, education, certificates etc.

## 5

Let's not use markdown for this, I think JSON or YAML would be better because this is structured data.

## 6

Yes that makes sense, let's add a formal schema and enforce it

## 7

Let's stick to TypeScript, no need for ruby or another language.

## 8

Let's create the generator, it will be a simple LLM assisted generator. We'll feed the user data and the [PRINCIPLES.md](PRINCIPLES.md) to it and it will generate a PDF document. What else should we make configurable per run, let's also think about that. In the end, I envision people will clone this repo, adjust their data and use the generator. Or we can later make it an npm package and publish it so people can hook their own llm and use it. The LLM part must be pluggable, we must support openai's api first and later on we can add other providers as well. The API key and model name etc. can be read from a .env file.

## 9

Can you help me fill out [candidate-profile.yaml](candidate-profile.yaml) using my CV from https://github.com/selcukcihan/selcukcihan.github.io/blob/main/public/resume/selcukcihan.pdf

## 10

Please add .env files to gitignore

## 11

What is OPENAI_BASE_URL?

## 12

Can you create a PROMPTS.md file and put all the prompts I've given to you in this thread up to now?

## 13

Create an AGENTS.md file suitable for this repository. Please ensure it promotes engineering best practices and also maintains the [PROMPTS.md](PROMPTS.md) with each prompt. I also want it to maintain git and autonomously commit after each iteration.

## 14

Let's cut some clutter, I'll list the fields that we must drop from our schema as well as from the rendering ofcourse. These are the data we drop:

github url, linkedin url (we only want a single url, that can be any url, so name it genericly)
Skills will be generic as well not categorized, and we should not present them under categories, so a flat list is fine
summary section must not be generated, we should ask this from the user.
References are important, we must add it to schema and rendering if it's missing.

## 15

We must simplify our schema, let's take the user data in candidate-profile.yaml file as an example of our minimalist schema and drop any fields that it does not use.

## 16

We must drop phone as well

## 17

Let's also drop:
awards, interests, targeting (whole section)

## 18

Let's drop location as well. Also for references, each reference has a name, title, contact field and a summary (of their recommendation).

For experience items, keep it simple as well:
- title
- company
- dates
- url
- list of descriptions (which will summarize the relevant work done in that company)

## 19

Can you put the below text in my summary in my personal yaml file?

As a former Amazonian devoted to helping customers and solving problems, Selçuk brings a strong sense of
ownership and a track record of delivering results.

With over fifteen years of experience developing enterprise grade applications, he has a proven ability to take
on technical & management duties from operations to development, team building and architecture.

He successfully managed the development of mission-critical workflows and optimized engineering processes
to enhance eﬃciency and deliver value. His ability to balance technical depth with strategic vision enables him
to inspire teams and deliver innovative solutions that align with organizational goals.

## 20

Let's remove my personal data from gitignore if it's there and version control it, I want it in the repo

## 21

I want you to update my experience using the data from https://github.com/selcukcihan/selcukcihan.github.io/blob/main/public/resume/selcukcihan_cv.pdf please do it exactly, the bullet points in the pdf for each experience must be captured in the personal yaml file

## 22

Let's drop relevance from certifications

## 23

Any links must be rendered without the protocol, the actual link should have the protocol like https but it should not be rendered, so for example selcukcihan.com instead of https://selcukcihan.com

## 24

The summary section in references is not a summary actually, it is what the reference had to tell about the CV owner. So it's like testimonial, we should name it as such and also render it without a bullet point but maybe in a style to make it stand out as a referral/testimonial

## 25

I think we came to a good place now in this repo. But one thing bugs me, it seems we don't need an LLM, what does the LLM add to this generator?

## 26

Let's make it deterministic, remove the llm and all related stuff that we were using while doing the generation. But keep principles.md file

## 27

Let's ensure we don't break the page in the middle of a section when generating PDF with multiple pages

## 28

I think there's a problem with summary section. After summary we had a page break, why?

## 29

Can we make the font smaller for the bullet points of experience? It is even bigger than the summary font size

## 30

The html version of the CV has no margins on the sides, I want it to be centered and equal spacing on both sides

## 31

We must mention our starting point and where we derived principles from: https://open.substack.com/pub/systemdesignone/p/software-engineer-resume?utm_campaign=post-expanded-share&utm_medium=post%20viewer

## 32

I want to publish this on npm, how can I do that? Would be good to tie it with github as well so that the npm releases appear there also

## 33

Let's use the name "scihan" as npm organization name

## 34

Let's update the README file such that we regard it as the user facing document, should be very simple as non-tech people may also read it to use the tool. The tool's help manual must be also simple and useful. For dev related readme stuff let's create a separate file in the repo.

Also create an icon for this project so it appears on github and npm.

## 35

Ok, now let's add a new feature. I want to ensure generated CVs match a certain level of quality in terms of both content, layout and in terms of SEO or bot readability because most of the CVs are first filtered by bots or AI agents before being considered by a real human being. What do you think we can do, how can we validate or score a CV that we generated? I don't want to judge intermediate data or initial data, I want to judge the final generated PDF.

## 36

Yes please go ahead

## 37

Can you do a search to see if there's already tools that we can use to score a CV? If so we can do our own scoring and combine it with some other scoring to have a better signal

## 38

Ok let's go with openresume. But I really do want to keep our CLI tool very simple. For example, let's not create separate commands for scoring, it would be a command line option to disable scoring otherwise it would automatically score after generating a CV. This tool will be used by non tech people as well. Keep it very very simple on the user interface surface.

## 39

Let's create a static documentation website based on github pages. Keep it very simple, just a single page, static content, minimal dependencies and elegant slick design.

## 40

Let's also add opengraph tags for better shareability.

## 41

Would be great to render my example CV on the docs website. Also there's an issue with OG image because https://cv-generator.selcukcihan.com/assets/icon.svg returns 404 and I tried it on twitter and it did not work. While at it, let's update the icon and create a better one. It must look simple, professional, unique and graspable

## 42

I tried releasing version 1.0.2 but on github the "Publish to npm" step failed with

2s
Run npm publish

> @scihan/cv-generator@1.0.2 prepack
> npm run build


> @scihan/cv-generator@1.0.2 build
> node -e "require('fs').rmSync('dist', { recursive: true, force: true })" && tsc -p tsconfig.json

npm notice
npm notice 📦  @scihan/cv-generator@1.0.2
npm notice Tarball Contents
npm notice 10.1kB PRINCIPLES.md
npm notice 2.1kB README.md
npm notice 1.3kB assets/icon.svg
npm notice 4.8kB candidate-profile.schema.json
npm notice 522B candidate-profile.template.yaml
npm notice 6.4kB dist/candidate-profile.schema.json
npm notice 2.4kB dist/scripts/generate-cv.js
npm notice 540B dist/scripts/validate-candidate-profile.js
npm notice 3.0kB dist/src/lib/config.js
npm notice 1.0kB dist/src/lib/fs.js
npm notice 19.0kB dist/src/lib/pdf-validator.js
npm notice 1.6kB dist/src/lib/profile.js
npm notice 2.1kB dist/src/lib/renderable-cv.js
npm notice 77B dist/src/lib/types.js
npm notice 9.8kB dist/src/render/html.js
npm notice 1.1kB dist/src/render/pdf.js
npm notice 1.4kB package.json
npm notice Tarball Details
npm notice name: @scihan/cv-generator
npm notice version: 1.0.2
npm notice filename: scihan-cv-generator-1.0.2.tgz
npm notice package size: 17.6 kB
npm notice unpacked size: 67.2 kB
npm notice shasum: 2702a79b49967764fc597bbba5d29931f4f81610
npm notice integrity: sha512-rRSQHDLvatkw0[...]/YMd5mPIugdEQ==
npm notice total files: 17
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/@scihan%2fcv-generator - Not found
npm error 404
npm error 404  '@scihan/cv-generator@1.0.2' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-04-28T14_54_41_474Z-debug-0.log
Error: Process completed with exit code 1.

## 43

No, I made sure it is manually published on npm and npm has the trusted publishing set up but it still fails with the same 404 error on github actions. What setting are we missing? 

## 44

Ok fix the url please

## 45

Did not work, same 404 error.

## 46

Ok let's remove automated publishing.

## 47

One thing we should also fix, the public facing docs website does not mention how to install the tool. It would be good to extend the docs to include either npm install or run it directly with npx. One more thing, we must show an example yaml in the docs so people get a feeling of what it looks like. I'd also change the "How it works" section to be more specific like with exact commands to run.

## 48

I tried to follow the docs on the website, I installed the npm package. Then I tried "cp candidate-profile.template.yaml candidate-profile.yaml" but since there's no candidate.profile.template.yaml it failed. I think we must have a bootstrap command to initialize a candidate-profile.yaml file
