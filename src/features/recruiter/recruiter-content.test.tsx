import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecruiterBootSequence } from "@/features/recruiter/boot-sequence";
import { RecruiterEvidenceCard } from "@/features/recruiter/evidence-card";
import {
  CATEGORY_INTEGRITY,
  getCategoryIntegrityExamples,
  getRecruiterBootSteps,
  getRecruiterQuickSignals,
  RECRUITER_CREDENTIALS,
  RECRUITER_IDENTITY,
  RECRUITER_RESUME_PATH,
  scheduleRecruiterBootStep,
} from "@/features/recruiter/recruiter-content";
import type { RegistryCounts } from "@/data/registry/store";
import type { ProjectRecord } from "@/data/registry/types";

const counts: RegistryCounts = {
  projects: 6,
  constraints: 14,
  tradeoffs: 11,
  observations: 10,
  patterns: 1,
  discoveries: 0,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("recruiter content contracts", () => {
  it("exposes the locked identity and credentials", () => {
    expect(RECRUITER_IDENTITY).toMatchObject({
      name: "ARYAN KUMAR",
      role: "Software Engineer",
      institution: "BCET Durgapur",
      graduationYear: "2026",
      engineeringIdentity: "Category Integrity",
    });
    expect(RECRUITER_CREDENTIALS).toEqual([
      {
        label: "Education",
        value: "B.Tech CSE · BCET Durgapur · 2026",
      },
      {
        label: "Credential",
        value: "CGPA 8.52 · SIH 2024 Finalist",
      },
    ]);
    expect(RECRUITER_IDENTITY.thesis).toContain(
      "Every project in this portfolio is backed by structured engineering evidence.",
    );
    expect(CATEGORY_INTEGRITY.statement).toBe(
      "Different kinds of truth remain separate so each can stay honest in its own domain.",
    );
  });

  it("renders the locked recruiter boot sequence in order", () => {
    expect(getRecruiterBootSteps(counts)).toEqual([
      "initializing observatory...",
      "loading knowledge graph... 6 projects · 14 constraints · 11 tradeoffs",
      "visitor context: unknown",
      "rendering truth layer... complete",
      "select your lens",
    ]);

    const markup = renderToStaticMarkup(
      <RecruiterBootSequence onComplete={() => undefined} />,
    );
    expect(markup).toContain("initializing observatory...");
    expect(markup).toContain('aria-live="polite"');
  });

  it("advances a boot step after the configured delay", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    scheduleRecruiterBootStep(onComplete, 900);

    expect(onComplete).not.toHaveBeenCalled();
    vi.advanceTimersByTime(899);
    expect(onComplete).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("cleans up a scheduled boot step when cancelled", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const cancel = scheduleRecruiterBootStep(onComplete, 900);

    cancel();
    vi.advanceTimersByTime(900);

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("keeps quick signals derived from registry counts", () => {
    expect(getRecruiterQuickSignals(counts)).toEqual([
      { label: "Projects", value: 6 },
      { label: "Constraints", value: 14 },
      { label: "Tradeoffs", value: 11 },
      { label: "Observations", value: 10 },
    ]);
  });

  it("keeps only canonical project evidence and limits it to three examples", () => {
    const projects = [
      {
        id: "one",
        name: "One",
        thesis: "One thesis",
        engineeringIdentity: "One identity",
      },
      {
        id: "missing-thesis",
        name: "Missing Thesis",
        engineeringIdentity: "Identity",
      },
      {
        id: "two",
        name: "Two",
        thesis: "Two thesis",
        engineeringIdentity: "Two identity",
      },
      {
        id: "three",
        name: "Three",
        thesis: "Three thesis",
        engineeringIdentity: "Three identity",
      },
      {
        id: "four",
        name: "Four",
        thesis: "Four thesis",
        engineeringIdentity: "Four identity",
      },
    ] as unknown as readonly ProjectRecord[];

    expect(getCategoryIntegrityExamples(projects)).toEqual([
      {
        projectId: "one",
        projectName: "One",
        thesis: "One thesis",
        engineeringIdentity: "One identity",
      },
      {
        projectId: "two",
        projectName: "Two",
        thesis: "Two thesis",
        engineeringIdentity: "Two identity",
      },
      {
        projectId: "three",
        projectName: "Three",
        thesis: "Three thesis",
        engineeringIdentity: "Three identity",
      },
    ]);
  });

  it("renders the resume as a direct PDF download and contact collapsed by default", () => {
    const markup = renderToStaticMarkup(<RecruiterEvidenceCard />);

    expect(markup).toContain(`href="${RECRUITER_RESUME_PATH}"`);
    expect(markup).toContain("download");
    expect(markup).toContain("Download Resume");
    expect(markup).toContain("Start Conversation");
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).not.toContain("Interested in working together?");
  });
});
