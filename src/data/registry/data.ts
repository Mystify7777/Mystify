import type { RegistryData } from "@/data/registry/types";

const projects: RegistryData["projects"] = [
  {
    id: "cybershield",
    name: "CyberShield",
    summary:
      "A security analysis platform focused on explainable trust decisions.",
    type: "APPLICATION",
    uiSurface: "Web application",
    status: "COMPLETED",
    completedAt: "2026-08-01T00:00:00Z",
    deployment: {
      platform: "VERCEL",
      environment: "PRODUCTION",
      url: "https://cybershield.vercel.app",
    },
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "CyberShield" },
    thesis: "Trust decisions should be explainable.",
    engineeringIdentity: "Evidence Aggregation",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    id: "halotask",
    name: "HaloTask Pro",
    summary:
      "A productivity application designed to remain useful through interruption and network failure.",
    type: "APPLICATION",
    uiSurface: "Web application",
    status: "ACTIVE",
    deployment: {
      platform: "VERCEL",
      environment: "PRODUCTION",
      url: "https://halotaskpro.vercel.app",
    },
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "HaloTaskPro" },
    thesis: "Productivity software should survive interruption.",
    engineeringIdentity: "Resilient Execution",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "IndexedDB",
    ],
  },
  {
    id: "stocksphere",
    name: "StockSphere",
    summary:
      "An inventory system centered on explicit business ownership boundaries.",
    type: "SYSTEM",
    consumers: ["Inventory operators", "Business users"],
    status: "COMPLETED",
    deployment: {
      platform: "VERCEL",
      environment: "PRODUCTION",
    },
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "StockSphere" },
    thesis: "Business software succeeds by modeling ownership correctly.",
    engineeringIdentity: "Business Boundaries",
    technologies: ["Java", "Spring Boot", "MySQL", "Docker"],
  },
  {
    id: "aquaveda-v0",
    name: "AquaVeda",
    summary:
      "The preserved SIH prototype that established the original problem space.",
    type: "APPLICATION",
    uiSurface: "Web application",
    status: "ARCHIVED",
    deployment: {
      platform: "VERCEL",
      environment: "PRODUCTION",
      url: "https://aquaveda.vercel.app",
    },
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "AquaVeda" },
    version: 0,
    predecessor: null,
    successor: "aquaveda-v1",
  },
  {
    id: "aquaveda-v1",
    name: "AquaVeda",
    summary:
      "A complete modular architecture following the original prototype.",
    type: "SYSTEM",
    consumers: ["AquaVeda application modules"],
    status: "COMPLETED",
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "AquaVeda" },
    version: 1,
    predecessor: "aquaveda-v0",
    successor: "aquaveda-v2",
  },
  {
    id: "aquaveda-v2",
    name: "AquaVeda",
    summary:
      "A production-oriented Next.js rebuild of AquaVeda in active development.",
    type: "APPLICATION",
    uiSurface: "Next.js application",
    status: "ACTIVE",
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "AquaVeda" },
    version: 2,
    predecessor: "aquaveda-v1",
    successor: null,
  },
  {
    id: "devlens",
    name: "DevLens",
    summary:
      "A developer diagnostics engine designed to make application architecture observable.",
    type: "LIBRARY",
    apiSurface: "Framework-agnostic diagnostics and consumer packages",
    packageManager: "npm",
    status: "ACTIVE",
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "DevLens" },
    thesis: "Architecture should be observable.",
    engineeringIdentity: "Developer Observability",
    technologies: ["TypeScript", "React", "Vitest"],
  },
  {
    id: "mystify",
    name: "Mystify Observatory",
    summary:
      "A portfolio operating system presenting engineering work through controlled perspectives.",
    type: "SYSTEM",
    consumers: ["Recruiter", "Explorer", "Engineer"],
    status: "ACTIVE",
    deployment: {
      platform: "VERCEL",
      environment: "DEVELOPMENT",
    },
    repository: { host: "GITHUB", owner: "Mystify7777", repo: "Mystify" },
    thesis: "Truth exists before presentation.",
    engineeringIdentity: "Ontological Design",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Framer Motion",
    ],
  },
];

const constraints: RegistryData["constraints"] = [];
const tradeoffs: RegistryData["tradeoffs"] = [];

const observations: RegistryData["observations"] = [];

const patterns: RegistryData["patterns"] = [
  {
    id: "pat-01",
    name: "Category Integrity",
    statement:
      "Different kinds of truth must be kept separate so each can remain honest in its own domain.",
    source: "DERIVED",
    strength: 1,
  },
];

const discoveries: RegistryData["discoveries"] = [];

export const registryData: RegistryData = Object.freeze({
  projects: Object.freeze(projects),
  constraints: Object.freeze(constraints),
  tradeoffs: Object.freeze(tradeoffs),
  observations: Object.freeze(observations),
  patterns: Object.freeze(patterns),
  discoveries: Object.freeze(discoveries),
});
