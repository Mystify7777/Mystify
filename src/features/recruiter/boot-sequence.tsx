"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRegistryCounts } from "@/data/registry/store";
import {
  getRecruiterBootSteps,
  scheduleRecruiterBootStep,
} from "@/features/recruiter/recruiter-content";

interface RecruiterBootSequenceProps {
  onComplete: () => void;
  stepDurationMs?: number;
}

const DEFAULT_STEP_DURATION_MS = 900;

export function RecruiterBootSequence({
  onComplete,
  stepDurationMs = DEFAULT_STEP_DURATION_MS,
}: RecruiterBootSequenceProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = getRecruiterBootSteps(getRegistryCounts());

  useEffect(() => {
    if (stepIndex >= steps.length - 1) {
      return scheduleRecruiterBootStep(onComplete, stepDurationMs);
    }

    return scheduleRecruiterBootStep(
      () => setStepIndex((current) => current + 1),
      stepDurationMs,
    );
  }, [onComplete, stepDurationMs, stepIndex, steps.length]);

  return (
    <div
      className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center px-4 py-16"
      aria-label="Recruiter mode boot sequence"
    >
      <div className="w-full max-w-xl text-center">
        <div className="mb-8 flex justify-center gap-2" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`h-1.5 w-12 rounded-full transition-opacity duration-300 ${
                index <= stepIndex ? "bg-observatory-amber" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <motion.p
            key={steps[stepIndex]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-sm text-observatory-muted"
          >
            {steps[stepIndex]}
          </motion.p>
        </div>
        <p className="mt-3 text-xs text-observatory-muted">Recruiter Mode</p>
      </div>
    </div>
  );
}
