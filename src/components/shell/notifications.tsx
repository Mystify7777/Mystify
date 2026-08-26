"use client";

import { useObservatoryStore } from "@/state/use-observatory-store";

export function Notifications() {
  const notifications = useObservatoryStore((state) => state.notifications);
  const clearNotification = useObservatoryStore(
    (state) => state.clearNotification,
  );

  if (notifications.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed right-4 top-14 z-[1100] w-[min(90vw,360px)] space-y-2"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded-xl border border-white/10 bg-observatory-panel/95 p-3 shadow-xl backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-observatory-ink">
              {notification.message}
            </p>
            <button
              type="button"
              aria-label="Dismiss notification"
              className="font-mono text-xs text-observatory-muted hover:text-observatory-ink"
              onClick={() => clearNotification(notification.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </aside>
  );
}
