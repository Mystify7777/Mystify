"use client";

import { motion } from "framer-motion";
import { Surface } from "@/components/ui/surface";
import { useObservatoryStore } from "@/state/use-observatory-store";

export function ObservatoryShell() {
  const mode = useObservatoryStore((state) => state.mode);

  return (
    <main className="min-h-screen p-4 font-sans sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Surface className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-observatory-muted">
              Mystify Observatory
            </p>
            <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Foundation online.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-observatory-muted sm:text-base">
              The application foundation is ready. Feature systems will be
              introduced through their defined architectural boundaries.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 font-mono text-xs text-observatory-muted">
              <span
                className="h-2 w-2 rounded-full bg-observatory-amber"
                aria-hidden="true"
              />
              <span>session: {mode ?? "unselected"}</span>
            </div>
          </Surface>
        </motion.div>
      </div>
    </main>
  );
}
