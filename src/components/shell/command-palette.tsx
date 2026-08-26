"use client";

import { useMemo, useState } from "react";
import { useObservatoryStore } from "@/state/use-observatory-store";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const commands = useObservatoryStore((state) => state.commands);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) =>
      [command.label, command.description, ...(command.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [commands, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="mx-auto mt-[12vh] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-observatory-panel shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
          }}
          placeholder="Search actions..."
          className="w-full border-b border-white/10 bg-transparent px-4 py-3 font-mono text-sm text-observatory-ink outline-none placeholder:text-observatory-muted"
        />
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-4 font-mono text-xs text-observatory-muted">
              no matching actions
            </p>
          ) : (
            results.map((command) => (
              <button
                key={command.id}
                type="button"
                className="block w-full rounded-xl px-3 py-3 text-left hover:bg-white/5"
                onClick={() => {
                  command.execute();
                  onClose();
                  setQuery("");
                }}
              >
                <span className="block text-sm text-observatory-ink">
                  {command.label}
                </span>
                {command.description ? (
                  <span className="mt-1 block text-xs text-observatory-muted">
                    {command.description}
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
