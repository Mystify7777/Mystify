export type ObservatoryMode = "recruiter" | "explorer" | "engineer";

export const MODE_ORDER: readonly ObservatoryMode[] = [
  "recruiter",
  "explorer",
  "engineer",
];

export interface ModeGatewayContent {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly contextLabel: string;
  readonly contextDescription: string;
}

export const MODE_GATEWAY_CONTENT: Record<
  ObservatoryMode,
  ModeGatewayContent
> = {
  recruiter: {
    label: "Recruiter",
    title: "Recruiter",
    description:
      "Evaluate flagship projects, engineering decisions, and demonstrated skills.",
    contextLabel: "Recruiter / Evaluation Lens",
    contextDescription:
      "A curated, high-signal view of the work, decisions, and impact.",
  },
  explorer: {
    label: "Explorer",
    title: "Explorer",
    description:
      "Discover experiments, hidden connections, and project stories.",
    contextLabel: "Explorer / Discovery Lens",
    contextDescription:
      "A connected view of experiments, stories, and the paths between them.",
  },
  engineer: {
    label: "Engineer",
    title: "Engineer",
    description:
      "Inspect architecture, implementation details, and technical trade-offs.",
    contextLabel: "Engineer / Technical Lens",
    contextDescription:
      "A deeper view of architecture, implementation, and the trade-offs behind the system.",
  },
};

export function getNextMode(
  currentMode: ObservatoryMode,
  direction: 1 | -1,
): ObservatoryMode {
  const currentIndex = MODE_ORDER.indexOf(currentMode);
  const nextIndex =
    (currentIndex + direction + MODE_ORDER.length) % MODE_ORDER.length;
  return MODE_ORDER[nextIndex];
}
