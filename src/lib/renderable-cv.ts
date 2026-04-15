import { RenderableCv, CvReferenceEntry } from "./types";

type CandidateProfile = {
  basics?: {
    location?: string;
    email?: string;
    phone?: string;
    url?: string;
  };
  summary?: string;
  references?: Array<{
    name?: string;
    contact?: string;
    about?: string;
    relation?: string;
  }>;
};

export function createRenderableCv(generated: Omit<RenderableCv, "summary" | "references">, profile: unknown): RenderableCv {
  const candidate = (profile ?? {}) as CandidateProfile;
  const references: CvReferenceEntry[] = Array.isArray(candidate.references)
    ? candidate.references.map((reference) => ({
        name: reference.name ?? "",
        contact: reference.contact ?? "",
        about: reference.about ?? "",
        relation: reference.relation ?? ""
      }))
    : [];

  return {
    ...generated,
    contact: {
      ...generated.contact,
      location: candidate.basics?.location ?? generated.contact.location,
      email: candidate.basics?.email ?? generated.contact.email,
      phone: candidate.basics?.phone ?? generated.contact.phone,
      url: candidate.basics?.url ?? generated.contact.url
    },
    summary: candidate.summary ?? "",
    references
  };
}
