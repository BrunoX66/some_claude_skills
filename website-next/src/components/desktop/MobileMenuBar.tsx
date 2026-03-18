"use client";

import { cn } from "@/lib/utils";

interface MobileMenuBarProps {
  /** Whether a window is currently open (show Back button) */
  hasActiveWindow: boolean;
  onBack: () => void;
  onHome: () => void;
  onMenu: () => void;
}

/**
 * MobileMenuBar - Bottom navigation bar for pocket/PDA mode.
 * 44px tall, fixed at bottom. Three buttons: Back, Home, Menu.
 * Uses Unicode symbols instead of emojis (per project rules).
 */
export function MobileMenuBar({
  hasActiveWindow,
  onBack,
  onHome,
  onMenu,
}: MobileMenuBarProps) {
  const btnClasses = cn(
    "flex-1 flex items-center justify-center",
    "h-[var(--win31-touch-target)]",
    "font-[family-name:var(--font-system)] text-xs font-bold",
    "text-[var(--color-text-primary)]",
    "active:bg-[var(--color-titlebar-active)] active:text-[var(--color-titlebar-text)]",
    "active:scale-95 transition-transform duration-75",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
    "focus-visible:outline-[var(--color-text-primary)]",
    "select-none cursor-pointer"
  );

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "shrink-0 flex",
        "bg-[var(--color-surface)]",
        "border-t-2",
        "border-t-[var(--color-border-raised-light)]",
      )}
    >
      <button
        className={cn(btnClasses, !hasActiveWindow && "opacity-40 pointer-events-none")}
        onClick={onBack}
        aria-label="Back"
      >
        <span className="text-base mr-1">{"\u25C0"}</span>
        Back
      </button>

      <div className="w-px bg-[var(--color-border-raised-dark)]" />

      <button className={btnClasses} onClick={onHome} aria-label="Home">
        <span className="text-base mr-1">{"\u25A0"}</span>
        Home
      </button>

      <div className="w-px bg-[var(--color-border-raised-dark)]" />

      <button className={btnClasses} onClick={onMenu} aria-label="Menu">
        <span className="text-base mr-1">{"\u2630"}</span>
        Menu
      </button>
    </nav>
  );
}
