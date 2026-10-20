"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  getNextObservatoryBootStage,
  getObservatoryBootDuration,
  registerBootVisit,
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
  const expanded = stage !== "INITIALIZING";
  const tracing = stage !== "INITIALIZING";
  const finishTrace =
    stage === "TRACING" || stage === "GREETING" || stage === "COMPLETE";

  return (
    <div
      className="relative flex min-h-[13rem] w-full items-center justify-center sm:min-h-[16rem]"
    >
      <motion.div
        aria-hidden="true"
        className="absolute h-28 w-28 rounded-full border border-observatory-amber/70 sm:h-36 sm:w-36"
        initial={false}
        animate={{ opacity: expanded ? 0 : 1, scale: expanded ? 1.45 : 1 }}
        transition={{
          duration: reducedMotion ? 0.01 : 1.25,
          ease: "easeInOut",
        }}
        style={{
          animation: reducedMotion
            ? undefined
            : "observatory-circle-rest 1.8s ease-in-out infinite alternate",
        }}
      />

      <div
        className="relative whitespace-nowrap font-serif text-5xl italic tracking-[-0.06em] sm:text-7xl"
      >
        <span aria-hidden="true" className="invisible">
          Mystify
        </span>

        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center text-observatory-amber"
          style={{ opacity: expanded ? 0 : 1 }}
        >
          My
        </span>

        <motion.span
          aria-hidden="true"
          className="absolute inset-0 text-observatory-amber"
          initial={false}
          animate={{
            opacity: expanded ? 1 : 0,
            clipPath: expanded ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
          transition={{
            duration: reducedMotion ? 0.01 : 1.6,
            ease: "easeInOut",
          }}
        >
          Mystify
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-observatory-amber"
          initial={false}
          animate={{
            opacity: tracing ? 0.35 : 0,
            clipPath: tracing ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
          transition={{
            duration: reducedMotion ? 0.01 : 1.2,
            ease: "linear",
          }}
          style={{
            filter: "blur(7px)",
            transform: "scale(1.045)",
          }}
        >
          Mystify
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-observatory-ink"
          initial={false}
          animate={{
            opacity: finishTrace ? 1 : 0,
            clipPath: finishTrace ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
          transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: "linear" }}
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

    const nextWidths = Array.from(ruler.children, (child) =>
      (child as HTMLElement).getBoundingClientRect().width,
    );
    const nextCycleWidth = nextWidths.reduce((sum, width) => sum + width, 0);
    const oldCycleWidth = cycleWidthRef.current;

    if (
      oldCycleWidth > 0 &&
      nextCycleWidth > 0 &&
      oldCycleWidth !== nextCycleWidth
    ) {
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
              ((timestamp - previous) / 1000) *
                GREETING_SPEED_PX_PER_SECOND) %
            cycleWidth;
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;

          const focusCenter = offsetRef.current + viewportWidth / 2;
          let nextActiveIndex = 0;
          let nearestDistance = Number.POSITIVE_INFINITY;
          const repeatedCount = greetingRefs.current.length;
          const prefixWidths = widths.map((_, index) =>
            widths
              .slice(0, index)
              .reduce((sum, width) => sum + width, 0),
          );

          for (let index = 0; index < repeatedCount; index += 1) {
            const element = greetingRefs.current[index];
            if (!element) continue;

            const sourceIndex = index % GREETINGS.length;
            const width =
              widths[sourceIndex] ?? element.getBoundingClientRect().width;
            const itemCenter =
              Math.floor(index / GREETINGS.length) * cycleWidth +
              (prefixWidths[sourceIndex] ?? 0) +
              width / 2;
            const distance = Math.abs(
              ((((focusCenter - itemCenter + cycleWidth / 2) % cycleWidth) +
                cycleWidth) %
                cycleWidth) -
                cycleWidth / 2,
            );
            const nearestCycleDistance = distance;
            const normalizedDistance =
              nearestCycleDistance / Math.max(width / 2, 1);
            const isFocused = normalizedDistance <= 1;
            const scale = isFocused
              ? 1.12
              : normalizedDistance < 2
                ? 0.94
                : normalizedDistance < 4
                  ? 0.82
                  : 0.72;
            const opacity = isFocused
              ? 1
              : normalizedDistance < 2
                ? 0.72
                : normalizedDistance < 4
                  ? 0.48
                  : 0.3;

            element.style.opacity = String(opacity);
            element.style.transform = `scale(${scale})`;
            element.style.fontWeight = isFocused ? "600" : "400";
            element.style.color = isFocused
              ? "var(--observatory-amber)"
              : "var(--observatory-muted)";
            element.style.textShadow = isFocused
              ? "0 0 16px rgba(201,146,74,.22)"
              : "none";

            if (nearestCycleDistance < nearestDistance) {
              nearestDistance = nearestCycleDistance;
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
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
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
              "linear-gradient(90deg, transparent, rgba(11,13,16,.30) 12%, rgba(11,13,16,.58) 50%, rgba(11,13,16,.30) 88%, transparent)",
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
  const completionRequestedRef = useRef(false);
  const completionCallbackRef = useRef(onComplete);

  useEffect(() => {
    completionCallbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setVisitCount(registerBootVisit());
  }, []);

  const completeOnce = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    completionCallbackRef.current();
    setStage("COMPLETE");
  }, []);

  useEffect(() => {
    if (stage === "COMPLETE" || completedRef.current) return;
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

  const wordmarkStage =
    stage === "INITIALIZING" || stage === "MORPHING" ? stage : "TRACING";

  return (
    <section
      aria-label="Observatory initialization"
      className="relative flex min-h-[calc(100vh-2.5rem)] items-center justify-center overflow-hidden px-4 py-12"
    >
      <IdentityAnimation stage={wordmarkStage} reducedMotion={reducedMotion} />
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
