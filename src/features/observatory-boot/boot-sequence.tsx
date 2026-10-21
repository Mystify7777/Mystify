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
  const drawing = stage === "MORPHING" || stage === "TRACING";
  const filling = stage === "GREETING" || stage === "COMPLETE";
  const settled = stage === "GREETING" || stage === "COMPLETE";
  const strokes = [
    { id: "m", d: "M82 145 C91 113 101 74 111 55 C119 40 127 66 133 88 C138 108 142 124 147 117 C158 96 164 66 174 52 C181 42 186 58 190 80 C195 107 200 128 211 132 C219 135 226 126 233 115", delay: 0.00, duration: 0.55 },
    { id: "y", d: "M220 112 C231 91 242 78 250 84 C260 92 247 123 241 139 C235 156 244 163 256 151 C272 135 284 105 294 87 C300 75 306 82 303 96 C298 119 284 150 276 166 C266 186 254 197 242 193", delay: 0.45, duration: 0.55 },
    { id: "s", d: "M346 93 C333 80 313 88 311 103 C309 117 333 118 337 130 C342 145 322 156 307 147", delay: 0.88, duration: 0.42 },
    { id: "t", d: "M365 54 C357 83 346 121 344 140 C342 157 356 160 369 145 M347 91 C362 85 377 83 389 86", delay: 0.94, duration: 0.38 },
    { id: "i", d: "M387 108 C380 128 377 143 385 146 C393 149 400 137 405 130", delay: 1.18, duration: 0.28 },
    { id: "idot", d: "M401 91 C403 89 405 87 406 85", delay: 1.38, duration: 0.08 },
    { id: "f", d: "M431 54 C416 82 402 120 395 151 C390 174 386 194 373 198 C363 200 360 190 369 181 M398 105 C415 99 431 98 446 102", delay: 1.42, duration: 0.42 },
    { id: "y2", d: "M438 113 C448 93 461 81 468 88 C477 97 462 128 455 144 C447 164 457 168 469 155 C483 140 497 111 507 91 C513 80 519 85 516 99 C511 121 498 152 487 170 C475 191 462 201 451 194", delay: 1.76, duration: 0.48 },
  ] as const;
  const drawComplete = filling;
  const motionDuration = reducedMotion ? 0.01 : 0.45;

  return (
    <div className="relative flex min-h-[13rem] w-full items-center justify-center sm:min-h-[16rem]">
      <motion.div
        aria-hidden="true"
        className="absolute h-28 w-28 rounded-full border border-observatory-amber/80 sm:h-36 sm:w-36"
        initial={false}
        animate={
          stage === "INITIALIZING" && !reducedMotion
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
            : { opacity: 0, scale: 1.42, boxShadow: "0 0 0 rgba(201,146,74,0)" }
        }
        transition={{ duration: reducedMotion ? 0.01 : 0.9, times: [0, 0.24, 0.58, 1], ease: "easeInOut" }}
      />

      <div className="relative w-full max-w-[42rem] px-2 sm:px-0">
        <motion.svg
          viewBox="0 0 560 240"
          role="img"
          aria-label="Mystify"
          className="h-auto w-full overflow-visible"
          initial={false}
          animate={{ opacity: stage === "INITIALIZING" ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.18 }}
        >
          <defs>
            <filter id="mystify-signature-glow" x="-30%" y="-40%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
          </defs>

          {strokes.map((stroke) => (
            <g key={stroke.id} fill="none" stroke="var(--observatory-amber)" strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                d={stroke.d}
                pathLength={1}
                strokeWidth={13}
                opacity={0.22}
                filter="url(#mystify-signature-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: drawComplete ? 1 : drawing ? 1 : 0,
                  opacity: drawComplete ? (settled ? 0.12 : 0.2) : drawing ? 0.7 : 0,
                }}
                transition={{
                  pathLength: { duration: reducedMotion ? 0.01 : stroke.duration, delay: reducedMotion ? 0 : stroke.delay, ease: "linear" },
                  opacity: { duration: motionDuration },
                }}
              />
              <motion.path
                d={stroke.d}
                pathLength={1}
                initial={{ pathLength: 0, strokeWidth: 2.6, opacity: 0 }}
                animate={{
                  pathLength: drawComplete ? 1 : drawing ? 1 : 0,
                  strokeWidth: filling ? 12 : 2.6,
                  opacity: stage === "INITIALIZING" ? 0 : 1,
                }}
                transition={{
                  pathLength: { duration: reducedMotion ? 0.01 : stroke.duration, delay: reducedMotion ? 0 : stroke.delay, ease: "linear" },
                  strokeWidth: { duration: reducedMotion ? 0.01 : 0.38, delay: filling ? 0.04 : 0 },
                  opacity: { duration: motionDuration },
                }}
              />
            </g>
          ))}
        </motion.svg>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full"
          initial={false}
          animate={{ opacity: settled ? 0.26 : filling ? 0.5 : drawing ? 0.38 : 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.55, ease: "easeOut" }}
          style={{
            background: "radial-gradient(ellipse at 50% 52%, rgba(201,146,74,.18) 0%, rgba(201,146,74,.07) 38%, rgba(201,146,74,0) 72%)",
            filter: "blur(22px)",
          }}
        />
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
