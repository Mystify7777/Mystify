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
    { id: "m", d: "M64 151 C75 119 86 79 97 58 C105 42 114 68 120 91 C126 113 130 130 137 120 C148 98 155 67 166 52 C173 42 180 59 184 82 C190 111 195 134 207 137 C216 139 224 128 232 115", delay: 0, duration: 0.52 },
    { id: "y", d: "M218 116 C229 94 240 80 249 87 C259 95 247 125 241 142 C235 159 244 165 256 153 C271 138 283 109 293 89 C299 77 305 83 302 98 C297 121 284 151 274 169 C264 187 253 197 241 193", delay: 0.43, duration: 0.52 },
    { id: "s", d: "M343 94 C331 82 314 88 312 102 C310 116 332 119 337 131 C343 145 324 156 309 148", delay: 0.86, duration: 0.4 },
    { id: "t", d: "M365 56 C356 84 347 119 345 140 C343 156 356 159 369 145 M348 92 C361 87 375 85 387 88", delay: 1.13, duration: 0.42 },
    { id: "i", d: "M390 111 C383 128 380 142 387 146 C394 149 401 138 406 130", delay: 1.46, duration: 0.28 },
    { id: "idot", d: "M402 91 C403 89 405 87 406 85", delay: 1.68, duration: 0.08 },
    { id: "f", d: "M431 55 C417 82 404 118 397 149 C392 171 387 192 375 197 C365 200 361 190 370 181 M399 106 C414 100 429 99 444 102", delay: 1.72, duration: 0.44 },
    { id: "y2", d: "M438 115 C449 94 460 82 468 89 C477 98 463 128 456 145 C448 164 457 169 469 156 C483 141 497 112 507 92 C513 81 519 86 516 100 C511 122 498 153 487 171 C475 191 463 201 451 194", delay: 2.06, duration: 0.48 },
  ] as const;
  const motionDuration = reducedMotion ? 0.01 : 0.72;

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

      <div className="relative w-full max-w-[38rem] px-2 sm:px-0">
        <motion.svg
          viewBox="0 0 560 240"
          role="img"
          aria-label="Mystify"
          className="h-auto w-full overflow-visible"
          initial={false}
          animate={{ opacity: stage === "INITIALIZING" ? 0 : 1, y: drawing ? [5, 0] : 0 }}
          transition={{ opacity: { duration: reducedMotion ? 0.01 : 0.2 }, y: { duration: reducedMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <defs>
            <filter id="mystify-signature-glow" x="-30%" y="-40%" width="160%" height="180%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {strokes.map((stroke) => (
            <g key={stroke.id} fill="none" stroke="var(--observatory-amber)" strokeLinecap="round" strokeLinejoin="round">
              <motion.path
                d={stroke.d}
                pathLength={1}
                strokeWidth={10}
                filter="url(#mystify-signature-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: filling ? 1 : drawing ? 1 : 0,
                  opacity: filling ? 0 : drawing ? 0.42 : 0,
                }}
                transition={{
                  pathLength: { duration: reducedMotion ? 0.01 : stroke.duration, delay: reducedMotion ? 0 : stroke.delay, ease: "linear" },
                  opacity: { duration: motionDuration },
                }}
              />
              <motion.path
                d={stroke.d}
                pathLength={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: filling ? 1 : drawing ? 1 : 0,
                  opacity: filling ? 0 : stage === "INITIALIZING" ? 0 : 1,
                }}
                transition={{
                  pathLength: { duration: reducedMotion ? 0.01 : stroke.duration, delay: reducedMotion ? 0 : stroke.delay, ease: "linear" },
                  opacity: { duration: motionDuration },
                }}
                strokeWidth={2.4}
              />
            </g>
          ))}

          <motion.text
            x="280"
            y="151"
            textAnchor="middle"
            fill="var(--observatory-amber)"
            fontFamily='"Segoe Script", "Brush Script MT", "URW Chancery L", cursive'
            fontSize="116"
            fontStyle="italic"
            letterSpacing="-5"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: filling ? 1 : 0, scale: filling ? 1 : 0.97 }}
            transition={{ opacity: { duration: reducedMotion ? 0.01 : 0.72, delay: reducedMotion ? 0 : 0.04 }, scale: { duration: reducedMotion ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] } }}
          >
            Mystify
          </motion.text>
        </motion.svg>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          initial={false}
          animate={{ opacity: settled ? 0.22 : filling ? 0.34 : drawing ? 0.28 : 0, scale: settled ? 1 : 0.94 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.6, ease: "easeOut" }}
          style={{
            background: "radial-gradient(ellipse at 50% 54%, rgba(201,146,74,.16) 0%, rgba(201,146,74,.06) 36%, rgba(201,146,74,0) 70%)",
            filter: "blur(18px)",
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
  const completionNotifiedRef = useRef(false);
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
      completedRef.current = true;
      if (!completionNotifiedRef.current) {
        completionNotifiedRef.current = true;
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
