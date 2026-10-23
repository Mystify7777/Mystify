import { describe, expect, it } from "vitest";
import {
  getContinuousOffset,
  getGreetingFocus,
  getGreetingPrefixWidths,
  getVisibleGreetingCount,
} from "@/features/observatory-boot/boot-geometry";

describe("greeting marquee geometry", () => {
  it("precomputes stable prefix widths in one pass", () => {
    expect(getGreetingPrefixWidths([10, 20, 30])).toEqual([0, 10, 30]);
  });

  it("wraps the track offset into the measured cycle", () => {
    expect(getContinuousOffset(95, 1000, 10, 100)).toBe(5);
    expect(getContinuousOffset(4, 1000, 10, 0)).toBe(0);
  });

  it("chooses the closest greeting for focus emphasis across repeated cycles", () => {
    const focus = getGreetingFocus(0, 50, [20, 30], 3);
    expect(focus).toHaveLength(6);
    expect(focus.find((item) => item.index === 1)?.focused).toBe(true);
  });

  it("calculates coverage counts for narrow and wide viewports", () => {
    expect(getVisibleGreetingCount(320, [100])).toBe(4);
    expect(getVisibleGreetingCount(1280, [100])).toBe(13);
  });

  it("does not create focus styles before valid geometry exists", () => {
    expect(getGreetingFocus(0, 320, [])).toEqual([]);
    expect(getGreetingFocus(0, 320, [100, 0])).toEqual([]);
  });
});
