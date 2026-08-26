import { create } from "zustand";
import type {
  CommandAction,
  ShellNotification,
  ShellWindow,
  WindowId,
} from "@/components/shell/types";

export type ObservatoryMode = "recruiter" | "explorer" | "engineer";

interface ObservatoryState {
  mode: ObservatoryMode | null;
  windows: ShellWindow[];
  notifications: ShellNotification[];
  commands: CommandAction[];
  activeWindowId: WindowId | null;
  nextZIndex: number;
  setMode: (mode: ObservatoryMode) => void;
  registerCommand: (command: CommandAction) => void;
  unregisterCommand: (commandId: string) => void;
  openWindow: (
    window: Omit<ShellWindow, "isOpen" | "isMinimized" | "zIndex">,
  ) => void;
  focusWindow: (windowId: WindowId) => void;
  minimizeWindow: (windowId: WindowId) => void;
  restoreWindow: (windowId: WindowId) => void;
  closeWindow: (windowId: WindowId) => void;
  addNotification: (notification: ShellNotification) => void;
  clearNotification: (notificationId: string) => void;
}

export const useObservatoryStore = create<ObservatoryState>((set) => ({
  mode: null,
  windows: [],
  notifications: [],
  commands: [],
  activeWindowId: null,
  nextZIndex: 1,
  setMode: (mode) => set({ mode }),
  registerCommand: (command) =>
    set((state) => ({
      commands: [
        ...state.commands.filter((item) => item.id !== command.id),
        command,
      ],
    })),
  unregisterCommand: (commandId) =>
    set((state) => ({
      commands: state.commands.filter((command) => command.id !== commandId),
    })),
  openWindow: (window) =>
    set((state) => {
      const existing = state.windows.find((item) => item.id === window.id);
      const zIndex = state.nextZIndex;
      if (existing) {
        return {
          windows: state.windows.map((item) =>
            item.id === window.id
              ? { ...item, isOpen: true, isMinimized: false, zIndex }
              : item,
          ),
          activeWindowId: window.id,
          nextZIndex: zIndex + 1,
        };
      }

      return {
        windows: [
          ...state.windows,
          { ...window, isOpen: true, isMinimized: false, zIndex },
        ],
        activeWindowId: window.id,
        nextZIndex: zIndex + 1,
      };
    }),
  focusWindow: (windowId) =>
    set((state) => {
      const target = state.windows.find(
        (window) => window.id === windowId && window.isOpen,
      );
      if (!target || state.activeWindowId === windowId) return state;

      return {
        windows: state.windows.map((window) =>
          window.id === windowId
            ? { ...window, isMinimized: false, zIndex: state.nextZIndex }
            : window,
        ),
        activeWindowId: windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }),
  minimizeWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === windowId ? { ...window, isMinimized: true } : window,
      ),
      activeWindowId:
        state.activeWindowId === windowId ? null : state.activeWindowId,
    })),
  restoreWindow: (windowId) =>
    set((state) => {
      const target = state.windows.find(
        (window) => window.id === windowId && window.isOpen,
      );
      if (!target) return state;

      return {
        windows: state.windows.map((window) =>
          window.id === windowId
            ? { ...window, isMinimized: false, zIndex: state.nextZIndex }
            : window,
        ),
        activeWindowId: windowId,
        nextZIndex: state.nextZIndex + 1,
      };
    }),
  closeWindow: (windowId) =>
    set((state) => {
      const targetExists = state.windows.some(
        (window) => window.id === windowId,
      );
      if (!targetExists) return state;

      return {
        windows: state.windows.filter((window) => window.id !== windowId),
        activeWindowId:
          state.activeWindowId === windowId ? null : state.activeWindowId,
      };
    }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  clearNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== notificationId,
      ),
    })),
}));
