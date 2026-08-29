"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  type ObservatoryBootStage,
  getNextObservatoryBootStage,
  getObservatoryBootDuration,
  scheduleObservatoryBootTransition,
} from "@/features/observatory-boot/boot-state";

const GREETINGS = [
  "HELLO",
  "नमस्ते",
  "BONJOUR",
  "HOLA",
  "こんにちは",
  "你好",
] as const;

interface ObservatoryBootSequenceProps {
  onComplete: () => void;
}

function StageStatus({ stage }: { stage: ObservatoryBootStage }) {
  const labels: Record<Exclude<ObservatoryBootStage, "COMPLETE">, string> = {
    INITIALIZING: "INITIALIZING",
    MORPHING: "MYSTIFY LOADER",
    TRACING: "TRACE GLOW",
    GREETING: "MULTILINGUAL GREETING",
  };

  if (stage === "COMPLETE") return null;

  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-observatory-muted sm:text-xs">
      {labels[stage]}
    </p>
  );
}

export function ObservatoryBootSequence({
  onComplete,
}: ObservatoryBootSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<ObservatoryBootStage>("INITIALIZING");
  const completedRef = useRef(false);

  useEffect(() => {
    if (stage === "COMPLETE") {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }

      return;
    }

    const nextStage = getNextObservatoryBootStage(stage);
    const duration = getObservatoryBootDuration(
      stage,
      Boolean(prefersReducedMotion),
    );

    return scheduleObservatoryBootTransition(
      () => setStage(nextStage),
      duration,
    );
  }, [onComplete, prefersReducedMotion, stage]);

  return (
    <section
      aria-label="Observatory initialization"
      className="relative flex min-h-[calc(100vh-2.5rem)] items-center justify-center overflow-hidden px-4 py-12"
    >
      <div
        className="pointer-events-none absolute inset-x-6 bottom-8 border-t border-observatory-amber/20"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center text-center">
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex min-h-[12rem] w-full items-center justify-center sm:min-h-[15rem]"
        >
          {stage === "INITIALIZING" ? (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.45 }}
              className="relative flex h-28 w-28 items-center justify-center border border-observatory-amber/45 sm:h-36 sm:w-36"
            >
              <span className="font-mono text-4xl font-light tracking-[-0.16em] text-observatory-amber sm:text-5xl">
                My
              </span>
              <span
                className="absolute bottom-4 left-4 right-4 h-px bg-observatory-amber/70"
                aria-hidden="true"
              />
            </motion.div>
          ) : stage === "MORPHING" ? (
            <motion.div
              key="mystify-loader"
              initial={{ opacity: 0, scaleX: 0.82 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.12 : 0.7,
                ease: "easeOut",
              }}
            >
              <p className="font-serif text-5xl italic tracking-[-0.06em] text-observatory-amber sm:text-7xl">
                Mystify
              </p>
              <div
                className="mx-auto mt-5 h-px w-28 bg-observatory-amber/55"
                aria-hidden="true"
              />
            </motion.div>
          ) : stage === "TRACING" ? (
            <div className="relative">
              <p className="font-serif text-5xl italic tracking-[-0.06em] text-observatory-ink sm:text-7xl">
                Mystify
              </p>
              <motion.span
                aria-hidden="true"
                className="absolute bottom-1 right-0 h-px bg-observatory-amber"
                initial={{ width: "0%", opacity: 0.45 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0.12 : 1.1,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "right center" }}
              />
            </div>
          ) : stage === "GREETING" ? (
            <motion.div
              key="greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.35 }}
              className="w-full overflow-hidden border-y border-observatory-amber/20 py-6"
            >
              <div
                className={
                  prefersReducedMotion
                    ? "flex justify-center gap-8 font-mono text-sm tracking-[0.22em] text-observatory-amber"
                    : "flex w-max animate-[observatory-marquee_7s_linear_infinite] gap-12 font-mono text-sm tracking-[0.22em] text-observatory-amber"
                }
              >
                {[...GREETINGS, ...GREETINGS].map((greeting, index) => (
                  <span key={`${greeting}-${index}`}>{greeting}</span>
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>

        <StageStatus stage={stage} />

        <div className="mt-10 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-observatory-muted sm:text-xs">
          <span>MY / OBSERVATORY</span>
          <span>{stage}</span>
        </div>
      </div>
    </section>
  );
}
