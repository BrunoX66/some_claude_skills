"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { useWindowManager } from "@/state/windowManager";
import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { MobileTitleBar } from "./MobileTitleBar";
import { MobileMenuBar } from "./MobileMenuBar";
import { MobileIconGrid } from "./MobileIconGrid";
import { useExplorationProgress } from "@/hooks/useExplorationProgress";
import { useSkillsData } from "@/state/skillsData";
import type { ProgramGroup } from "./SkillsManagerWindow";
import type { LayoutMode } from "@/hooks/useViewport";
import type { WindowState } from "@/state/windowManager";

type AnimPhase = "home" | "entering" | "active" | "exiting";

interface MobileShellProps {
  layoutMode: LayoutMode;
  /** Render function for window content — shared with Desktop.tsx */
  renderWindowContent: (win: WindowState) => ReactNode;
}

/**
 * MobileShell — The pocket organizer layout for mobile devices.
 *
 * Structure:
 *   ┌─────────────────────────┐
 *   │ Navy title bar + time   │  44px, fixed top
 *   ├─────────────────────────┤
 *   │  Icon Grid (home)       │  scrollable
 *   │  OR                     │
 *   │  Active Window (full)   │  fullscreen content
 *   ├─────────────────────────┤
 *   │ [Back] [Home] [Menu]    │  44px, fixed bottom
 *   └─────────────────────────┘
 *
 * One window at a time. Tap icon → opens fullscreen. Back/Home → returns to grid.
 */
export function MobileShell({ layoutMode, renderWindowContent }: MobileShellProps) {
  const windows = useWindowManager(useShallow((s) => s.windows));
  const closeWindow = useWindowManager((s) => s.closeWindow);

  // The active window to display fullscreen (topmost non-minimized)
  const activeWindow = windows
    .filter((w) => !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0] ?? null;

  // Animation state machine
  const [animPhase, setAnimPhase] = useState<AnimPhase>("home");
  const lastWindowRef = useRef<WindowState | null>(null);
  const prevActiveRef = useRef<WindowState | null>(null);

  // Track window transitions for animations
  useEffect(() => {
    const prev = prevActiveRef.current;
    prevActiveRef.current = activeWindow;

    if (!prev && activeWindow) {
      // null → window: entering
      lastWindowRef.current = activeWindow;
      setAnimPhase("entering");
    } else if (prev && !activeWindow) {
      // window → null: exiting (lastWindowRef already holds the window)
      setAnimPhase("exiting");
    } else if (activeWindow) {
      // window → different window: snap to active
      lastWindowRef.current = activeWindow;
      setAnimPhase("active");
    }
  }, [activeWindow]);

  const handleAnimationEnd = useCallback(() => {
    if (animPhase === "entering") {
      setAnimPhase("active");
    } else if (animPhase === "exiting") {
      lastWindowRef.current = null;
      setAnimPhase("home");
    }
  }, [animPhase]);

  // Bottom sheet menu state
  const [menuOpen, setMenuOpen] = useState(false);

  /* ─── Gesture handling ─────────────────────────────────────────────── */

  const SWIPE_DISTANCE = 50;
  const SWIPE_VELOCITY = 0.3;
  const TOP_ZONE = 80;

  const swipeStartRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!swipeStartRef.current || !activeWindow) return;
      const start = swipeStartRef.current;
      swipeStartRef.current = null;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const dt = Math.max(1, e.timeStamp - start.t);
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const vx = absDx / dt;
      const vy = absDy / dt;

      const isHorizontal = absDx > absDy;
      const isVertical = absDy > absDx;

      // Swipe left → close window
      if (isHorizontal && dx < 0) {
        const hasDistance = absDx >= SWIPE_DISTANCE;
        const hasFastFlick = vx >= SWIPE_VELOCITY;
        if (hasDistance || hasFastFlick) {
          closeWindow(activeWindow.id);
          return;
        }
      }

      // Swipe down from top zone → return to home grid
      if (isVertical && dy > 0 && start.y < TOP_ZONE) {
        const hasDistance = absDy >= SWIPE_DISTANCE;
        const hasFastFlick = vy >= SWIPE_VELOCITY;
        if (hasDistance || hasFastFlick) {
          const { windows: allWins, closeWindow: close } = useWindowManager.getState();
          allWins.forEach((w) => close(w.id));
          return;
        }
      }
    },
    [activeWindow, closeWindow]
  );

  /* ─── Navigation ───────────────────────────────────────────────────── */

  const handleBack = useCallback(() => {
    if (activeWindow) {
      closeWindow(activeWindow.id);
    }
  }, [activeWindow, closeWindow]);

  const handleHome = useCallback(() => {
    const { windows: allWindows, closeWindow: close } = useWindowManager.getState();
    allWindows.forEach((w) => close(w.id));
    setMenuOpen(false);
  }, []);

  const handleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleOpenItem = useCallback((group: ProgramGroup) => {
    setMenuOpen(false);
    group.onOpen();
  }, []);

  /* ─── Title + exploration counter ────────────────────────────────── */

  const title = activeWindow ? activeWindow.title : "Skills";
  const { exploredCount } = useExplorationProgress();
  const totalSkills = useSkillsData((s) => s.skills.length);
  // Show exploration counter only on home screen
  const explorationLabel = !activeWindow && totalSkills > 0
    ? `${exploredCount}/${totalSkills}`
    : undefined;

  /* ─── Determine what to render ─────────────────────────────────────── */

  // During exit, render the last window's content (the "ghost")
  const showWindow = animPhase === "entering" || animPhase === "active" || animPhase === "exiting";
  const windowToRender = animPhase === "exiting" ? lastWindowRef.current : activeWindow;

  /* ─── Render ───────────────────────────────────────────────────────── */

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-surface)]">
      <MobileTitleBar title={title} rightContent={explorationLabel} />

      {/* Content area */}
      <div
        className="flex-1 min-h-0 relative"
        onPointerDown={activeWindow ? handlePointerDown : undefined}
        onPointerUp={activeWindow ? handlePointerUp : undefined}
      >
        {/* Icon grid — visible during home + entering + exiting */}
        {(animPhase === "home" || animPhase === "entering" || animPhase === "exiting") && (
          <MobileIconGrid layoutMode={layoutMode} onOpenItem={handleOpenItem} />
        )}

        {/* Window — slides in/out over the grid */}
        {showWindow && windowToRender && (
          <div
            className="absolute inset-0 overflow-auto bg-[var(--color-surface)]"
            style={{
              animation:
                animPhase === "entering"
                  ? "mobile-slide-in-right 250ms ease-out forwards"
                  : animPhase === "exiting"
                    ? "mobile-slide-out-left 200ms ease-in forwards"
                    : undefined,
            }}
            onAnimationEnd={handleAnimationEnd}
          >
            {renderWindowContent(windowToRender)}
          </div>
        )}
      </div>

      <MobileMenuBar
        hasActiveWindow={!!activeWindow}
        onBack={handleBack}
        onHome={handleHome}
        onMenu={handleMenu}
      />

      {/* Bottom sheet menu overlay */}
      {menuOpen && (
        <MobileBottomSheet
          onClose={() => setMenuOpen(false)}
          onOpenItem={handleOpenItem}
        />
      )}
    </div>
  );
}

/* ── Bottom sheet (Start menu equivalent) ──────────────────────────────── */

import {
  openSkillsBrowserWindow,
  openFavoritesWindow,
  openBundlesWindow,
  openTutorialsWindow,
  openArtifactsWindow,
  openChangelogWindow,
  openSettingsWindow,
  openWelcomeWindow,
  openFeaturedWindow,
  openMcpWindow,
  openAgentsWindow,
  openSearchWindow,
} from "@/lib/windowHelpers";
const MENU_ITEMS = [
  { label: "Find Skills",  onOpen: openSearchWindow },
  { label: "Skills",       onOpen: openSkillsBrowserWindow },
  { label: "Favorites",    onOpen: openFavoritesWindow },
  { label: "Bundles",      onOpen: openBundlesWindow },
  { label: "Tutorials",    onOpen: openTutorialsWindow },
  { label: "Artifacts",    onOpen: openArtifactsWindow },
  { label: "MCPs",         onOpen: openMcpWindow },
  { label: "Agents",       onOpen: openAgentsWindow },
  { label: "Featured",     onOpen: openFeaturedWindow },
  { label: "What's New",   onOpen: openChangelogWindow },
  { label: "Welcome",      onOpen: openWelcomeWindow },
  { label: "Settings",     onOpen: openSettingsWindow },
];

function MobileBottomSheet({
  onClose,
  onOpenItem,
}: {
  onClose: () => void;
  onOpenItem: (group: ProgramGroup) => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  const animatedClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  // Focus first item on mount; trap Escape key
  useEffect(() => {
    const first = sheetRef.current?.querySelector("button");
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        animatedClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [animatedClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[9998]"
        aria-hidden="true"
        onClick={animatedClose}
        style={{
          animation: closing
            ? "mobile-fade-out 200ms ease-in forwards"
            : "mobile-fade-in 200ms ease-out forwards",
        }}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Application menu"
        className={cn(
          "fixed bottom-[var(--win31-touch-target)] left-0 right-0 z-[9999]",
          "max-h-[70vh] overflow-y-auto",
          "bg-[var(--color-surface)]",
          "border-t-2 border-t-[var(--color-border-raised-light)]",
          "shadow-[0_-4px_12px_rgba(0,0,0,0.3)]"
        )}
        style={{
          animation: closing
            ? "mobile-slide-down 200ms ease-in forwards"
            : "mobile-slide-up 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        <div className="p-2">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full text-left px-4 py-3",
                "min-h-[var(--win31-touch-target)]",
                "flex items-center",
                "font-[family-name:var(--font-system)] text-sm",
                "text-[var(--color-text-primary)]",
                "active:bg-[var(--color-titlebar-active)]",
                "active:text-[var(--color-titlebar-text)]",
                "active:scale-[0.98] transition-transform duration-75",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
                "focus-visible:outline-[var(--color-text-primary)]",
                "border-b border-b-[var(--color-border-raised-dark)]"
              )}
              onClick={() => {
                item.onOpen();
                animatedClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
