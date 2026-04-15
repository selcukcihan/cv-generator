import { AppEnv } from "./config";
import { LlmProvider, ProviderName } from "./types";
import { OpenAiProvider } from "../providers/openai-provider";

export function createProvider(provider: ProviderName, env: AppEnv, modelOverride?: string): LlmProvider {
  switch (provider) {
    case "openai": {
      const apiKey = env.openAiApiKey;
      const model = modelOverride || env.openAiModel;

      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is required when provider is openai");
      }

      if (!model) {
        throw new Error("OPENAI_MODEL is required when provider is openai or via --model");
      }

      return new OpenAiProvider({
        apiKey,
        model,
        baseUrl: env.openAiBaseUrl
      });
    }
    default:
      throw new Error(`Unsupported provider: ${provider satisfies never}`);
  }
}
