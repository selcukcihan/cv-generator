import Ajv2020 from "ajv/dist/2020";
import YAML from "yaml";

import candidateProfileSchema from "../../candidate-profile.schema.json";
import { readTextFile, resolveFromCwd } from "./fs";

export function loadProfileYaml(profilePath: string): { raw: string; data: unknown; absolutePath: string } {
  const absolutePath = resolveFromCwd(profilePath);
  const raw = readTextFile(absolutePath);
  const data = YAML.parse(raw) as unknown;

  return { raw, data, absolutePath };
}

export function validateProfile(profileData: unknown): void {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(candidateProfileSchema);
  const valid = validate(profileData);

  if (valid) {
    return;
  }

  const details = (validate.errors ?? [])
    .map((error) => {
      const location = error.instancePath || "$";
      const missingProperty =
        typeof error.params === "object" &&
        error.params !== null &&
        "missingProperty" in error.params
          ? ` (${String(error.params.missingProperty)})`
          : "";

      return `- ${location}: ${error.message ?? "validation error"}${missingProperty}`;
    })
    .join("\n");

  throw new Error(`Candidate profile validation failed:\n${details}`);
}
