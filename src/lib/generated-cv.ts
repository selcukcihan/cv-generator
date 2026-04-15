import Ajv2020 from "ajv/dist/2020";

import { generatedCvSchema } from "../schemas/generated-cv-schema";
import { GeneratedCv } from "./types";

export function validateGeneratedCv(payload: unknown): GeneratedCv {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(generatedCvSchema);
  const valid = validate(payload);

  if (!valid) {
    const details = (validate.errors ?? [])
      .map((error) => `- ${error.instancePath || "$"}: ${error.message ?? "validation error"}`)
      .join("\n");

    throw new Error(`Generated CV validation failed:\n${details}`);
  }

  return payload as GeneratedCv;
}
