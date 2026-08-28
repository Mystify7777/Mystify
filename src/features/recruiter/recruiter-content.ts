import type { RegistryCounts } from "@/data/registry/store";
import type { ProjectRecord } from "@/data/registry/types";

export const RECRUITER_IDENTITY = {
  name: "ARYAN KUMAR",
  role: "Software Engineer",
  institution: "BCET Durgapur",
  graduationYear: "2026",
  thesis:
    "Every project in this portfolio is backed by structured engineering evidence. Constraints, tradeoffs, observations, and design decisions are stored as first-class data rather than hidden implementation history.",
  engineeringIdentity: "Category Integrity",
  engineeringPrinciple:
    "Different kinds of truth remain separate so each can stay honest in its own domain.",
} as const;

export const RECRUITER_RESUME_PATH = "/resume.pdf";

export function getRecruiterBootSteps(counts: RegistryCounts) {
  return [
    "initializing observatory...",
    `loading knowledge graph... ${counts.projects} projects · ${counts.constraints} constraints · ${counts.tradeoffs} tradeoffs`,
    "visitor context: unknown",
    "rendering truth layer... complete",
    "select your lens",
  ] as const;
}

export const RECRUITER_CREDENTIALS = [
  {
    label: "Education",
    value: "B.Tech CSE · BCET Durgapur · 2026",
  },
  {
    label: "Credential",
    value: "CGPA 8.52 · SIH 2024 Finalist",
  },
] as const;

export const CATEGORY_INTEGRITY = {
  title: "Engineering Identity",
  statement:
    "Different kinds of truth remain separate so each can stay honest in its own domain.",
} as const;

export const RECRUITER_CONTACT = {
  headline: "Interested in working together?",
  responseTime: "Typically within 48 hours",
  primary: "Inline contact form",
  secondary: "LinkedIn · GitHub",
} as const;

export function getRecruiterQuickSignals(counts: RegistryCounts) {
  return [
    { label: "Projects", value: counts.projects },
    { label: "Constraints", value: counts.constraints },
    { label: "Tradeoffs", value: counts.tradeoffs },
    { label: "Observations", value: counts.observations },
  ];
}

export function getCategoryIntegrityExamples(
  projects: readonly ProjectRecord[],
) {
  return projects
    .filter(
      (project) =>
        Boolean(project.thesis) && Boolean(project.engineeringIdentity),
    )
    .slice(0, 3)
    .map((project) => ({
      projectId: project.id,
      projectName: project.name,
      thesis: project.thesis as string,
      engineeringIdentity: project.engineeringIdentity as string,
    }));
}

export function scheduleRecruiterBootStep(
  callback: () => void,
  delayMs: number,
): () => void {
  const timer = setTimeout(callback, delayMs);
  return () => clearTimeout(timer);
}
