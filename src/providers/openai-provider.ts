import OpenAI from "openai";

import { buildSystemPrompt, buildUserPrompt } from "../lib/prompt";
import { generatedCvSchema } from "../schemas/generated-cv-schema";
import { GenerateCliOptions, GenerationContext, GeneratedCv, LlmProvider } from "../lib/types";

type OpenAiProviderConfig = {
  apiKey: string;
  model: string;
  baseUrl?: string;
};

export class OpenAiProvider implements LlmProvider {
  private readonly client: OpenAI;

  private readonly model: string;

  constructor(config: OpenAiProviderConfig) {
    this.model = config.model;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl
    });
  }

  async generateCv(context: GenerationContext, options: GenerateCliOptions): Promise<GeneratedCv> {
    const response = await this.client.responses.create({
      model: options.model || this.model,
      temperature: options.temperature,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: buildSystemPrompt()
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildUserPrompt(context, options)
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "generated_cv",
          strict: true,
          schema: generatedCvSchema
        }
      }
    });

    const outputText = response.output_text;
    if (!outputText) {
      throw new Error("OpenAI response did not include output_text");
    }

    return JSON.parse(outputText) as GeneratedCv;
  }
}
