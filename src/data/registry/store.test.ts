import { describe, expect, it } from "vitest";
import {
  getConstraint,
  getConstraintsByProject,
  getDiscovery,
  getDiscoveries,
  getObservation,
  getObservationsByProject,
  getPattern,
  getProject,
  getProjectEvolution,
  getProjectEvolution,
  getProjects,
  getProjectsByStatus,
  getRegistryCounts,
  getTradeoff,
  getTradeoffsByProject,
} from "@/data/registry/store";

vi.mock("@/data/registry/data", () => ({
  registryData: {
    projects: [
      {
        id: "aquaveda-v0",
        name: "AquaVeda",
        summary: "Prototype",
        type: "APPLICATION",
        status: "ARCHIVED",
        version: 0,
        predecessor: null,
        successor: "aquaveda-v1",
      },
      {
        id: "aquaveda-v1",
        name: "AquaVeda",
        summary: "Architecture",
        type: "SYSTEM",
        status: "COMPLETED",
        version: 1,
        predecessor: "aquaveda-v0",
        successor: "aquaveda-v2",
      },
      {
        id: "aquaveda-v2",
        name: "AquaVeda",
        summary: "Production rebuild",
        type: "APPLICATION",
        status: "ACTIVE",
        version: 2,
        predecessor: "aquaveda-v1",
        successor: null,
      },
      {
        id: "devlens",
        name: "DevLens",
        summary: "Diagnostics",
        type: "LIBRARY",
        status: "ACTIVE",
      },
    ],
    constraints: [
      {
        id: "devlens:platform",
        name: "Platform",
        summary: "Editor runtime",
        type: "PLATFORM",
      },
    ],
    tradeoffs: [
      {
        id: "devlens:tradeoff",
        name: "Tradeoff",
        summary: "Test",
        exchange: { gained: "MAINTAINABILITY", sacrificed: "PERFORMANCE" },
      },
    ],
    observations: [
      {
        id: "obs-1",
        type: "runtime_signal",
        primarySubject: { type: "Project", id: "devlens" },
        observer: { type: "ENGINE", id: "test-engine" },
        timestamp: "2026-08-01T00:00:00Z",
        scope: "project:devlens",
      },
    ],
    patterns: [
      {
        id: "pat-01",
        name: "Category Integrity",
        source: "DERIVED",
        strength: 1,
      },
    ],
    discoveries: [],
  },
}));

describe("registry store", () => {
  it("returns canonical project data", () => {
    expect(getProjects()).toHaveLength(4);
    expect(getProject("devlens")?.name).toBe("DevLens");
  });

  it("filters projects by lifecycle status", () => {
    expect(getProjectsByStatus("ACTIVE")).toHaveLength(2);
    expect(getProjectsByStatus("ARCHIVED")).toHaveLength(1);
  });

  it("returns project-scoped constraints, tradeoffs, and observations", () => {
    expect(getConstraintsByProject("devlens")).toHaveLength(1);
    expect(getTradeoffsByProject("devlens")).toHaveLength(1);
    expect(getObservationsByProject("devlens")).toHaveLength(1);
  });

  it("returns undefined for missing nodes", () => {
    expect(getProject("missing")).toBeUndefined();
    expect(getConstraint("missing")).toBeUndefined();
    expect(getTradeoff("missing")).toBeUndefined();
    expect(getObservation("missing")).toBeUndefined();
    expect(getPattern("missing")).toBeUndefined();
    expect(getDiscovery("missing")).toBeUndefined();
  });

  it("traverses the AquaVeda evolution chain without flattening versions", () => {
    expect(getProjectEvolution("aquaveda-v1")).toEqual({
      predecessor: getProject("aquaveda-v0"),
      current: getProject("aquaveda-v1"),
      successor: getProject("aquaveda-v2"),
    });
  });

  it("handles an unknown evolution node honestly", () => {
    expect(getProjectEvolution("missing")).toEqual({});
  });

  it("calculates counts dynamically", () => {
    expect(getRegistryCounts()).toEqual({
      projects: 4,
      constraints: 1,
      tradeoffs: 1,
      observations: 1,
      patterns: 1,
      discoveries: 0,
    });
  });

  it("exposes pattern and discovery collections read-only", () => {
    expect(getPattern("pat-01")?.name).toBe("Category Integrity");
    expect(getDiscoveries()).toEqual([]);
  });
});
