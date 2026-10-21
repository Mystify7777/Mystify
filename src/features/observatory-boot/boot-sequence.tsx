"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getGreetingFocus } from "@/features/observatory-boot/boot-geometry";
import {
  getNextObservatoryBootStage,
  getObservatoryBootDuration,
  registerBootVisitForPageLoad,
  scheduleObservatoryBootTransition,
  shouldOfferBootSkip,
  type ObservatoryBootStage,
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
const GREETING_SPEED_PX_PER_SECOND = 30;

interface ObservatoryBootSequenceProps {
  onComplete: () => void;
}

function IdentityAnimation({
  stage,
  reducedMotion,
}: {
  stage: ObservatoryBootStage;
  reducedMotion: boolean;
}) {
  const initializing = stage === "INITIALIZING";
  const morphing = stage === "MORPHING";
  const tracing = stage === "TRACING" || stage === "GREETING" || stage === "COMPLETE";
  const settled = stage === "GREETING" || stage === "COMPLETE";
  const duration = reducedMotion ? 0.01 : 0.9;
  const insertedLetters = "ystif";

  return (
    <div className="relative flex min-h-[13rem] w-full items-center justify-center sm:min-h-[16rem]">
      <motion.div
        aria-hidden="true"
        className="absolute h-28 w-28 rounded-full border border-observatory-amber/80 sm:h-36 sm:w-36"
        initial={false}
        animate={
          initializing && !reducedMotion
            ? {
                opacity: [0, 0.95, 0.85, 0],
                scale: [0.72, 1, 1.12, 1.42],
                boxShadow: [
                  "0 0 0 rgba(201,146,74,0)",
                  "0 0 14px rgba(201,146,74,.2)",
                  "0 0 30px rgba(201,146,74,.42)",
                  "0 0 44px rgba(201,146,74,0)",
                ],
              }
            : {
                opacity: 0,
                scale: 1.42,
                boxShadow: "0 0 0 rgba(201,146,74,0)",
              }
        }
        transition={{
          duration,
          times: [0, 0.24, 0.58, 1],
          ease: "easeInOut",
        }}
      />

      <div
        className="relative whitespace-nowrap text-6xl italic leading-none tracking-[-0.075em] sm:text-8xl"
        style={{
          fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", cursive',
          fontWeight: 400,
        }}
      >
        <span aria-hidden="true" className="invisible">
          Mystify
        </span>

        <motion.span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: initializing ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.18 }}
          style={{ color: "var(--observatory-amber)" }}
        >
          My
        </motion.span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.25px var(--observatory-amber)",
            filter: "drop-shadow(0 0 10px rgba(201,146,74,.12))",
          }}
        >
          <span>M</span>
          {Array.from(insertedLetters).map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block"
              initial={false}
              animate={{
                opacity: morphing || tracing ? 1 : 0,
                y: morphing && !reducedMotion ? [5, 0] : 0,
                scale: morphing && !reducedMotion ? [0.94, 1] : 1,
              }}
              transition={{
                opacity: {
                  duration: reducedMotion ? 0.01 : 0.24,
                  delay: reducedMotion ? 0 : index * 0.1,
                },
                y: {
                  duration: reducedMotion ? 0.01 : 0.3,
                  delay: reducedMotion ? 0 : index * 0.1,
                  ease: "easeOut",
                },
                scale: {
                  duration: reducedMotion ? 0.01 : 0.3,
                  delay: reducedMotion ? 0 : index * 0.1,
                  ease: "easeOut",
                },
              }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            className="inline-block"
            initial={false}
            animate={{ opacity: morphing || tracing ? 1 : 0 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.24,
              delay: reducedMotion ? 0 : 0.52,
            }}
          >
            y
          </motion.span>
        </span>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: tracing ? (settled ? 0.25 : 0.78) : 0,
            clipPath: tracing ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
          transition={{
            opacity: {
              duration: reducedMotion ? 0.01 : 0.4,
              ease: "easeOut",
            },
            clipPath: {
              duration: reducedMotion ? 0.01 : 1.35,
              ease: "easeInOut",
            },
          }}
          style={{
            color: "var(--observatory-amber)",
            textShadow:
              "0 0 8px rgba(201,146,74,.52), 0 0 22px rgba(201,146,74,.24)",
          }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: 0.28,
              filter: "blur(8px)",
              transform: "translateX(-2px) scale(1.035)",
            }}
          >
            Mystify
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: 0.16,
              filter: "blur(15px)",
              transform: "translateX(3px) scale(1.075)",
            }}
          >
            Mystify
          </span>
          <span
            className="relative"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.25px var(--observatory-amber)",
            }}
          >
            Mystify
          </span>
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{
            duration: reducedMotion ? 0.01 : 0.45,
            delay: reducedMotion ? 0 : 0.18,
            ease: "easeOut",
          }}
          style={{
            color: "transparent",
            WebkitTextStroke: "1.25px var(--observatory-amber)",
            filter: "drop-shadow(0 0 12px rgba(201,146,74,.28))",
          }}
        >
          Mystify
        </motion.span>
      </div>
    </div>
  );
}

function GreetingMarquee({ reducedMotion }: { reducedMotion: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const greetingRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const cycleWidthRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const widthsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const ruler = rulerRef.current;
    if (!viewport || !ruler) return;

    const nextWidths = Array.from(
      ruler.children,
      (child) => (child as HTMLElement).getBoundingClientRect().width,
    );
    const nextCycleWidth = nextWidths.reduce((sum, width) => sum + width, 0);
    const oldCycleWidth = cycleWidthRef.current;

    if (oldCycleWidth > 0 && nextCycleWidth > 0 && oldCycleWidth !== nextCycleWidth) {
      offsetRef.current = (offsetRef.current / oldCycleWidth) * nextCycleWidth;
    }

    widthsRef.current = nextWidths;
    cycleWidthRef.current = nextCycleWidth;
    viewportWidthRef.current = viewport.getBoundingClientRect().width;
  }, []);

  useEffect(() => {
    measure();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (viewportRef.current) observer?.observe(viewportRef.current);
    if (rulerRef.current) observer?.observe(rulerRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (reducedMotion || cycleWidthRef.current <= 0) return;
    let cancelled = false;

    const tick = (timestamp: number) => {
      if (cancelled) return;

      const previous = previousFrameTimeRef.current;
      previousFrameTimeRef.current = timestamp;
      if (previous !== null) {
        const cycleWidth = cycleWidthRef.current;
        const widths = widthsRef.current;
        const viewportWidth = viewportWidthRef.current;

        if (cycleWidth > 0 && trackRef.current) {
          offsetRef.current =
            (offsetRef.current +
              ((timestamp - previous) / 1000) * GREETING_SPEED_PX_PER_SECOND) %
            cycleWidth;
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;

          const focusItems = getGreetingFocus(
            offsetRef.current,
            viewportWidth,
            widths,
            Math.ceil(greetingRefs.current.length / Math.max(widths.length, 1)),
          );
          let nextActiveIndex = 0;
          let nearestDistance = Number.POSITIVE_INFINITY;

          for (const focusItem of focusItems) {
            const element = greetingRefs.current[focusItem.index];
            if (!element) continue;

            const sourceIndex = focusItem.index % GREETINGS.length;
            element.style.opacity = String(focusItem.opacity);
            element.style.transform = `scale(${focusItem.scale})`;
            element.style.fontWeight = focusItem.focused ? "600" : "400";
            element.style.color = focusItem.focused
              ? "var(--observatory-amber)"
              : "var(--observatory-muted)";
            element.style.textShadow = focusItem.focused
              ? "0 0 16px rgba(201,146,74,.22)"
              : "none";

            if (focusItem.distance < nearestDistance) {
              nearestDistance = focusItem.distance;
              nextActiveIndex = sourceIndex;
            }
          }

          if (activeIndexRef.current !== nextActiveIndex) {
            activeIndexRef.current = nextActiveIndex;
            setActiveIndex(nextActiveIndex);
          }
        }
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      previousFrameTimeRef.current = null;
    };
  }, [reducedMotion]);

  const greetingTrack = [...GREETINGS, ...GREETINGS, ...GREETINGS];

  return (
    <div
      ref={viewportRef}
      className="absolute inset-x-0 bottom-8 mx-auto w-full max-w-5xl px-4 sm:bottom-12 sm:px-8"
    >
      <div className="relative overflow-hidden py-3">
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[min(36%,17rem)] -translate-x-1/2"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(11,13,16,.12) 20%, rgba(11,13,16,.18) 50%, rgba(11,13,16,.12) 80%, transparent)",
            maskImage:
              "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)",
          }}
        />

        <div
          ref={trackRef}
          className="flex w-max items-center"
          style={{
            transform: "translate3d(0, 0, 0)",
            willChange: reducedMotion ? "auto" : "transform",
          }}
          aria-hidden="true"
        >
          {greetingTrack.map((greeting, index) => (
            <span
              key={`${greeting}-${index}`}
              ref={(element) => {
                greetingRefs.current[index] = element;
              }}
              className="inline-flex shrink-0 items-center justify-center px-5 font-mono text-xs tracking-[0.14em] sm:px-7 sm:text-sm sm:tracking-[0.18em]"
              style={{
                opacity: 0.3,
                transform: "scale(0.72)",
                color: "var(--observatory-muted)",
                transition: "color 100ms linear, text-shadow 100ms linear",
              }}
            >
              {greeting}
            </span>
          ))}
        </div>

        <div
          ref={rulerRef}
          className="pointer-events-none absolute left-[-9999px] top-0 flex w-max opacity-0"
          aria-hidden="true"
        >
          {GREETINGS.map((greeting) => (
            <span
              key={greeting}
              className="inline-flex shrink-0 items-center justify-center px-5 font-mono text-xs tracking-[0.14em] sm:px-7 sm:text-sm sm:tracking-[0.18em]"
            >
              {greeting}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="off">
        {GREETINGS[activeIndex]}
      </p>
    </div>
  );
}

export function ObservatoryBootSequence({
  onComplete,
}: ObservatoryBootSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const [stage, setStage] = useState<ObservatoryBootStage>("INITIALIZING");
  const [visitCount, setVisitCount] = useState(1);
  const completedRef = useRef(false);
  const completionCallbackRef = useRef(onComplete);

  useEffect(() => {
    completionCallbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setVisitCount(registerBootVisitForPageLoad());
  }, []);

  const completeOnce = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setStage("COMPLETE");
  }, []);

  useEffect(() => {
    if (stage === "COMPLETE") {
      if (!completedRef.current) {
        completedRef.current = true;
        completionCallbackRef.current();
      }
      return;
    }

    if (completedRef.current) return;
    const nextStage = getNextObservatoryBootStage(stage);
    const duration = getObservatoryBootDuration(stage, reducedMotion);
    return scheduleObservatoryBootTransition(() => {
      if (!completedRef.current) setStage(nextStage);
    }, duration);
  }, [reducedMotion, stage]);

  const onSkip = () => {
    if (!shouldOfferBootSkip(visitCount) || completedRef.current) return;
    completeOnce();
  };

  return (
    <section
      aria-label="Observatory initialization"
      className="relative flex min-h-[calc(100vh-2.5rem)] items-center justify-center overflow-hidden px-4 py-12"
    >
      <IdentityAnimation stage={stage} reducedMotion={reducedMotion} />
      <GreetingMarquee reducedMotion={reducedMotion} />
      {shouldOfferBootSkip(visitCount) && stage !== "COMPLETE" ? (
        <button
          type="button"
          onClick={onSkip}
          aria-label="Skip startup animation"
          className="absolute right-5 top-5 z-20 rounded-full border border-observatory-amber/40 px-4 py-2 font-mono text-xs text-observatory-ink transition-colors hover:border-observatory-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-observatory-amber focus-visible:ring-offset-2 focus-visible:ring-offset-observatory-surface"
        >
          Skip intro
        </button>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {stage === "COMPLETE"
          ? "Observatory ready."
          : "Observatory initialization in progress."}
      </p>
    </section>
  );
}
