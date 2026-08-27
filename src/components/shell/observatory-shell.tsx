"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CommandPalette } from "@/components/shell/command-palette";
import { Dock } from "@/components/shell/dock";
import { Notifications } from "@/components/shell/notifications";
import { StatusBar } from "@/components/shell/status-bar";
import { WindowManager } from "@/components/shell/window-manager";
import { useShellCommand } from "@/components/shell/use-shell-command";
import { ModeSelector } from "@/components/modes/mode-selector";
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

  useEffect(() => {
    hydrateMode();
  }, [hydrateMode]);

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,146,74,0.08),transparent_32%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl items-center justify-center p-4 pb-24 sm:p-8 sm:pb-24">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {mode === null ? (
              <ModeSelector />
            ) : (
              <Surface className="mx-auto max-w-2xl text-center">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-observatory-muted">
                  Shared shell
                </p>
                <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                  Observatory shell online.
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-observatory-muted sm:text-base">
                  Window lifecycle, commands, notifications, and navigation now
                  have shared ownership. Feature applications can plug into this
                  surface without owning shell mechanics.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-observatory-ink transition duration-observatory hover:border-observatory-amber/50 hover:bg-observatory-amber/10"
                    onClick={() => openWindow(PLACEHOLDER_WINDOW)}
                  >
                    Open placeholder window
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-observatory-muted transition duration-observatory hover:bg-white/5 hover:text-observatory-ink"
                    onClick={() => setPaletteOpen(true)}
                  >
                    Command palette
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-observatory-muted transition duration-observatory hover:bg-white/5 hover:text-observatory-ink"
                    onClick={clearMode}
                  >
                    Change mode
                  </button>
                </div>
                <p className="mt-6 font-mono text-[11px] text-observatory-muted">
                  environment: {mode}
                </p>
              </Surface>
            )}
          </motion.div>
        </div>

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
      </div>

      <Notifications />
      <Dock />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </main>
  );
}
