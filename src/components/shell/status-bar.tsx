"use client";

import { useEffect, useState } from "react";

export function StatusBar() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="flex h-10 items-center justify-between border-b border-white/10 bg-observatory-panel/95 px-4 font-mono text-[11px] text-observatory-muted backdrop-blur">
      <span>◈ MYSTIFY OBSERVATORY</span>
      <span>{time.toLocaleTimeString([], { hour12: false })}</span>
    </header>
  );
}
