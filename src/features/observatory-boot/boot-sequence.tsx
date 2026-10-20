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
  const tracing = stage === "TRACING" || stage === "GREETING" || stage === "COMPLETE";

  return (
    <div className="relative flex min-h-[13rem] w-full items-center justify-center sm:min-h-[16rem]">
      <motion.div
        aria-hidden="true"
        className="absolute h-28 w-28 rounded-full border border-observatory-amber/70 sm:h-36 sm:w-36"
        initial={false}
        animate={{ opacity: expanded ? 0 : 1, scale: expanded ? 1.45 : 1 }}
        transition={{ duration: reducedMotion ? 0.01 : 0.85, ease: "easeInOut" }}
        style={{ animation: reducedMotion ? undefined : "observatory-circle-rest 1.8s ease-in-out infinite alternate" }}
      />

      <div className="relative flex items-center justify-center">
        <motion.span
          aria-hidden="true"
          className="absolute whitespace-nowrap font-serif text-5xl italic tracking-[-0.06em] text-observatory-amber sm:text-7xl"
          initial={false}
          animate={{ opacity: tracing ? 0.32 : 0, clipPath: tracing ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
          transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: "linear" }}
          style={{ filter: "blur(7px)", transform: "scale(1.045)" }}
        >
          Mystify
        </motion.span>

        <div className="relative whitespace-nowrap font-serif text-5xl italic tracking-[-0.06em] sm:text-7xl">
          <span
            aria-hidden="true"
            className="text-observatory-amber"
            style={{ opacity: expanded ? 0 : 1, position: expanded ? "absolute" : "relative" }}
          >
            My
          </span>
          <motion.span
            className="text-observatory-amber"
            initial={false}
            animate={{
              opacity: expanded ? 1 : 0,
              clipPath: expanded ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
            }}
            transition={{ duration: reducedMotion ? 0.01 : 1.2, ease: "easeInOut" }}
            style={{ position: expanded ? "relative" : "absolute", left: 0 }}
          >
            Mystify
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 whitespace-nowrap text-observatory-ink"
            initial={false}
            animate={{
              opacity: tracing ? 1 : 0,
              clipPath: tracing ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            }}
            transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: "easeInOut" }}
          >
            Mystify
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function GreetingMarquee({ reducedMotion }: { reducedMotion: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const frameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const cycleWidthRef = useRef(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const ruler = rulerRef.current;
    if (!viewport || !ruler) return;

    const nextWidths = Array.from(ruler.children, (child) =>
      (child as HTMLElement).getBoundingClientRect().width,
    );
    cycleWidthRef.current = nextWidths.reduce((sum, width) => sum + width, 0);
    setWidths((current) =>
      current.length === nextWidths.length &&
      current.every((width, index) => Math.abs(width - nextWidths[index]) < 0.25)
        ? current
        : nextWidths,
    );
    setViewportWidth(viewport.getBoundingClientRect().width);
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
    const pixelsPerSecond = 30;

    const tick = (timestamp: number) => {
      if (cancelled) return;
      const previous = previousFrameTimeRef.current;
      previousFrameTimeRef.current = timestamp;
      if (previous !== null) {
        const cycleWidth = cycleWidthRef.current;
        if (cycleWidth > 0) {
          offsetRef.current = (offsetRef.current + ((timestamp - previous) / 1000) * pixelsPerSecond) % cycleWidth;
          setOffset(offsetRef.current);
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
  }, [reducedMotion, viewportWidth, widths]);

  const cycleWidth = widths.reduce((sum, width) => sum + width, 0);
  const focusPosition = (offset + viewportWidth / 2) % (cycleWidth || 1);
  let cursor = 0;
  let activeIndex = 0;
  for (let index = 0; index < widths.length; index += 1) {
    const nextCursor = cursor + widths[index];
    if (focusPosition >= cursor && focusPosition < nextCursor) {
      activeIndex = index;
      break;
    }
    cursor = nextCursor;
  }

  const greetingsTrack = [...GREETINGS, ...GREETINGS, ...GREETINGS];

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
          className="flex w-max items-center"
          style={{
            transform: reducedMotion ? "translateX(0)" : `translate3d(-${offset}px, 0, 0)`,
            willChange: reducedMotion ? "auto" : "transform",
          }}
          aria-hidden="true"
        >
          {greetingsTrack.map((greeting, index) => {
            const sourceIndex = index % GREETINGS.length;
            const itemLeft = Math.floor(index / GREETINGS.length) * cycleWidth +
              widths.slice(0, sourceIndex).reduce((sum, width) => sum + width, 0);
            const itemCenter = itemLeft + (widths[sourceIndex] ?? 0) / 2;
            const focusCenter = offset + viewportWidth / 2;
            const directDistance = Math.abs(itemCenter - focusCenter);
            const distance = cycleWidth > 0
              ? Math.min(directDistance, Math.abs(directDistance - cycleWidth), Math.abs(directDistance + cycleWidth))
              : directDistance;
            const normalizedDistance = distance / Math.max((widths[sourceIndex] ?? 1) / 2, 1);
            const focused = normalizedDistance <= 1;
            const scale = focused ? 1.12 : normalizedDistance < 2 ? 0.94 : normalizedDistance < 4 ? 0.82 : 0.72;
            const opacity = focused ? 1 : normalizedDistance < 2 ? 0.72 : normalizedDistance < 4 ? 0.48 : 0.3;

            return (
              <span
                key={`${greeting}-${index}`}
                className="inline-flex shrink-0 items-center justify-center px-5 font-mono text-xs tracking-[0.14em] sm:px-7 sm:text-sm sm:tracking-[0.18em]"
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  fontWeight: focused ? 600 : 400,
                  color: focused ? "var(--observatory-amber)" : "var(--observatory-muted)",
                  textShadow: focused ? "0 0 16px rgba(201,146,74,.22)" : "none",
                }}
              >
                {greeting}
              </span>
            );
          })}
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
      <p className="sr-only" aria-live="off">{GREETINGS[activeIndex] ?? GREETINGS[0]}</p>
    </div>
  );
}

export function ObservatoryBootSequence({ onComplete }: ObservatoryBootSequenceProps) {
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
