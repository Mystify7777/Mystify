export interface GreetingFocus {
  index: number;
  distance: number;
  normalizedDistance: number;
  scale: number;
  opacity: number;
  focused: boolean;
}

export function getGreetingPrefixWidths(widths: readonly number[]): number[] {
  const prefixes: number[] = [];
  let total = 0;
  for (const width of widths) {
    prefixes.push(total);
    total += width;
  }
  return prefixes;
}

export function getContinuousOffset(
  offset: number,
  deltaMs: number,
  speedPxPerSecond: number,
  cycleWidth: number,
): number {
  if (!Number.isFinite(cycleWidth) || cycleWidth <= 0) return 0;
  const advance = (Math.max(0, deltaMs) / 1000) * speedPxPerSecond;
  return (((offset + advance) % cycleWidth) + cycleWidth) % cycleWidth;
}

export function getGreetingFocus(
  offset: number,
  viewportWidth: number,
  widths: readonly number[],
  repetitionCount = 3,
): GreetingFocus[] {
  if (
    widths.length === 0 ||
    widths.some((width) => !Number.isFinite(width) || width <= 0)
  ) {
    return [];
  }

  const prefixes = getGreetingPrefixWidths(widths);
  const cycleWidth = widths.reduce((sum, width) => sum + width, 0);
  const focusCenter = offset + viewportWidth / 2;
  const result: GreetingFocus[] = [];

  for (
    let repeatedIndex = 0;
    repeatedIndex < widths.length * repetitionCount;
    repeatedIndex += 1
  ) {
    const index = repeatedIndex % widths.length;
    const width = widths[index];
    const itemCenter =
      Math.floor(repeatedIndex / widths.length) * cycleWidth +
      prefixes[index] +
      width / 2;
    const rawDistance = Math.abs(focusCenter - itemCenter);
    const distance = Math.min(
      rawDistance,
      Math.abs(rawDistance - cycleWidth),
      Math.abs(rawDistance + cycleWidth),
    );
    const normalizedDistance = distance / Math.max(width / 2, 1);
    const focused = normalizedDistance <= 1;

    result.push({
      index: repeatedIndex,
      distance,
      normalizedDistance,
      focused,
      scale: focused
        ? 1.12
        : normalizedDistance < 2
          ? 0.94
          : normalizedDistance < 4
            ? 0.82
            : 0.72,
      opacity: focused
        ? 1
        : normalizedDistance < 2
          ? 0.72
          : normalizedDistance < 4
            ? 0.48
            : 0.3,
    });
  }

  return result;
}

export function getVisibleGreetingCount(
  viewportWidth: number,
  widths: readonly number[],
): number {
  if (
    viewportWidth <= 0 ||
    widths.length === 0 ||
    widths.some((width) => !Number.isFinite(width) || width <= 0)
  ) {
    return 0;
  }

  let visible = 0;
  let used = 0;
  while (used < viewportWidth) {
    used += widths[visible % widths.length];
    visible += 1;
    if (visible > 10000) break;
  }
  return visible;
}
