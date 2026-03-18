"use client";

import {
  Win31Menu,
  Win31MenuTrigger,
  Win31MenuContent,
  Win31MenuItem,
  Win31MenuSeparator,
} from "@/components/win31";
import {
  openMcpWindow,
  openAgentsWindow,
  openChangelogWindow,
  openBundlesWindow,
  openFavoritesWindow,
  openSearchWindow,
} from "@/lib/windowHelpers";
import { useWindowManager } from "@/state/windowManager";
import { cn } from "@/lib/utils";

/* ── Window arrangement helpers ─────────────────────────────────────────── */

const MENU_BAR_HEIGHT = 22; // px — height of this menu bar
const TASKBAR_HEIGHT = 32; // px — matches --win31-taskbar-height

/** Cascade visible windows diagonally from top-left of the work area */
function cascadeWindows() {
  const store = useWindowManager.getState();
  const visible = store.windows.filter((w) => !w.isMinimized);
  if (visible.length === 0) return;

  const workW = window.innerWidth;
  const workH = window.innerHeight - MENU_BAR_HEIGHT - TASKBAR_HEIGHT;
  const STEP = 28;
  const startX = 20;
  const startY = MENU_BAR_HEIGHT + 8;

  visible.forEach((win, i) => {
    const x = startX + i * STEP;
    const y = startY + i * STEP;
    // Clamp so window doesn't escape screen
    store.moveWindow(
      win.id,
      Math.min(x, workW - win.width - 20),
      Math.min(y, workH - win.height - 20 + MENU_BAR_HEIGHT)
    );
    store.focusWindow(win.id);
  });
}

/** Tile visible windows horizontally (columns) */
function tileHorizontal() {
  const store = useWindowManager.getState();
  const visible = store.windows.filter((w) => !w.isMinimized);
  if (visible.length === 0) return;

  const workW = Math.floor(window.innerWidth / visible.length);
  const workH = window.innerHeight - MENU_BAR_HEIGHT - TASKBAR_HEIGHT;
  const startY = MENU_BAR_HEIGHT;

  visible.forEach((win, i) => {
    store.moveWindow(win.id, i * workW, startY);
    store.resizeWindow(win.id, workW, workH);
  });
}

/** Tile visible windows vertically (rows) */
function tileVertical() {
  const store = useWindowManager.getState();
  const visible = store.windows.filter((w) => !w.isMinimized);
  if (visible.length === 0) return;

  const workH = Math.floor((window.innerHeight - MENU_BAR_HEIGHT - TASKBAR_HEIGHT) / visible.length);
  const workW = window.innerWidth;
  const startY = MENU_BAR_HEIGHT;

  visible.forEach((win, i) => {
    store.moveWindow(win.id, 0, startY + i * workH);
    store.resizeWindow(win.id, workW, workH);
  });
}

/* ── MenuBar ────────────────────────────────────────────────────────────── */

interface MenuBarProps {
  /** Called to show the splash/about screen */
  onShowSplash: () => void;
}

const MENU_ITEM_CLASS = cn(
  "px-3 py-0.5",
  "font-[family-name:var(--font-system)] text-[11px]",
  "text-[var(--color-text-primary)]",
  "cursor-default select-none",
  "border border-transparent",
  "hover:border-t-[var(--color-border-raised-light)]",
  "hover:border-l-[var(--color-border-raised-light)]",
  "hover:border-b-[var(--color-border-raised-dark)]",
  "hover:border-r-[var(--color-border-raised-dark)]",
  "focus:outline-none"
);

/**
 * MenuBar - The Windows 3.1-style menu bar at the top of the desktop.
 *
 * Menus:
 *   File — (currently just options stub)
 *   Help — About/Splash
 *   Window — Cascade, Tile H/V, Close All
 *   MCP — opens MCP gallery
 *   Agents — opens Agents window
 *   Artifacts — opens Artifacts (future)
 *   Submit a Skill — external link
 */
export function MenuBar({ onShowSplash }: MenuBarProps) {
  const closeAllWindows = useWindowManager((s) => s.closeAllWindows);
  const windowCount = useWindowManager((s) => s.windows.filter((w) => !w.isMinimized).length);

  return (
    <div
      className={cn(
        "h-[22px] shrink-0 flex items-stretch",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-raised-dark)]"
      )}
      role="menubar"
      aria-label="Desktop menu bar"
    >
      {/* ── File menu ── */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <button className={MENU_ITEM_CLASS} aria-label="File menu">
            File
          </button>
        </Win31MenuTrigger>
        <Win31MenuContent side="bottom" align="start">
          <Win31MenuItem onSelect={() => openSearchWindow()}>
            Find Skills...
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={() => closeAllWindows()}>
            Close All Windows
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>

      {/* ── Window menu ── */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <button
            className={MENU_ITEM_CLASS}
            aria-label="Window menu"
          >
            Window
          </button>
        </Win31MenuTrigger>
        <Win31MenuContent side="bottom" align="start">
          <Win31MenuItem
            onSelect={() => cascadeWindows()}
            disabled={windowCount === 0}
          >
            Cascade
          </Win31MenuItem>
          <Win31MenuItem
            onSelect={() => tileHorizontal()}
            disabled={windowCount === 0}
          >
            Tile Horizontally
          </Win31MenuItem>
          <Win31MenuItem
            onSelect={() => tileVertical()}
            disabled={windowCount === 0}
          >
            Tile Vertically
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem
            onSelect={() => closeAllWindows()}
            disabled={windowCount === 0}
          >
            Close All
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>

      {/* ── MCPs menu ── */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <button className={MENU_ITEM_CLASS} aria-label="MCPs menu">
            MCPs
          </button>
        </Win31MenuTrigger>
        <Win31MenuContent side="bottom" align="start">
          <Win31MenuItem onSelect={() => openMcpWindow()}>
            MCP Gallery
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={() => openAgentsWindow()}>
            Founding Agents
          </Win31MenuItem>
          <Win31MenuItem onSelect={() => openBundlesWindow()}>
            Skill Bundles
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>

      {/* ── Artifacts menu ── */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <button className={MENU_ITEM_CLASS} aria-label="Artifacts menu">
            Artifacts
          </button>
        </Win31MenuTrigger>
        <Win31MenuContent side="bottom" align="start">
          <Win31MenuItem disabled>
            Coming soon...
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>

      {/* ── Submit a Skill ── */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <button className={MENU_ITEM_CLASS} aria-label="Submit a Skill">
            Submit a Skill
          </button>
        </Win31MenuTrigger>
        <Win31MenuContent side="bottom" align="start">
          <Win31MenuItem
            onSelect={() => {
              window.open(
                "https://github.com/erichowens/some_claude_skills/issues/new?template=skill-submission.md",
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Submit via GitHub Issue...
          </Win31MenuItem>
          <Win31MenuItem
            onSelect={() => {
              window.open(
                "https://someclaudeskills.com",
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Visit someclaudeskills.com
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem onSelect={() => openChangelogWindow()}>
            {"What's New"}
          </Win31MenuItem>
          <Win31MenuItem onSelect={() => openFavoritesWindow()}>
            Starred Skills
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>

      {/* ── Help menu ── */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <button className={MENU_ITEM_CLASS} aria-label="Help menu">
            Help
          </button>
        </Win31MenuTrigger>
        <Win31MenuContent side="bottom" align="start">
          <Win31MenuItem onSelect={() => onShowSplash()}>
            About Some Claude Skills...
          </Win31MenuItem>
          <Win31MenuSeparator />
          <Win31MenuItem
            onSelect={() => {
              window.open(
                "https://someclaudeskills.com",
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            someclaudeskills.com
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>
    </div>
  );
}
