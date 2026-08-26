"use client";

import { useEffect } from "react";
import type { CommandAction } from "@/components/shell/types";
import { useObservatoryStore } from "@/state/use-observatory-store";

export function useShellCommand(command: CommandAction) {
  const registerCommand = useObservatoryStore((state) => state.registerCommand);
  const unregisterCommand = useObservatoryStore(
    (state) => state.unregisterCommand,
  );

  useEffect(() => {
    registerCommand(command);
    return () => unregisterCommand(command.id);
  }, [command, registerCommand, unregisterCommand]);
}
