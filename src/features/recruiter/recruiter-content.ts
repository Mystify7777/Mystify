import type { RegistryCounts } from "@/data/registry/store";
import type { ProjectRecord } from "@/data/registry/types";

export const RECRUITER_IDENTITY = {
  name: "Aryan Kumar",
  role: "Software Engineer",
  thesis: "Truth exists before presentation.",
  engineeringIdentity: "Ontological Design",
} as const;

export const RECRUITER_BOOT_STEPS = [
  "Initializing Observatory",
  "Loading canonical registries",
  "Preparing evidence surface",
] as const;

export const RECRUITER_CREDENTIALS = [
  {
    label: "Engineering focus",
    value: "Software systems and product engineering",
  },
  {
    label: "Primary evidence",
    value: "Projects, decisions, constraints, and observations",
  },
] as const;

export const CATEGORY_INTEGRITY = {
  title: "Category Integrity",
  statement:
    "Different kinds of truth must be kept separate so each can remain honest in its own domain.",
} as const;

export function getRecruiterQuickSignals(counts: RegistryCounts) {
  return [
    { label: "Projects", value: counts.projects },
    { label: "Constraints", value: counts.constraints },
    { label: "Tradeoffs", value: counts.tradeoffs },
    { label: "Observations", value: counts.observations },
  ];
}

export function getCategoryIntegrityExamples(projects: readonly ProjectRecord[]) {
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
