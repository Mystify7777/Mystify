"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  useObservatoryStore,
  type ObservatoryMode,
} from "@/state/use-observatory-store";

const MODES: readonly ObservatoryMode[] = [
  "recruiter",
  "explorer",
  "engineer",
];

const MODE_LABELS: Record<ObservatoryMode, string> = {
  recruiter: "Recruiter",
  explorer: "Explorer",
  engineer: "Engineer",
};

interface ModeSelectorProps {
  onSelected?: (mode: ObservatoryMode) => void;
}

export function ModeSelector({ onSelected }: ModeSelectorProps) {
  const mode = useObservatoryStore((state) => state.mode);
  const setMode = useObservatoryStore((state) => state.setMode);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectMode = (nextMode: ObservatoryMode) => {
    setMode(nextMode);
    onSelected?.(nextMode);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (index + direction + MODES.length) % MODES.length;
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <section aria-labelledby="mode-selector-heading" className="w-full max-w-3xl">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-observatory-muted">
          Choose your lens
        </p>
        <h1 id="mode-selector-heading" className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          How do you want to explore?
        </h1>
      </div>

      <div
        role="group"
        aria-label="Observatory modes"
        className="grid gap-3 sm:grid-cols-3"
      >
        {MODES.map((candidate, index) => {
          const selected = mode === candidate;

          return (
            <motion.button
              key={candidate}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              type="button"
              aria-pressed={selected}
              className="min-h-32 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition duration-observatory hover:border-observatory-amber/50 hover:bg-observatory-amber/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-observatory-amber focus-visible:ring-offset-2 focus-visible:ring-offset-observatory-surface"
              onClick={() => selectMode(candidate)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-observatory-muted">
                  {candidate}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full border ${
                    selected
                      ? "border-observatory-amber bg-observatory-amber"
                      : "border-observatory-muted/60"
                  }`}
                />
              </span>
              <span className="mt-5 block text-lg font-medium">
                {MODE_LABELS[candidate]}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-observatory-muted">
        Your selection is kept for this session only.
      </p>
    </section>
  );
}
