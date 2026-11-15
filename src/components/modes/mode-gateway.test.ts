import { describe, expect, it } from "vitest";
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
