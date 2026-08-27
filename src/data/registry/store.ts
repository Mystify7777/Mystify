import { registryData } from "@/data/registry/data";
import type {
  ConstraintRecord,
  DiscoveryRecord,
  ObservationRecord,
  PatternRecord,
  ProjectRecord,
  RegistryData,
  RegistryId,
  TradeoffRecord,
} from "@/data/registry/types";

const byId = <T extends { id: RegistryId }>(items: readonly T[]) =>
  new Map(items.map((item) => [item.id, item]));

const projectMap = byId(registryData.projects);
const constraintMap = byId(registryData.constraints);
const tradeoffMap = byId(registryData.tradeoffs);
const observationMap = byId(registryData.observations);
const patternMap = byId(registryData.patterns);
const discoveryMap = byId(registryData.discoveries);

export interface RegistryCounts {
  projects: number;
  constraints: number;
  tradeoffs: number;
  observations: number;
  patterns: number;
  discoveries: number;
}

export function getRegistryData(): RegistryData {
  return registryData;
}

export function getRegistryCounts(): RegistryCounts {
  return {
    projects: registryData.projects.length,
    constraints: registryData.constraints.length,
    tradeoffs: registryData.tradeoffs.length,
    observations: registryData.observations.length,
    patterns: registryData.patterns.length,
    discoveries: registryData.discoveries.length,
  };
}

export function getProject(id: RegistryId): ProjectRecord | undefined {
  return projectMap.get(id);
}

export function getProjects(): readonly ProjectRecord[] {
  return registryData.projects;
}

export function getProjectsByStatus(
  status: ProjectRecord["status"],
): readonly ProjectRecord[] {
  return registryData.projects.filter((project) => project.status === status);
}

export function getConstraint(id: RegistryId): ConstraintRecord | undefined {
  return constraintMap.get(id);
}

export function getConstraintsByProject(
  projectId: RegistryId,
): readonly ConstraintRecord[] {
  return registryData.constraints.filter((constraint) =>
    constraint.id.startsWith(`${projectId}:`),
  );
}

export function getTradeoff(id: RegistryId): TradeoffRecord | undefined {
  return tradeoffMap.get(id);
}

export function getTradeoffsByProject(
  projectId: RegistryId,
): readonly TradeoffRecord[] {
  return registryData.tradeoffs.filter((tradeoff) =>
    tradeoff.id.startsWith(`${projectId}:`),
  );
}

export function getObservation(id: RegistryId): ObservationRecord | undefined {
  return observationMap.get(id);
}

export function getObservationsByProject(
  projectId: RegistryId,
): readonly ObservationRecord[] {
  return registryData.observations.filter(
    (observation) => observation.primarySubject.id === projectId,
  );
}

export function getPattern(id: RegistryId): PatternRecord | undefined {
  return patternMap.get(id);
}

export function getPatterns(): readonly PatternRecord[] {
  return registryData.patterns;
}

export function getDiscovery(id: RegistryId): DiscoveryRecord | undefined {
  return discoveryMap.get(id);
}

export function getDiscoveries(): readonly DiscoveryRecord[] {
  return registryData.discoveries;
}

export function getProjectEvolution(projectId: RegistryId): {
  predecessor?: ProjectRecord;
  current?: ProjectRecord;
  successor?: ProjectRecord;
} {
  const current = getProject(projectId);
  if (!current) return {};

  return {
    predecessor: current.predecessor
      ? getProject(current.predecessor)
      : undefined,
    current,
    successor: current.successor ? getProject(current.successor) : undefined,
  };
}
