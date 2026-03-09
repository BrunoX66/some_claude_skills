import { create } from "zustand";

export type WindowContentType =
  | { type: "skill"; skillId: string }
  | { type: "changelog" }
  | { type: "artifacts" }
  | { type: "bundle"; bundleId: string }
  | { type: "about" }
  | { type: "search" };

export interface WindowState {
  id: string;
  title: string;
  icon?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  content: WindowContentType;
}

interface WindowManagerState {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;

  // Actions
  openWindow: (window: Omit<WindowState, "zIndex">) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
}

// Cascade offset for new windows
let cascadeOffset = 0;
const CASCADE_STEP = 30;
const CASCADE_MAX = 180;

export const useWindowManager = create<WindowManagerState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 1,

  openWindow: (win) =>
    set((state) => {
      // If window with same ID already exists, just focus it
      const existing = state.windows.find((w) => w.id === win.id);
      if (existing) {
        return {
          windows: state.windows.map((w) =>
            w.id === win.id
              ? { ...w, isMinimized: false, zIndex: state.nextZIndex }
              : w
          ),
          activeWindowId: win.id,
          nextZIndex: state.nextZIndex + 1,
        };
      }

      // Apply cascade offset for new windows
      cascadeOffset = (cascadeOffset + CASCADE_STEP) % CASCADE_MAX;
      const cascadedWin: WindowState = {
        ...win,
        x: win.x + cascadeOffset,
        y: win.y + cascadeOffset,
        zIndex: state.nextZIndex,
      };

      return {
        windows: [...state.windows, cascadedWin],
        activeWindowId: win.id,
        nextZIndex: state.nextZIndex + 1,
      };
    }),

  closeWindow: (id) =>
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id);
      // If we closed the active window, activate the topmost remaining
      let newActive = state.activeWindowId;
      if (state.activeWindowId === id) {
        const topWindow = remaining
          .filter((w) => !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        newActive = topWindow?.id || null;
      }
      return { windows: remaining, activeWindowId: newActive };
    }),

  closeAllWindows: () => set({ windows: [], activeWindowId: null }),

  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    })),

  minimizeWindow: (id) =>
    set((state) => {
      const remaining = state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );
      // Activate next topmost non-minimized window
      let newActive = state.activeWindowId;
      if (state.activeWindowId === id) {
        const topWindow = remaining
          .filter((w) => !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        newActive = topWindow?.id || null;
      }
      return { windows: remaining, activeWindowId: newActive };
    }),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true, zIndex: state.nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    })),

  restoreWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMinimized: false,
              isMaximized: false,
              zIndex: state.nextZIndex,
            }
          : w
      ),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    })),

  toggleMinimize: (id) => {
    const state = get();
    const win = state.windows.find((w) => w.id === id);
    if (!win) return;
    if (win.isMinimized) {
      state.restoreWindow(id);
    } else {
      state.minimizeWindow(id);
    }
  },

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    })),

  resizeWindow: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    })),
}));

// Selector hooks for common patterns
export const useActiveWindow = () =>
  useWindowManager((s) => s.windows.find((w) => w.id === s.activeWindowId));

export const useVisibleWindows = () =>
  useWindowManager((s) => s.windows.filter((w) => !w.isMinimized));

export const useMinimizedWindows = () =>
  useWindowManager((s) => s.windows.filter((w) => w.isMinimized));

export const useIsWindowOpen = (id: string) =>
  useWindowManager((s) => s.windows.some((w) => w.id === id));
