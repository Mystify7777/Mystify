"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RECRUITER_BOOT_STEPS } from "@/features/recruiter/recruiter-content";

interface RecruiterBootSequenceProps {
  onComplete: () => void;
  stepDurationMs?: number;
}

export function RecruiterBootSequence({
  onComplete,
  stepDurationMs = 550,
}: RecruiterBootSequenceProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= RECRUITER_BOOT_STEPS.length - 1) {
      const completionTimer = window.setTimeout(onComplete, stepDurationMs);
      return () => window.clearTimeout(completionTimer);
    }

    const timer = window.setTimeout(
      () => setStepIndex((current) => current + 1),
      stepDurationMs,
    );

    return () => window.clearTimeout(timer);
  }, [onComplete, stepDurationMs, stepIndex]);

  return (
    <div
      className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center px-4 py-16"
      aria-live="polite"
      aria-label="Recruiter mode boot sequence"
    >
      <div className="w-full max-w-xl text-center">
        <div className="mb-8 flex justify-center gap-2" aria-hidden="true">
          {RECRUITER_BOOT_STEPS.map((step, index) => (
            <span
              key={step}
              className={`h-1.5 w-12 rounded-full transition-opacity duration-300 ${
                index <= stepIndex ? "bg-observatory-amber" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <motion.p
          key={RECRUITER_BOOT_STEPS[stepIndex]}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm text-observatory-muted"
        >
          {RECRUITER_BOOT_STEPS[stepIndex]}
        </motion.p>
        <p className="mt-3 text-xs text-observatory-muted">Recruiter Mode</p>
      </div>
    </div>
  );
}
