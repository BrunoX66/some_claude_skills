"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface InstallCelebrationProps {
  /** The skill name that was just installed */
  skillName: string;
  /** Number of skills explored so far */
  exploredCount: number;
  /** Total number of available skills */
  totalSkills: number;
  /** Called when the dialog should close */
  onDismiss: () => void;
}

/**
 * Win31-style celebration dialog shown after copying an install command.
 *
 * ┌─ Skill Installed ──────────────┐
 * │ ████████████████████████ 100%  │
 * │ "skill-name" copied!           │
 * │ 47 of 192 skills explored      │
 * │          [ OK ]                 │
 * └────────────────────────────────┘
 */
export function InstallCelebration({
  skillName,
  exploredCount,
  totalSkills,
  onDismiss,
}: InstallCelebrationProps) {
  // Auto-dismiss after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[10000]"
        aria-hidden="true"
        onClick={onDismiss}
        style={{ animation: "mobile-fade-in 200ms ease-out forwards" }}
      />

      {/* Dialog — centered */}
      <div
        role="alertdialog"
        aria-label="Skill installed"
        className={cn(
          "fixed z-[10001] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[min(320px,90vw)]",
          "bg-[var(--color-surface)]",
          "border-2",
          "border-t-[var(--color-border-raised-light)]",
          "border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)]",
          "border-r-[var(--color-border-raised-dark)]",
          "shadow-[4px_4px_0_var(--color-shadow)]"
        )}
        style={{ animation: "mobile-fade-in 200ms ease-out forwards" }}
      >
        {/* Title bar — navy gradient */}
        <div
          className={cn(
            "h-6 flex items-center px-2",
            "font-[family-name:var(--font-window)] text-[11px] font-bold",
            "text-[var(--color-titlebar-text)]",
            "select-none"
          )}
          style={{
            background:
              "linear-gradient(90deg, var(--color-titlebar-active), var(--color-titlebar-end, #4040c0))",
          }}
        >
          Skill Installed
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Progress bar */}
          <div
            className={cn(
              "h-4 w-full",
              "bg-[var(--color-surface-inset)]",
              "border",
              "border-t-[var(--color-border-inset-dark)]",
              "border-l-[var(--color-border-inset-dark)]",
              "border-b-[var(--color-border-raised-light)]",
              "border-r-[var(--color-border-raised-light)]",
              "overflow-hidden"
            )}
          >
            <div
              className="h-full bg-[var(--color-titlebar-active)]"
              style={{
                animation: "celebration-progress 800ms ease-out forwards",
              }}
            />
          </div>

          {/* Skill name */}
          <p
            className={cn(
              "font-[family-name:var(--font-system)] text-xs text-center",
              "text-[var(--color-text-primary)]"
            )}
          >
            &ldquo;{skillName}&rdquo; copied!
          </p>

          {/* Exploration count */}
          <p
            className={cn(
              "font-[family-name:var(--font-system)] text-[10px] text-center",
              "text-[var(--color-text-muted)]"
            )}
          >
            {exploredCount} of {totalSkills} skills explored
          </p>

          {/* OK button — centered, beveled */}
          <div className="flex justify-center pt-1">
            <button
              onClick={onDismiss}
              className={cn(
                "min-w-[75px] px-4 py-1",
                "font-[family-name:var(--font-system)] text-xs font-bold",
                "bg-[var(--color-surface-raised)]",
                "text-[var(--color-text-primary)]",
                "border-2",
                "border-t-[var(--color-border-raised-light)]",
                "border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)]",
                "border-r-[var(--color-border-raised-dark)]",
                "active:border-t-[var(--color-border-raised-dark)]",
                "active:border-l-[var(--color-border-raised-dark)]",
                "active:border-b-[var(--color-border-raised-light)]",
                "active:border-r-[var(--color-border-raised-light)]",
                "cursor-pointer select-none"
              )}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
