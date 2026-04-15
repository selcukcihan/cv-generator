import { RenderableCv, CvReferenceEntry } from "./types";

type CandidateProfile = {
  basics?: {
    email?: string;
    url?: string;
  };
  summary?: string;
  references?: Array<{
    name?: string;
    title?: string;
    contact?: string;
    testimonial?: string;
  }>;
};

export function createRenderableCv(generated: Omit<RenderableCv, "summary" | "references">, profile: unknown): RenderableCv {
  const candidate = (profile ?? {}) as CandidateProfile;
  const references: CvReferenceEntry[] = Array.isArray(candidate.references)
    ? candidate.references.map((reference) => ({
        name: reference.name ?? "",
        title: reference.title ?? "",
        contact: reference.contact ?? "",
        testimonial: reference.testimonial ?? ""
      }))
    : [];

  return {
    ...generated,
    contact: {
      ...generated.contact,
      email: candidate.basics?.email ?? generated.contact.email,
      url: candidate.basics?.url ?? generated.contact.url
    },
    summary: candidate.summary ?? "",
    references
  };
}
