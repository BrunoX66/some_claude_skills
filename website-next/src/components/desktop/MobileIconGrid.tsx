"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FolderIcon } from "./FolderIcon";
import {
  PROGRAM_GROUPS,
  type ProgramGroup,
} from "./SkillsManagerWindow";
import { useSkillsData } from "@/state/skillsData";
import { useExplorationProgress } from "@/hooks/useExplorationProgress";
import { openSkillDetails } from "@/lib/windowHelpers";
import type { LayoutMode } from "@/hooks/useViewport";

interface MobileIconGridProps {
  layoutMode: LayoutMode;
  onOpenItem: (group: ProgramGroup) => void;
}

/**
 * MobileIconGrid - The "home screen" for pocket/PDA mode.
 * Renders PROGRAM_GROUPS + STARTUP_ITEMS as a touch-friendly icon grid.
 * 2 columns on pocket (<400px), 3 columns on PDA (400-640px).
 */
export function MobileIconGrid({ layoutMode, onOpenItem }: MobileIconGridProps) {
  const cols = layoutMode === "pocket" ? 2 : 3;

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto",
        "bg-[var(--color-surface-inset)]",
        "p-[var(--win31-desktop-padding)]"
      )}
    >
      {/* Quick-pick suggestion */}
      <QuickPick />

      {/* Main program groups */}
      <div
        className="grid gap-3 mb-4"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {PROGRAM_GROUPS.map((group) => (
          <GridItem key={group.id} group={group} onTap={onOpenItem} />
        ))}
      </div>

      {/* Startup is now a folder icon in PROGRAM_GROUPS — opens its own window */}
    </div>
  );
}

/* ── Quick-pick suggestion — addresses ADHD decision paralysis ─────────── */

function QuickPick() {
  const skills = useSkillsData((s) => s.skills);
  const { exploredIds, exploredCount } = useExplorationProgress();

  // Pick a random unexplored skill, stable per mount via useState initializer
  const [suggestion, setSuggestion] = useState(() => {
    const unexplored = skills.filter((s) => !exploredIds.has(s.id));
    if (unexplored.length === 0) return null;
    return unexplored[Math.floor(Math.random() * unexplored.length)];
  });

  const shuffleNext = useCallback(() => {
    const unexplored = skills.filter((s) => !exploredIds.has(s.id));
    if (unexplored.length === 0) {
      setSuggestion(null);
      return;
    }
    setSuggestion(unexplored[Math.floor(Math.random() * unexplored.length)]);
  }, [skills, exploredIds]);

  // All explored — congratulations
  if (!suggestion || skills.length === 0) {
    if (exploredCount > 0 && exploredCount >= skills.length) {
      return (
        <div
          className={cn(
            "mb-4 p-3 text-center",
            "bg-[var(--color-surface)]",
            "border-2",
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]"
          )}
        >
          <p className="font-[family-name:var(--font-system)] text-xs font-bold text-[var(--color-text-accent)]">
            All {skills.length} skills explored!
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={cn(
        "w-full mb-4 p-3",
        "flex items-center gap-3",
        "bg-[var(--color-surface)]",
        "border-2",
        "border-t-[var(--color-border-raised-light)]",
        "border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)]",
        "border-r-[var(--color-border-raised-dark)]"
      )}
    >
      <button
        className={cn(
          "flex items-center gap-3 flex-1 min-w-0 text-left",
          "active:scale-[0.98] transition-transform duration-100",
          "cursor-pointer bg-transparent border-none p-0"
        )}
        onClick={() => openSkillDetails(suggestion.id, suggestion.title)}
      >
        <FolderIcon category={suggestion.category} size={32} />
        <div className="flex-1 min-w-0">
          <p className="font-[family-name:var(--font-system)] text-[9px] uppercase tracking-wide text-[var(--color-text-muted)]">
            Try this one
          </p>
          <p className="font-[family-name:var(--font-system)] text-xs font-bold text-[var(--color-text-primary)] truncate">
            {suggestion.title}
          </p>
        </div>
      </button>
      <button
        className={cn(
          "px-2 py-1 shrink-0",
          "font-[family-name:var(--font-system)] text-[10px] font-bold",
          "bg-[var(--color-surface-raised)]",
          "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
          "text-[var(--color-text-primary)]",
          "cursor-pointer"
        )}
        onClick={shuffleNext}
      >
        Next
      </button>
    </div>
  );
}

/* ── Individual grid item ─────────────────────────────────────────────────── */

function GridItem({
  group,
  onTap,
}: {
  group: ProgramGroup;
  onTap: (g: ProgramGroup) => void;
}) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 py-3 px-2",
        "min-h-[var(--win31-touch-target)]",
        "bg-[var(--color-surface)]",
        "border",
        "border-t-[var(--color-border-raised-light)]",
        "border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)]",
        "border-r-[var(--color-border-raised-dark)]",
        "active:border-t-[var(--color-border-raised-dark)]",
        "active:border-l-[var(--color-border-raised-dark)]",
        "active:border-b-[var(--color-border-raised-light)]",
        "active:border-r-[var(--color-border-raised-light)]",
        "active:scale-[0.95] transition-transform duration-100",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
        "focus-visible:outline-[var(--color-text-primary)]",
        "cursor-pointer select-none"
      )}
      onClick={() => onTap(group)}
      aria-label={`Open ${group.label}`}
    >
      <FolderIcon category={group.category} size={40} />
      <span
        className={cn(
          "text-[11px] font-bold text-center leading-tight",
          "font-[family-name:var(--font-system)]",
          "text-[var(--color-text-primary)]"
        )}
      >
        {group.label}
      </span>
      <span
        className={cn(
          "text-[10px] text-center leading-tight",
          "font-[family-name:var(--font-system)]",
          "text-[var(--color-gray-700)]"
        )}
      >
        {group.sublabel}
      </span>
    </button>
  );
}
