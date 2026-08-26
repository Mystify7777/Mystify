import type { PropsWithChildren } from "react";

interface SurfaceProps extends PropsWithChildren {
  className?: string;
}

export function Surface({ children, className = "" }: SurfaceProps) {
  return (
    <section
      className={`rounded-observatory border border-white/10 bg-observatory-panel p-6 shadow-2xl ${className}`}
    >
      {children}
    </section>
  );
}
