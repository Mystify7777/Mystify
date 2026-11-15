import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ModeSelector } from "@/components/modes/mode-selector";
import { useObservatoryStore } from "@/state/use-observatory-store";
import {
  getNextMode,
  MODE_GATEWAY_CONTENT,
  MODE_ORDER,
} from "@/components/modes/mode-gateway";

describe("Observatory gateway mode model", () => {
  it("keeps the approved perspective order", () => {
    expect(MODE_ORDER).toEqual(["recruiter", "explorer", "engineer"]);
  });

  it("provides distinct card and contextual copy for every perspective", () => {
    for (const mode of MODE_ORDER) {
      const content = MODE_GATEWAY_CONTENT[mode];

      expect(content.description).toBeTruthy();
      expect(content.contextLabel).toContain("/");
      expect(content.contextDescription).toBeTruthy();
    }
  });

  it("wraps keyboard navigation around the perspective group", () => {
    expect(getNextMode("recruiter", 1)).toBe("explorer");
    expect(getNextMode("explorer", 1)).toBe("engineer");
    expect(getNextMode("engineer", 1)).toBe("recruiter");
    expect(getNextMode("recruiter", -1)).toBe("engineer");
  });
});


import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ModeSelector } from "@/components/modes/mode-selector";
import { useObservatoryStore } from "@/state/use-observatory-store";

describe("ModeSelector rendered gateway", () => {
  it("renders Recruiter as the default selection without activating a mode", () => {
    useObservatoryStore.getState().clearMode();
    const markup = renderToStaticMarkup(createElement(ModeSelector));

    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('aria-checked="true"');
    expect(markup).toContain("Recruiter / Evaluation Lens");
    expect(markup).toContain("Enter Recruiter");
    expect(useObservatoryStore.getState().mode).toBeNull();
  });

  it("renders all three perspective descriptions and radio states", () => {
    const markup = renderToStaticMarkup(createElement(ModeSelector));

    expect(markup).toContain("Evaluate flagship projects");
    expect(markup).toContain("Discover experiments");
    expect(markup).toContain("Inspect architecture");
    expect(markup).toContain('aria-checked="false"');
    expect(markup).toContain("grid-cols-[4rem_minmax(0,1fr)_1rem]");
  });
});
