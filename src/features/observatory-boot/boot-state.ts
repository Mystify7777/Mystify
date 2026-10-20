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
export const BOOT_VISIT_STORAGE_KEY = "mystify-observatory:boot-visits";
export const BOOT_SKIP_MINIMUM_VISITS = 3;

/**
 * Increments the browser-profile page-load count. Storage is best-effort and
 * malformed values are reset. Remove BOOT_VISIT_STORAGE_KEY to reset locally.
 */
export function registerBootVisit(
  storage?: Pick<Storage, "getItem" | "setItem">,
): number {
  try {
    const targetStorage =
      storage ??
      (typeof window !== "undefined" ? window.localStorage : undefined);
    if (!targetStorage) return 1;

    const storedValue = targetStorage.getItem(BOOT_VISIT_STORAGE_KEY);
    const parsed = storedValue === null ? 0 : Number(storedValue);
    const currentCount =
      Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
    const nextCount = Math.min(currentCount + 1, Number.MAX_SAFE_INTEGER);
    targetStorage.setItem(BOOT_VISIT_STORAGE_KEY, String(nextCount));
    return nextCount;
  } catch {
    return 1;
  }
}

export function shouldOfferBootSkip(visitCount: number): boolean {
  return (
    Number.isSafeInteger(visitCount) && visitCount >= BOOT_SKIP_MINIMUM_VISITS
  );
}

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
  const timer = globalThis.setTimeout(callback, delayMs);

  return () => globalThis.clearTimeout(timer);
}
