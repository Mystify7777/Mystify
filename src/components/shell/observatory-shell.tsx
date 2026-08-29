"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CommandPalette } from "@/components/shell/command-palette";
import { Dock } from "@/components/shell/dock";
import { ModeSelector } from "@/components/modes/mode-selector";
import { Notifications } from "@/components/shell/notifications";
import { StatusBar } from "@/components/shell/status-bar";
import { WindowManager } from "@/components/shell/window-manager";
import { useShellCommand } from "@/components/shell/use-shell-command";
import { RecruiterBootSequence } from "@/features/recruiter/boot-sequence";
import { RecruiterEvidenceCard } from "@/features/recruiter/evidence-card";
import { ObservatoryBootSequence } from "@/features/observatory-boot/boot-sequence";
import { Surface } from "@/components/ui/surface";
import { useObservatoryStore } from "@/state/use-observatory-store";

const PLACEHOLDER_WINDOW = {
  id: "foundation",
  title: "Foundation",
  appId: "foundation",
};

export function ObservatoryShell() {
  const mode = useObservatoryStore((state) => state.mode);
  const hydrateMode = useObservatoryStore((state) => state.hydrateMode);
  const clearMode = useObservatoryStore((state) => state.clearMode);
  const openWindow = useObservatoryStore((state) => state.openWindow);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [observatoryBootComplete, setObservatoryBootComplete] = useState(false);
  const [recruiterBootComplete, setRecruiterBootComplete] = useState(false);

  useEffect(() => {
    hydrateMode();
  }, [hydrateMode]);

  useEffect(() => {
    if (mode !== "recruiter") {
      setRecruiterBootComplete(false);
    }
  }, [mode]);

  const completeObservatoryBoot = useCallback(() => {
    setObservatoryBootComplete(true);
  }, []);

  const completeRecruiterBoot = useCallback(() => {
    setRecruiterBootComplete(true);
  }, []);

  const command = useMemo(
    () => ({
      id: "shell.open-palette",
      label: "Open Command Palette",
      description: "Search registered Observatory actions.",
      keywords: ["command", "palette", "search"],
      execute: () => setPaletteOpen(true),
    }),
    [],
  );
  useShellCommand(command);

  const foundationCommand = useMemo(
    () => ({
      id: "foundation.open",
      label: "Open Foundation",
      description: "Open the placeholder application window.",
      keywords: ["foundation", "window", "shell"],
      execute: () => openWindow(PLACEHOLDER_WINDOW),
    }),
    [openWindow],
  );
  useShellCommand(foundationCommand);

  return (
    <main className="relative min-h-screen overflow-hidden bg-observatory-surface font-sans text-observatory-ink">
      <StatusBar />

      <div className="relative min-h-[calc(100vh-2.5rem)]">
        {!observatoryBootComplete ? (
          <ObservatoryBootSequence onComplete={completeObservatoryBoot} />
        ) : (
          <>
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,146,74,0.08),transparent_32%)]"
              aria-hidden="true"
            />

            <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl items-center justify-center p-4 pb-24 sm:p-8 sm:pb-24">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {mode === null ? (
                  <ModeSelector />
                ) : mode === "recruiter" && !recruiterBootComplete ? (
                  <RecruiterBootSequence onComplete={completeRecruiterBoot} />
                ) : mode === "recruiter" ? (
                  <RecruiterEvidenceCard />
                ) : (
                  <Surface className="mx-auto max-w-2xl text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-observatory-muted">
                      {mode} mode
                    </p>
                    <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                      Observatory shell online.
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-observatory-muted sm:text-base">
                      This mode is reserved for its implementation phase. Shared
                      shell and session context remain available without exposing
                      unfinished content.
                    </p>
                    <button
                      type="button"
                      className="mt-8 rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-observatory-muted transition duration-observatory hover:bg-white/5 hover:text-observatory-ink"
                      onClick={clearMode}
                    >
                      Change mode
                    </button>
                  </Surface>
                )}
              </motion.div>
            </div>
          </>
        )}

        {observatoryBootComplete ? (
          <WindowManager windowId={PLACEHOLDER_WINDOW.id}>
          <div className="space-y-3">
            <p className="text-sm text-observatory-ink">
              Placeholder application surface.
            </p>
            <p className="text-xs leading-5 text-observatory-muted">
              This window exists only to prove the shared lifecycle contract.
              Project knowledge and mode-specific behavior do not belong in the
              shell.
            </p>
          </div>
          </WindowManager>
        ) : null}
      </div>

      {observatoryBootComplete ? (
        <>
          <Notifications />
          <Dock />
          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
          />
        </>
      ) : null}
    </main>
  );
}
