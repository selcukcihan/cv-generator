import { loadProfileYaml, validateProfile } from "../src/lib/profile";

function main(): void {
  const targetArg = process.argv[2];
  if (!targetArg) {
    console.error("Usage: node dist/scripts/validate-candidate-profile.js path/to/candidate-profile.yaml");
    process.exit(1);
  }

  const profile = loadProfileYaml(targetArg);
  validateProfile(profile.data);
  console.log(`Valid candidate profile: ${profile.absolutePath}`);
}

main();
