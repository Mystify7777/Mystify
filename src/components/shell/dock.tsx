"use client";

import { useObservatoryStore } from "@/state/use-observatory-store";

export function Dock() {
  const windows = useObservatoryStore((state) => state.windows);
  const restoreWindow = useObservatoryStore((state) => state.restoreWindow);
  const focusWindow = useObservatoryStore((state) => state.focusWindow);

  const visibleWindows = windows.filter((window) => window.isOpen);

  return (
    <nav
      aria-label="Open applications"
      className="fixed bottom-4 left-1/2 z-[1000] flex -translate-x-1/2 gap-2 rounded-2xl border border-white/10 bg-observatory-panel/90 p-2 shadow-2xl backdrop-blur"
    >
      {visibleWindows.length === 0 ? (
        <span className="px-3 py-1 font-mono text-[11px] text-observatory-muted">
          no open windows
        </span>
      ) : (
        visibleWindows.map((window) => {
          const isActive = window.id === useObservatoryStore.getState().activeWindowId;
          return (
            <button
              key={window.id}
              type="button"
              className={`rounded-xl px-3 py-2 font-mono text-[11px] transition-observatory duration-observatory ${
                window.isMinimized || !isActive
                  ? "text-observatory-muted hover:bg-white/5 hover:text-observatory-ink"
                  : "bg-white/5 text-observatory-ink"
              }`}
              onClick={() => {
                if (window.isMinimized) restoreWindow(window.id);
                else focusWindow(window.id);
              }}
            >
              {window.title}
            </button>
          );
        })
      )}
    </nav>
  );
}
