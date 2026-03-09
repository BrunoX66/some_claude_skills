"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useWindowManager,
  useMinimizedWindows,
} from "@/state/windowManager";
import {
  Win31Button,
  Win31Menu,
  Win31MenuTrigger,
  Win31MenuContent,
  Win31MenuItem,
  Win31MenuSeparator,
} from "@/components/win31";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { openChangelogWindow, openSearchWindow } from "@/lib/windowHelpers";
import { cn } from "@/lib/utils";

interface TaskbarProps {
  /** Sorted list of category names for the start menu */
  categories: string[];
  /** Called when a category is clicked in the start menu */
  onCategoryClick?: (category: string) => void;
  /** Called to open the About dialog */
  onAboutClick?: () => void;
}

/**
 * Taskbar - The bottom bar of the Win31 desktop.
 *
 * Modeled after the Windows 3.1 Program Manager bottom area with:
 * - A "Skills" start button (dropdown menu with categories + actions)
 * - Minimized window buttons (click to restore)
 * - ThemeSwitcher on the right
 * - Clock display
 */
export function Taskbar({
  categories,
  onCategoryClick,
  onAboutClick,
}: TaskbarProps) {
  const minimizedWindows = useMinimizedWindows();
  const restoreWindow = useWindowManager((s) => s.restoreWindow);
  const focusWindow = useWindowManager((s) => s.focusWindow);
  const windows = useWindowManager((s) => s.windows);
  const activeWindowId = useWindowManager((s) => s.activeWindowId);

  // Clock state
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 30_000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const handleWindowButton = useCallback(
    (id: string, isMinimized: boolean) => {
      if (isMinimized) {
        restoreWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [restoreWindow, focusWindow]
  );

  // Format category for display
  const formatCategory = (cat: string) =>
    cat
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={cn(
        "h-[var(--win31-taskbar-height)] shrink-0",
        "flex items-center gap-1 px-1",
        "bg-[var(--color-surface)]",
        // Top raised border
        "border-t-2",
        "border-t-[var(--color-border-raised-light)]"
      )}
    >
      {/* Start button with dropdown menu */}
      <Win31Menu>
        <Win31MenuTrigger asChild>
          <div>
            <Win31Button size="sm" variant="default" className="font-bold">
              Skills
            </Win31Button>
          </div>
        </Win31MenuTrigger>
        <Win31MenuContent side="top" align="start">
          {/* Search */}
          <Win31MenuItem onSelect={() => openSearchWindow()}>
            Find...
          </Win31MenuItem>

          <Win31MenuSeparator />

          {/* Categories */}
          {categories.slice(0, 12).map((cat) => (
            <Win31MenuItem
              key={cat}
              onSelect={() => onCategoryClick?.(cat)}
            >
              {formatCategory(cat)}
            </Win31MenuItem>
          ))}
          {categories.length > 12 && (
            <Win31MenuItem disabled>
              ...{categories.length - 12} more
            </Win31MenuItem>
          )}

          <Win31MenuSeparator />

          {/* Actions */}
          <Win31MenuItem onSelect={() => openChangelogWindow()}>
            {"What's New"}
          </Win31MenuItem>
          <Win31MenuItem onSelect={() => onAboutClick?.()}>
            About...
          </Win31MenuItem>
        </Win31MenuContent>
      </Win31Menu>

      {/* Separator */}
      <div
        className={cn(
          "w-px h-5",
          "border-l border-l-[var(--color-border-inset-light)]",
          "border-r border-r-[var(--color-border-inset-dark)]"
        )}
      />

      {/* Window buttons area */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0">
        {windows.map((win) => {
          const isActive = win.id === activeWindowId && !win.isMinimized;
          return (
            <button
              key={win.id}
              onClick={() => handleWindowButton(win.id, win.isMinimized)}
              className={cn(
                "h-[22px] max-w-[160px] min-w-[80px] px-2",
                "text-[10px] truncate text-left",
                "font-[family-name:var(--font-system)]",
                "border-2 cursor-pointer shrink-0",
                isActive
                  ? [
                      // Active/pressed appearance
                      "bg-[var(--color-surface)]",
                      "text-[var(--color-text-primary)]",
                      "border-t-[var(--color-border-raised-dark)]",
                      "border-l-[var(--color-border-raised-dark)]",
                      "border-b-[var(--color-border-raised-light)]",
                      "border-r-[var(--color-border-raised-light)]",
                    ].join(" ")
                  : [
                      // Inactive/raised appearance
                      "bg-[var(--color-surface)]",
                      "text-[var(--color-text-primary)]",
                      "border-t-[var(--color-border-raised-light)]",
                      "border-l-[var(--color-border-raised-light)]",
                      "border-b-[var(--color-border-raised-dark)]",
                      "border-r-[var(--color-border-raised-dark)]",
                    ].join(" "),
                win.isMinimized && "opacity-70"
              )}
              title={win.title}
              aria-label={`${win.isMinimized ? "Restore" : "Focus"} ${win.title}`}
            >
              {win.title}
            </button>
          );
        })}
      </div>

      {/* Right section: Theme + Clock */}
      <div className="flex items-center gap-2 shrink-0">
        <ThemeSwitcher />

        {/* Separator */}
        <div
          className={cn(
            "w-px h-5",
            "border-l border-l-[var(--color-border-inset-light)]",
            "border-r border-r-[var(--color-border-inset-dark)]"
          )}
        />

        {/* Clock */}
        <div
          className={cn(
            "px-2 py-0.5",
            "border",
            "border-t-[var(--color-border-inset-light)]",
            "border-l-[var(--color-border-inset-light)]",
            "border-b-[var(--color-border-inset-dark)]",
            "border-r-[var(--color-border-inset-dark)]",
            "font-[family-name:var(--font-system)]",
            "text-[10px]",
            "text-[var(--color-text-primary)]",
            "min-w-[60px] text-center"
          )}
        >
          {time || "\u00A0"}
        </div>
      </div>
    </div>
  );
}
