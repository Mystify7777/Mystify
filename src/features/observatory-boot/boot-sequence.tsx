"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BOOT_VISIT_STORAGE_KEY,
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

const FULL_WORDMARK_DURATION_MS = 2_850;

function useBootVisitCount() {
  const [visitCount, setVisitCount] = useState(1);

  useEffect(() => {
    setVisitCount(registerBootVisit());
  }, []);

  return visitCount;
}

function IdentityAnimation({
  stage,
  reducedMotion,
}: {
  stage: ObservatoryBootStage;
  reducedMotion: boolean;
}) {
  const tracing = stage === "TRACING" || stage === "GREETING" || stage === "COMPLETE";
  const expanded = stage !== "INITIALIZING";
  const finished = stage === "GREETING" || stage === "COMPLETE";

  return (
    <div className="relative flex min-h-[13rem] w-full items-center justify-center sm:min-h-[16rem]">
      <motion.div
        aria-hidden="true"
        className="absolute flex h-28 w-28 items-center justify-center rounded-full border border-observatory-amber/70 sm:h-36 sm:w-36"
        initial={false}
        animate={{
          opacity: expanded ? 0 : 1,
          scale: expanded ? 1.45 : 1,
        }}
        transition={{ duration: reducedMotion ? 0.01 : 0.85, ease: "easeInOut" }}
        style={{ animation: reducedMotion ? undefined : "observatory-circle-rest 1.8s ease-in-out infinite alternate" }}
      >
        <span className="sr-only">Mystify</span>
      </motion.div>

      <div className="relative flex items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute whitespace-nowrap font-serif text-5xl italic tracking-[-0.06em] text-observatory-amber sm:text-7xl"
          style={{
            opacity: tracing ? 0 : 0.82,
            filter: "blur(8px)",
            transform: "scale(1.045)",
            clipPath: "inset(0 0 0 0)",
          }}
        >
          Mystify
        </span>

        <motion.span
          aria-hidden="true"
          className="absolute whitespace-nowrap font-serif text-5xl italic tracking-[-0.06em] text-observatory-amber sm:text-7xl"
          initial={false}
          animate={{ opacity: tracing ? 0.28 : 0, clipPath: tracing ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
          transition={{ duration: reducedMotion ? 0.01 : 1.1, ease: "linear" }}
          style={{ filter: "blur(8px)", transform: "scale(1.045)" }}
        >
          Mystify
        </motion.span>

        <div className="relative whitespace-nowrap font-serif text-5xl italic tracking-[-0.06em] sm:text-7xl">
          <span
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
            <span className="sr-only">Mystify</span>
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
          {finished ? (
            <span className="sr-only">Startup identity initialized.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GreetingMarquee({ reducedMotion }: { reducedMotion: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [measurements, setMeasurements] = useState<number[]>([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const animationRef = useRef<number | null>(null);
  const cycleStartRef = useRef<number | null>(null);
  const cycleWidthRef = useRef(0);
  const trackWidthRef = useRef(0);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const ruler = rulerRef.current;
    if (!viewport || !ruler) return;

    const nextMeasurements = Array.from(ruler.children).map((child) =>
      (child as HTMLElement).getBoundingClientRect().width,
    );
    setMeasurements(nextMeasurements);
    setViewportWidth(viewport.getBoundingClientRect().width);
    cycleWidthRef.current = nextMeasurements.reduce((sum, width) => sum + width, 0);
  }, []);

  useEffect(() => {
    measure();
    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(measure);
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
    const pixelsPerSecond = 34;

    const tick = (timestamp: number) => {
      if (cancelled) return;
      if (cycleStartRef.current === null) cycleStartRef.current = timestamp;
      const cycleWidth = cycleWidthRef.current;
      if (cycleWidth > 0) {
        const elapsed = (timestamp - cycleStartRef.current) / 1000;
        const nextOffset = (elapsed * pixelsPerSecond) % cycleWidth;
        setOffset(nextOffset);
      }
      animationRef.current = window.requestAnimationFrame(tick);
    };

    animationRef.current = window.requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (animationRef.current !== null) window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      cycleStartRef.current = null;
    };
  }, [measurements, reducedMotion, viewportWidth]);

  const totalCycleWidth = measurements.reduce((sum, width) => sum + width, 0);
  const renderedGreetings = [...GREETINGS, ...GREETINGS, ...GREETINGS];
  const focusGreetingIndex = totalCycleWidth > 0
    ? (() => {
        const focusX = offset + viewportWidth / 2;
        let cursor = totalCycleWidth;
        for (let index = 0; index < GREETINGS.length; index += 1) {
          cursor += measurements[index] ?? 0;
          if (focusX <= cursor) return index;
        }
        return Math.floor(offset / (totalCycleWidth / GREETINGS.length)) % GREETINGS.length;
      })()
    : 0;

  return (
    <div
      ref={viewportRef}
      className="observatory-greeting-viewport absolute inset-x-0 bottom-8 mx-auto w-full max-w-5xl px-4 sm:bottom-12 sm:px-8"
      aria-label="Multilingual greetings"
    >
      <div className="relative overflow-hidden py-3">
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[min(36%,17rem)] -translate-x-1/2"
          aria-hidden="true"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(11,13,16,.30) 12%, rgba(11,13,16,.58) 50%, rgba(11,13,16,.30) 88%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)",
          }}
        />
        <div
          className="observatory-greeting-track flex w-max items-center"
          style={{
            transform: reducedMotion ? "translateX(0)" : `translate3d(-${offset}px, 0, 0)`,
            willChange: reducedMotion ? "auto" : "transform",
          }}
          aria-hidden="true"
        >
          {renderedGreetings.map((greeting, index) => {
            const itemIndex = index % GREETINGS.length;
            const distance = Math.abs(itemIndex - focusGreetingIndex);
            const scale = distance === 0 ? 1.16 : distance === 1 ? 0.92 : distance === 2 ? 0.78 : 0.7;
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.7 : distance === 2 ? 0.42 : 0.25;
            return (
              <span
                key={`${greeting}-${index}`}
                className="observatory-greeting-item inline-flex shrink-0 items-center justify-center px-5 font-mono text-xs tracking-[0.14em] sm:px-7 sm:text-sm sm:tracking-[0.18em]"
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  fontWeight: distance === 0 ? 600 : 400,
                  color: distance === 0 ? "var(--observatory-amber)" : "var(--observatory-muted)",
                  textShadow: distance === 0 ? "0 0 16px rgba(201,146,74,.22)" : "none",
                }}
              >
                {greeting}
              </span>
            );
          })}
        </div>

        <div ref={rulerRef} className="pointer-events-none absolute left-[-9999px] top-0 flex w-max opacity-0" aria-hidden="true">
          {GREETINGS.map((greeting) => (
            <span key={greeting} className="inline-flex shrink-0 items-center justify-center px-5 font-mono text-xs tracking-[0.14em] sm:px-7 sm:text-sm sm:tracking-[0.18em]">
              {greeting}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="off">{GREETINGS[focusGreetingIndex]}</p>
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
  const [skipRequested, setSkipRequested] = useState(false);
  const completedRef = useRef(false);
  const completionCallbackRef = useRef(onComplete);
  const stageRef = useRef(stage);

  useEffect(() => {
    completionCallbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const nextVisitCount = registerBootVisit();
    setVisitCount(nextVisitCount);
  }, []);

  const completeOnce = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setStage("COMPLETE");
    completionCallbackRef.current();
  }, []);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (stage === "COMPLETE") return;
    const nextStage = getNextObservatoryBootStage(stage);
    const duration = getObservatoryBootDuration(stage, reducedMotion);
    return scheduleObservatoryBootTransition(() => setStage(nextStage), duration);
  }, [reducedMotion, stage]);

  useEffect(() => {
    if (!skipRequested) return;
    completeOnce();
  }, [completeOnce, skipRequested]);

  const onSkip = () => {
    if (!shouldOfferBootSkip(visitCount) || completedRef.current) return;
    setSkipRequested(true);
  };

  const wordmarkStage = stage === "INITIALIZING" || stage === "MORPHING"
    ? stage
    : "TRACING";

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
          className="absolute right-5 top-5 z-20 rounded-full border border-observatory-amber/40 px-4 py-2 font-mono text-xs text-observatory-ink transition-colors hover:border-observatory-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-observatory-amber focus-visible:ring-offset-2 focus-visible:ring-offset-observatory-surface"
          aria-label="Skip startup animation"
        >
          Skip intro
        </button>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {stage === "COMPLETE" ? "Observatory ready." : "Observatory initialization in progress."}
      </p>
      <span className="sr-only" data-boot-storage-key={BOOT_VISIT_STORAGE_KEY} />
      <span className="sr-only">{FULL_WORDMARK_DURATION_MS}</span>
    </section>
  );
}
