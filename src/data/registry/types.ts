export type RegistryId = string;

export type ProjectType =
  | "APPLICATION"
  | "SYSTEM"
  | "LIBRARY"
  | "EXPERIMENTAL_PLATFORM";

export type ProjectStatus = "ACTIVE" | "DORMANT" | "COMPLETED" | "ARCHIVED";

export type DeploymentPlatform =
  | "RENDER"
  | "VERCEL"
  | "NETLIFY"
  | "SELF_HOSTED"
  | "NONE";

export type DeploymentEnvironment = "PRODUCTION" | "STAGING" | "DEVELOPMENT";

export type RepositoryHost = "GITHUB" | "GITLAB" | "PRIVATE" | "NONE";

export type ProjectLinkType =
  | "DEMO"
  | "DOCUMENTATION"
  | "CASE_STUDY"
  | "WRITEUP"
  | "OTHER";

export interface ProjectDeployment {
  platform: DeploymentPlatform;
  url?: string;
  environment: DeploymentEnvironment;
  serviceType?: "WEB_SERVICE" | "STATIC_SITE" | "BACKGROUND_WORKER";
  region?: string;
  coldStart?: boolean;
  projectId?: string;
  teamId?: string;
  host?: string;
  infrastructure?: string;
}

export interface ProjectRepository {
  host: RepositoryHost;
  owner?: string;
  repo?: string;
  projectId?: string;
  visibilityReason?: string;
}

export interface ProjectLink {
  type: ProjectLinkType;
  url: string;
  label?: string;
}

export interface ProjectMaturity {
  flagship?: boolean;
  recruiter?: boolean;
  engineer?: boolean;
  explorer?: boolean;
}

export interface ProjectRecord {
  id: RegistryId;
  name: string;
  summary: string;
  type: ProjectType;
  uiSurface?: string;
  consumers?: string[];
  apiSurface?: string;
  packageManager?: string;
  investigationScope?: string;
  status: ProjectStatus;
  lastActivityAt?: string;
  dormantSince?: string;
  revivalCondition?: string;
  completedAt?: string;
  archivedAt?: string;
  archiveReason?: string;
  deployment?: ProjectDeployment;
  repository?: ProjectRepository;
  links?: ProjectLink[];
  thesis?: string;
  signal?: string;
  capability?: string;
  engineeringIdentity?: string;
  maturity?: ProjectMaturity;
  technologies?: string[];
  version?: number;
  predecessor?: RegistryId | null;
  successor?: RegistryId | null;
}

export type ConstraintType =
  | "PLATFORM"
  | "TIME"
  | "KNOWLEDGE"
  | "LEGAL"
  | "RESOURCE"
  | "TECHNICAL";

export interface ConstraintRecord {
  id: RegistryId;
  name: string;
  summary: string;
  type: ConstraintType;
  platform?: string;
  deadline?: string;
  skillArea?: string;
  jurisdiction?: string;
  limit?: string;
}

export type TradeoffValueType =
  | "PERFORMANCE"
  | "SIMPLICITY"
  | "COST"
  | "FLEXIBILITY"
  | "MAINTAINABILITY"
  | "RELIABILITY";

export type TradeoffStatus =
  | "ACCEPTED"
  | "REVISITING"
  | "SUPERSEDED"
  | "VALIDATED";

export interface TradeoffExchange {
  gained: TradeoffValueType;
  sacrificed: TradeoffValueType;
}

export interface TradeoffRecord {
  id: RegistryId;
  name: string;
  summary: string;
  rationale?: string;
  exchange: TradeoffExchange;
  status?: TradeoffStatus;
}

export type PatternSource = "AUTHORED" | "DERIVED";

export interface PatternRecord {
  id: RegistryId;
  name: string;
  statement?: string;
  source: PatternSource;
  strength: number;
}

export interface NodeReference {
  type: string;
  id: RegistryId;
}

export type ObservationType = string;
export type ObservationObserverType = "INSPECTOR" | "ENTITY" | "ENGINE";
export type ObservationCollectionMethod =
  | "MANUAL"
  | "TRIGGERED"
  | "AMBIENT"
  | "SYSTEM_AUDIT"
  | "DERIVED";

export interface ObservationObserver {
  type: ObservationObserverType;
  id: RegistryId;
}

export interface ObservationGenerator extends ObservationObserver {
  operation?: string;
}

export interface ObservationProvenance {
  origin: string;
  collectionMethod: ObservationCollectionMethod;
  generatedBy: ObservationGenerator;
}

export interface ObservationRecord {
  id: RegistryId;
  type: ObservationType;
  primarySubject: NodeReference;
  observer: ObservationObserver;
  timestamp: string;
  scope: string;
  provenance?: ObservationProvenance;
  metadata?: Record<string, unknown>;
}

export type DiscoveryStatus = "evolving" | "mature" | "challenged" | "retracted";

export interface DiscoveryRecord {
  id: RegistryId;
  type: string;
  confidence: number;
  status: DiscoveryStatus;
  summary?: string;
  reveals?: RegistryId[];
  supportedBy?: RegistryId[];
  notes?: string;
}

export interface RegistryData {
  projects: readonly ProjectRecord[];
  constraints: readonly ConstraintRecord[];
  tradeoffs: readonly TradeoffRecord[];
  observations: readonly ObservationRecord[];
  patterns: readonly PatternRecord[];
  discoveries: readonly DiscoveryRecord[];
}
