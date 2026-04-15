export type ContactInfo = {
  email: string;
  url: string;
};

export type CvExperienceEntry = {
  title: string;
  company: string;
  dates: string;
  url: string;
  descriptions: string[];
};

export type CvProjectEntry = {
  name: string;
  subtitle: string;
  bullets: string[];
};

export type CvEducationEntry = {
  institution: string;
  degree: string;
  dates: string;
  details: string[];
};

export type CvCertificationEntry = {
  name: string;
  issuer: string;
  date: string;
  details: string[];
};

export type CvReferenceEntry = {
  name: string;
  title: string;
  contact: string;
  testimonial: string;
};

export type CvExtraSection = {
  title: string;
  items: string[];
};

export type GeneratedCv = {
  fullName: string;
  headline: string;
  contact: ContactInfo;
  experience: CvExperienceEntry[];
  projects: CvProjectEntry[];
  education: CvEducationEntry[];
  certifications: CvCertificationEntry[];
  skills: string[];
  extras: CvExtraSection[];
};

export type RenderableCv = GeneratedCv & {
  summary: string;
  references: CvReferenceEntry[];
};

export type ProviderName = "openai";

export type ThemeName = "classic" | "modern" | "compact";

export type PageSize = "A4" | "Letter";

export type GenerateCliOptions = {
  profilePath: string;
  outputPdfPath: string;
  outputHtmlPath?: string;
  outputJsonPath?: string;
  provider: ProviderName;
  model?: string;
  company?: string;
  roleTitle?: string;
  theme: ThemeName;
  pageSize: PageSize;
  temperature?: number;
};

export type GenerationContext = {
  principles: string;
  profileYaml: string;
  profileData: unknown;
  companyOverride?: string;
  roleTitleOverride?: string;
};

export interface LlmProvider {
  generateCv(context: GenerationContext, options: GenerateCliOptions): Promise<GeneratedCv>;
}
