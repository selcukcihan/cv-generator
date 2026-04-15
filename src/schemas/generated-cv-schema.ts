export const generatedCvSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "fullName",
    "headline",
    "contact",
    "summary",
    "experience",
    "projects",
    "education",
    "certifications",
    "skills",
    "extras"
  ],
  properties: {
    fullName: { type: "string", minLength: 1 },
    headline: { type: "string" },
    summary: { type: "string", minLength: 1 },
    contact: {
      type: "object",
      additionalProperties: false,
      required: ["location", "email", "phone", "linkedin", "github", "website"],
      properties: {
        location: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" },
        website: { type: "string" }
      }
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["company", "title", "dates", "location", "bullets"],
        properties: {
          company: { type: "string", minLength: 1 },
          title: { type: "string", minLength: 1 },
          dates: { type: "string" },
          location: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string", minLength: 1 }
          }
        }
      }
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "subtitle", "bullets"],
        properties: {
          name: { type: "string", minLength: 1 },
          subtitle: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string", minLength: 1 }
          }
        }
      }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["institution", "degree", "dates", "details"],
        properties: {
          institution: { type: "string", minLength: 1 },
          degree: { type: "string", minLength: 1 },
          dates: { type: "string" },
          details: {
            type: "array",
            items: { type: "string", minLength: 1 }
          }
        }
      }
    },
    certifications: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "issuer", "date", "details"],
        properties: {
          name: { type: "string", minLength: 1 },
          issuer: { type: "string" },
          date: { type: "string" },
          details: {
            type: "array",
            items: { type: "string", minLength: 1 }
          }
        }
      }
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "items"],
        properties: {
          category: { type: "string", minLength: 1 },
          items: {
            type: "array",
            items: { type: "string", minLength: 1 }
          }
        }
      }
    },
    extras: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "items"],
        properties: {
          title: { type: "string", minLength: 1 },
          items: {
            type: "array",
            items: { type: "string", minLength: 1 }
          }
        }
      }
    }
  }
} as const;
