"use client";

import type { PropsWithChildren } from "react";
import { useObservatoryStore } from "@/state/use-observatory-store";
import type { WindowId } from "@/components/shell/types";

interface WindowManagerProps extends PropsWithChildren {
  windowId: WindowId;
}

export function WindowManager({ children, windowId }: WindowManagerProps) {
  const window = useObservatoryStore((state) =>
    state.windows.find((item) => item.id === windowId),
  );
  const focusWindow = useObservatoryStore((state) => state.focusWindow);
  const minimizeWindow = useObservatoryStore((state) => state.minimizeWindow);
  const closeWindow = useObservatoryStore((state) => state.closeWindow);

  if (!window?.isOpen || window.isMinimized) return null;

  return (
    <section
      aria-label={window.title}
      className="absolute left-1/2 top-1/2 w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-observatory-panel shadow-2xl"
      style={{ zIndex: window.zIndex }}
      onMouseDown={() => focusWindow(window.id)}
    >
      <div className="flex h-9 items-center justify-between border-b border-white/10 px-3 font-mono text-[11px] text-observatory-muted">
        <span>{window.title}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded px-2 py-1 hover:bg-white/5 hover:text-observatory-ink"
            aria-label={`Minimize ${window.title}`}
            onClick={() => minimizeWindow(window.id)}
          >
            —
          </button>
          <button
            type="button"
            className="rounded px-2 py-1 hover:bg-white/5 hover:text-observatory-ink"
            aria-label={`Close ${window.title}`}
            onClick={() => closeWindow(window.id)}
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
