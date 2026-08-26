export type WindowId = string;

export interface ShellWindow {
  id: WindowId;
  title: string;
  appId: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface ShellNotification {
  id: string;
  message: string;
  createdAt: number;
  archived?: boolean;
}

export interface CommandAction {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  execute: () => void;
}
