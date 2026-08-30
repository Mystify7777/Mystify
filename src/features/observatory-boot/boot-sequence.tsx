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
  "CIAO",
] as const;

const VISIBLE_GREETING_COUNT = 5;
const ACTIVE_GREETING_INDEX = Math.floor(VISIBLE_GREETING_COUNT / 2);
const GREETING_SLIDE_SECONDS = 0.8;
const GREETING_DWELL_SECONDS = 0.3;

interface ObservatoryBootSequenceProps {
  onComplete: () => void;
}

function getGreetingWindow(offset: number) {
  return Array.from({ length: VISIBLE_GREETING_COUNT + 2 }, (_, index) => {
    const greetingIndex =
      (offset + index - 1 + GREETINGS.length) % GREETINGS.length;

    return {
      id: offset + index - 1,
      greeting: GREETINGS[greetingIndex],
    };
  });
}

type GreetingMotionPhase = "SLIDING" | "DWELL";

export function ObservatoryBootSequence({
  onComplete,
}: ObservatoryBootSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<ObservatoryBootStage>("INITIALIZING");
  const [greetingOffset, setGreetingOffset] = useState(0);
  const [greetingPhase, setGreetingPhase] =
    useState<GreetingMotionPhase>("SLIDING");
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

  const visibleGreetings = getGreetingWindow(greetingOffset);

  return (
    <section
      aria-label="Observatory initialization"
      className="relative flex min-h-[calc(100vh-2.5rem)] items-center justify-center overflow-hidden px-4 py-12"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-10 overflow-hidden sm:bottom-14"
        aria-hidden="true"
      >
        <div className="mx-auto max-w-5xl overflow-hidden px-4">
          <motion.div
            animate={{
              x:
                prefersReducedMotion || greetingPhase === "DWELL"
                  ? "0%"
                  : "-20%",
            }}
            initial={false}
            transition={{
              duration: prefersReducedMotion ? 0 : GREETING_SLIDE_SECONDS,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              if (prefersReducedMotion || greetingPhase !== "SLIDING") {
                return;
              }

              setGreetingPhase("DWELL");
            }}
            className="grid grid-cols-7 items-center font-mono"
            style={{ width: "140%" }}
          >
            {visibleGreetings.map(({ greeting, id }, index) => {
              const visibleIndex = index - 1;
              const distanceFromCenter = Math.abs(
                visibleIndex - ACTIVE_GREETING_INDEX,
              );
              const isActive =
                visibleIndex === ACTIVE_GREETING_INDEX;

              const baseScale =
                distanceFromCenter === 0
                  ? 1.25
                  : distanceFromCenter === 1
                    ? 0.85
                    : 0.7;

              const opacity =
                distanceFromCenter === 0
                  ? 1
                  : distanceFromCenter === 1
                    ? 0.7
                    : 0.4;

              return (
                <motion.span
                  key={id}
                  animate={
                    isActive && greetingPhase === "DWELL" && !prefersReducedMotion
                      ? { scale: [1.25, 1.35, 1.25] }
                      : { scale: baseScale }
                  }
                  transition={{
                    duration:
                      isActive && greetingPhase === "DWELL"
                        ? GREETING_DWELL_SECONDS
                        : prefersReducedMotion
                          ? 0
                          : GREETING_SLIDE_SECONDS,
                    ease: "easeInOut",
                  }}
                  onAnimationComplete={() => {
                    if (
                      !isActive ||
                      greetingPhase !== "DWELL" ||
                      prefersReducedMotion
                    ) {
                      return;
                    }

                    setGreetingOffset((currentOffset) => currentOffset + 1);
                    setGreetingPhase("SLIDING");
                  }}
                  style={{ opacity }}
                  className={
                    isActive
                      ? "whitespace-nowrap text-center text-sm font-semibold tracking-[0.18em] text-observatory-amber sm:text-base"
                      : "whitespace-nowrap text-center text-[10px] tracking-[0.16em] text-observatory-muted sm:text-xs"
                  }
                >
                  {greeting}
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="relative flex w-full max-w-5xl flex-col items-center text-center">
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="relative z-10 flex min-h-[12rem] w-full items-center justify-center sm:min-h-[15rem]"
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
              key="greeting-handoff"
              initial={{ opacity: 0.65 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.12 : 0.35 }}
              className="font-serif text-5xl italic tracking-[-0.06em] text-observatory-ink sm:text-7xl"
            >
              Mystify
            </motion.div>
          ) : null}
        </div>

        <p className="sr-only">Observatory initialization in progress.</p>
      </div>
    </section>
  );
}
