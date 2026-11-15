"use client";

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent, SVGProps } from "react";
import {
  getNextMode,
  MODE_GATEWAY_CONTENT,
  MODE_ORDER,
  type ModeGatewayContent,
} from "@/components/modes/mode-gateway";
import {
  useObservatoryStore,
  type ObservatoryMode,
} from "@/state/use-observatory-store";

function ModeIllustration({
  mode,
  className,
}: {
  mode: ObservatoryMode;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 120 120",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } satisfies SVGProps<SVGSVGElement>;

  if (mode === "recruiter") {
    return (
      <svg {...common}>
        <rect x="25" y="20" width="52" height="68" rx="5" stroke="currentColor" strokeWidth="2.5" />
        <rect x="34" y="28" width="34" height="4" rx="2" fill="currentColor" opacity="0.85" />
        <rect x="34" y="38" width="26" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="34" y="46" width="30" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="34" y="54" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="57" y="47" width="34" height="34" rx="5" fill="var(--observatory-surface)" stroke="currentColor" strokeWidth="2.5" />
        <path d="M64 70V62M71 70V57M78 70V52M85 70V47" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="84" cy="82" r="12" fill="var(--observatory-surface)" stroke="currentColor" strokeWidth="2.5" />
        <path d="m78 82 4 4 7-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 31V21M18 21H28M92 99h10M102 99V89" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      </svg>
    );
  }

  if (mode === "explorer") {
    return (
      <svg {...common}>
        <circle cx="60" cy="60" r="37" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
        <circle cx="60" cy="60" r="25" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="60" cy="60" r="12" stroke="currentColor" strokeWidth="2" />
        <path d="m66 50-18 8-4 18 18-8 4-18Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="60" cy="23" r="4" fill="currentColor" />
        <circle cx="97" cy="60" r="4" fill="currentColor" />
        <circle cx="60" cy="97" r="4" fill="currentColor" />
        <circle cx="23" cy="60" r="4" fill="currentColor" />
        <path d="M60 18V10M102 60h8M60 102v8M18 60h-8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m60 18 30 15-30 15-30-15 30-15Z" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m30 49 30 15 30-15M30 66l30 15 30-15M30 33v16M90 33v16M30 66v15M90 66v15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M50 33 46 38l5 5M70 33l4 5-5 5M53 44l14-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ModeCard({
  mode,
  selected,
  onSelect,
  index,
  buttonRef,
  onKeyDown,
}: {
  mode: ObservatoryMode;
  selected: boolean;
  onSelect: (mode: ObservatoryMode) => void;
  index: number;
  buttonRef: (element: HTMLButtonElement | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const content = MODE_GATEWAY_CONTENT[mode];
  const accent =
    mode === "recruiter"
      ? "var(--observatory-amber)"
      : mode === "explorer"
        ? "var(--observatory-violet)"
        : "var(--observatory-cyan)";

  return (
    <button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(mode)}
      className="group relative min-h-52 rounded-observatory border bg-observatory-panel/80 p-5 text-left transition duration-observatory hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-observatory-surface sm:min-h-60 sm:p-6"
      style={{
        borderColor: selected ? accent : "rgba(255,255,255,0.1)",
        boxShadow: selected
          ? `0 0 0 1px ${accent}, 0 0 28px color-mix(in srgb, ${accent} 20%, transparent), inset 0 0 32px color-mix(in srgb, ${accent} 7%, transparent)`
          : undefined,
      }}
    >
      <span
        className="absolute inset-x-5 top-4 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] sm:inset-x-6"
        style={{ color: selected ? accent : "var(--observatory-muted)" }}
      >
        <span>{content.label}</span>
        {mode === "recruiter" ? (
          <span
            className="rounded-full border px-2 py-1 text-[9px] tracking-[0.16em]"
            style={{ borderColor: accent }}
          >
            Recommended
          </span>
        ) : null}
      </span>

      <span
        className="mt-8 block h-28 w-full sm:h-32"
        style={{ color: accent }}
      >
        <ModeIllustration mode={mode} className="mx-auto h-full w-full max-w-32 transition duration-observatory group-hover:scale-[1.03]" />
      </span>

      <span className="mt-3 block text-center text-xl font-medium tracking-[0.12em] text-observatory-ink">
        {content.title}
      </span>
      <span className="mx-auto mt-3 block max-w-[17rem] text-center text-sm leading-6 text-observatory-muted">
        {content.description}
      </span>

      <span
        aria-hidden="true"
        className="absolute bottom-4 right-4 h-3 w-3 rounded-full border sm:bottom-5 sm:right-5"
        style={{
          borderColor: selected ? accent : "rgba(138,147,158,0.7)",
          backgroundColor: selected ? accent : "transparent",
          boxShadow: selected ? `0 0 12px ${accent}` : undefined,
        }}
      />
      <span className="sr-only">{index + 1} of {MODE_ORDER.length}</span>
    </button>
  );
}

export function ModeSelector() {
  const setMode = useObservatoryStore((state) => state.setMode);
  const [selectedMode, setSelectedMode] =
    useState<ObservatoryMode>("recruiter");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedContent: ModeGatewayContent = useMemo(
    () => MODE_GATEWAY_CONTENT[selectedMode],
    [selectedMode],
  );

  const selectMode = (nextMode: ObservatoryMode) => {
    setSelectedMode(nextMode);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    event.preventDefault();
    const isForward =
      event.key === "ArrowRight" || event.key === "ArrowDown";
    const nextMode = getNextMode(selectedMode, isForward ? 1 : -1);
    const nextIndex = MODE_ORDER.indexOf(nextMode);
    setSelectedMode(nextMode);
    buttonRefs.current[nextIndex]?.focus();
    void index;
  };

  return (
    <section
      aria-labelledby="mode-selector-heading"
      className="relative mx-auto w-full max-w-6xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-32 h-[30rem] w-[min(72rem,120vw)] -translate-x-1/2 rounded-full border border-white/[0.045] sm:top-24"
        style={{
          boxShadow:
            "0 0 0 6rem rgba(255,255,255,0.008), 0 0 0 12rem rgba(255,255,255,0.006)",
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-observatory-amber/60" />
        <span className="absolute left-[16%] top-1/2 h-1.5 w-1.5 rounded-full bg-observatory-amber/50" />
        <span className="absolute right-[16%] top-1/2 h-1.5 w-1.5 rounded-full bg-observatory-cyan/50" />
      </div>

      <header className="relative mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-observatory-muted">
          Gateway / Select Lens
        </p>
        <h1
          id="mode-selector-heading"
          className="mt-4 text-4xl font-medium tracking-tight text-observatory-ink sm:text-5xl lg:text-6xl"
        >
          Choose your{" "}
          <span className="text-observatory-amber">perspective.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-observatory-muted sm:text-base">
          One observatory. Three lenses to understand the work.
        </p>
      </header>

      <div
        role="radiogroup"
        aria-label="Observatory perspectives"
        className="relative mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-12"
      >
        {MODE_ORDER.map((mode, index) => (
          <ModeCard
            key={mode}
            mode={mode}
            selected={selectedMode === mode}
            onSelect={selectMode}
            index={index}
            buttonRef={(element) => {
              buttonRefs.current[index] = element;
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>

      <section
        aria-live="polite"
        aria-labelledby="selected-perspective-heading"
        className="relative mt-5 overflow-hidden rounded-observatory border border-white/10 bg-observatory-panel/85 shadow-[0_12px_50px_rgba(0,0,0,0.28)] sm:mt-6"
      >
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{
            backgroundColor:
              selectedMode === "recruiter"
                ? "var(--observatory-amber)"
                : selectedMode === "explorer"
                  ? "var(--observatory-violet)"
                  : "var(--observatory-cyan)",
          }}
        />
        <div className="grid gap-6 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-6 lg:p-7">
          <div
            className="hidden h-20 w-20 shrink-0 items-center justify-center sm:flex"
            style={{
              color:
                selectedMode === "recruiter"
                  ? "var(--observatory-amber)"
                  : selectedMode === "explorer"
                    ? "var(--observatory-violet)"
                    : "var(--observatory-cyan)",
            }}
          >
            <ModeIllustration mode={selectedMode} className="h-full w-full" />
          </div>

          <div>
            <p
              id="selected-perspective-heading"
              className="font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{
                color:
                  selectedMode === "recruiter"
                    ? "var(--observatory-amber)"
                    : selectedMode === "explorer"
                      ? "var(--observatory-violet)"
                      : "var(--observatory-cyan)",
              }}
            >
              {selectedContent.contextLabel}
            </p>
            <p className="mt-2 max-w-3xl text-base leading-7 text-observatory-ink sm:text-lg">
              {selectedContent.contextDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode(selectedMode)}
            className="min-h-12 rounded-xl border px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-observatory-surface transition duration-observatory motion-reduce:transition-none hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-observatory-panel sm:min-w-52"
            style={{
              borderColor:
                selectedMode === "recruiter"
                  ? "var(--observatory-amber)"
                  : selectedMode === "explorer"
                    ? "var(--observatory-violet)"
                    : "var(--observatory-cyan)",
              backgroundColor:
                selectedMode === "recruiter"
                  ? "var(--observatory-amber)"
                  : selectedMode === "explorer"
                    ? "var(--observatory-violet)"
                    : "var(--observatory-cyan)",
            }}
          >
            Enter {selectedContent.title}
            <span aria-hidden="true" className="ml-3 text-base">→</span>
          </button>
        </div>
      </section>
    </section>
  );
}
