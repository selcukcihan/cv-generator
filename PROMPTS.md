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
