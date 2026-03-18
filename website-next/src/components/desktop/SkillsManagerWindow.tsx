"use client";

import { useState, useCallback } from "react";
import { Win31Window } from "@/components/win31";
import { FolderIcon } from "./FolderIcon";
import {
  openSkillsBrowserWindow,
  openFavoritesWindow,
  openMediaWindow,
  openBundlesWindow,
  openTutorialsWindow,
  openArtifactsWindow,
  openBrowserWindow,
  openWelcomeWindow,
  openFeaturedWindow,
  openAboutWindow,
  openStartupWindow,
} from "@/lib/windowHelpers";
import { cn } from "@/lib/utils";

/* ── Program group definitions ───────────────────────────────────────────── */

export interface ProgramGroup {
  id:       string;
  label:    string;
  sublabel: string;
  category: string;       // used by FolderIcon for color
  onOpen:   () => void;
}

export const PROGRAM_GROUPS: ProgramGroup[] = [
  {
    id:       "skills",
    label:    "SKILLS",
    sublabel: "Browse skills",
    category: "AI & Machine Learning",  // teal-ish
    onOpen:   openSkillsBrowserWindow,
  },
  {
    id:       "favorites",
    label:    "FAVORITES",
    sublabel: "Starred skills",
    category: "Lifestyle & Personal",   // warm amber
    onOpen:   openFavoritesWindow,
  },
  {
    id:       "media",
    label:    "MEDIA",
    sublabel: "Paint · Winamp",
    category: "Design & Creative",      // gold
    onOpen:   openMediaWindow,
  },
  {
    id:       "bundles",
    label:    "BUNDLES",
    sublabel: "Skill bundles",
    category: "Productivity & Meta",    // purple
    onOpen:   openBundlesWindow,
  },
  {
    id:       "tutorials",
    label:    "TUTORIALS",
    sublabel: "Learn & apply",
    category: "Code Quality & Testing", // green
    onOpen:   openTutorialsWindow,
  },
  {
    id:       "artifacts",
    label:    "ARTIFACTS",
    sublabel: "Best examples",
    category: "Security & DevSecOps",   // red
    onOpen:   openArtifactsWindow,
  },
  {
    id:       "startup",
    label:    "STARTUP",
    sublabel: "Auto-launch",
    category: "Content & Writing",      // warm
    onOpen:   openStartupWindow,
  },
];

/** Startup folder shortcuts — these open on click, not full windows */
export const STARTUP_ITEMS: ProgramGroup[] = [
  {
    id:       "startup-ie",
    label:    "Internet Explorer",
    sublabel: "Browse web",
    category: "DevOps & Infrastructure",  // blue
    onOpen:   () => openBrowserWindow(),
  },
  {
    id:       "startup-welcome",
    label:    "Welcome",
    sublabel: "Intro & guide",
    category: "Content & Writing",         // warm
    onOpen:   openWelcomeWindow,
  },
  {
    id:       "startup-featured",
    label:    "Featured",
    sublabel: "Top picks",
    category: "Business & Monetization",   // gold
    onOpen:   openFeaturedWindow,
  },
  {
    id:       "startup-about",
    label:    "About",
    sublabel: "This site",
    category: "Productivity & Meta",       // purple
    onOpen:   openAboutWindow,
  },
];

/* ── Shared folder button ─────────────────────────────────────────────────── */

function GroupButton({
  group,
  isSelected,
  size = 44,
  onSelect,
}: {
  group: ProgramGroup;
  isSelected: boolean;
  size?: number;
  onSelect: (group: ProgramGroup) => void;
}) {
  return (
    <button
      className={cn(
        "flex flex-col items-center gap-1 p-1.5",
        size === 44 ? "w-[72px]" : "w-[60px]",
        "cursor-pointer select-none focus:outline-none rounded-none",
        isSelected && [
          "bg-[var(--color-titlebar-active)]",
          "text-[var(--color-titlebar-text)]",
        ]
      )}
      onClick={(e) => { e.stopPropagation(); onSelect(group); }}
      aria-label={`Open ${group.label}`}
    >
      <FolderIcon
        category={group.category}
        isOpen={false}
        size={size}
      />
      <span className={cn(
        "text-center leading-tight font-[family-name:var(--font-system)]",
        size === 44 ? "text-[10px] font-bold" : "text-[9px] font-bold",
        isSelected
          ? "text-[var(--color-titlebar-text)]"
          : "text-[var(--color-text-primary)]"
      )}>
        {group.label}
      </span>
      <span className={cn(
        "text-[8px] font-[family-name:var(--font-system)] text-center leading-tight",
        isSelected
          ? "text-[var(--color-titlebar-text)] opacity-80"
          : "text-[var(--color-text-muted)]"
      )}>
        {group.sublabel}
      </span>
    </button>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */

interface SkillsManagerWindowProps {
  zIndex?: number;
  isActive?: boolean;
  onFocus?: () => void;
}

/**
 * SkillsManagerWindow - The Win3.1 Program Manager main window.
 *
 * Two sections:
 * - Main: SKILLS · FAVORITES · MEDIA · BUNDLES · TUTORIALS · ARTIFACTS
 * - Startup: Internet Explorer · Welcome · Featured · About
 */
export function SkillsManagerWindow({ zIndex, isActive, onFocus }: SkillsManagerWindowProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClick = useCallback((group: ProgramGroup) => {
    setSelected(group.id);
    group.onOpen();
  }, []);

  return (
    <Win31Window
      title="Skills - Program Manager"
      initialX={20}
      initialY={20}
      initialWidth={540}
      initialHeight={320}
      zIndex={zIndex}
      isActive={isActive}
      isMinimized={isMinimized}
      onMinimize={() => setIsMinimized(true)}
      onRestore={() => setIsMinimized(false)}
      onMaximize={() => {}}
      onFocus={onFocus}
      showSystemMenu={true}
    >
      <div
        className={cn(
          "flex flex-col h-full",
          "bg-[var(--color-surface-inset)]",
          "overflow-y-auto"
        )}
        onClick={() => setSelected(null)}
      >
        {/* ── Main program groups ── */}
        <div className={cn(
          "p-3 border-b-2 border-[var(--color-border-raised-dark)]",
          "bg-[var(--color-surface)]"
        )}>
          <div className="flex flex-wrap gap-x-4 gap-y-4">
            {PROGRAM_GROUPS.map((group) => (
              <GroupButton
                key={group.id}
                group={group}
                isSelected={selected === group.id}
                size={44}
                onSelect={handleClick}
              />
            ))}
          </div>
        </div>

        {/* Startup is now a folder icon in PROGRAM_GROUPS — opens its own window */}
      </div>
    </Win31Window>
  );
}
