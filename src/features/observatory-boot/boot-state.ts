export const OBSERVATORY_BOOT_STAGES = [
  "INITIALIZING",
  "MORPHING",
  "TRACING",
  "GREETING",
  "COMPLETE",
] as const;

export type ObservatoryBootStage = (typeof OBSERVATORY_BOOT_STAGES)[number];

export const OBSERVATORY_BOOT_STAGE_DURATIONS: Record<
  ObservatoryBootStage,
  number
> = {
  INITIALIZING: 900,
  MORPHING: 1100,
  TRACING: 1400,
  GREETING: 1800,
  COMPLETE: 0,
};

const REDUCED_MOTION_STAGE_DURATION_MS = 180;

export function getNextObservatoryBootStage(
  stage: ObservatoryBootStage,
): ObservatoryBootStage {
  const index = OBSERVATORY_BOOT_STAGES.indexOf(stage);

  if (index === -1 || index === OBSERVATORY_BOOT_STAGES.length - 1) {
    return "COMPLETE";
  }

  return OBSERVATORY_BOOT_STAGES[index + 1];
}

export function getObservatoryBootDuration(
  stage: ObservatoryBootStage,
  reducedMotion: boolean,
): number {
  if (stage === "COMPLETE") return 0;

  return reducedMotion
    ? REDUCED_MOTION_STAGE_DURATION_MS
    : OBSERVATORY_BOOT_STAGE_DURATIONS[stage];
}

export function scheduleObservatoryBootTransition(
  callback: () => void,
  delayMs: number,
): () => void {
  const timer = window.setTimeout(callback, delayMs);

  return () => window.clearTimeout(timer);
}
