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
