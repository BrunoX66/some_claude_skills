"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWindowManager } from "@/state/windowManager";
import { Win31Background, Win31Window, Win31Dialog } from "@/components/win31";
import { openSkillWindow } from "@/lib/windowHelpers";
import { cn } from "@/lib/utils";
import { ProgramGroup } from "./ProgramGroup";
import { SkillWindow } from "./SkillWindow";
import { Taskbar } from "./Taskbar";
import type { Skill } from "@/types/skill";

/* ─── Constants ─────────────────────────────────────────────────────────── */

/** Number of categories to auto-expand on load */
const DEFAULT_OPEN_COUNT = 3;

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface DesktopProps {
  /** All skills, pre-loaded at build time */
  skills: Skill[];
  /** Sorted category names */
  categories: string[];
  /** Skills grouped by category */
  skillsByCategory: Record<string, Skill[]>;
  /** Optional skill id to open on mount (for deep links) */
  initialOpenSkill?: string;
}

/* ─── Desktop Component ─────────────────────────────────────────────────── */

/**
 * Desktop - The full Windows 3.1 Program Manager desktop shell.
 *
 * Full-viewport layout:
 *   - Win31Background as the base layer (themed desktop color)
 *   - Scrollable program groups area with categorized skill icons
 *   - Open windows (from Zustand store) overlaid absolutely on top
 *   - Taskbar fixed at the bottom with start menu, window buttons, theme, clock
 *
 * All window state is managed through the Zustand windowManager store.
 * Skills data is passed from the server component at build time.
 */
export function Desktop({
  skills,
  categories,
  skillsByCategory,
  initialOpenSkill,
}: DesktopProps) {
  /* ─── Window manager state ──────────────────────────────────────────── */

  const windows = useWindowManager((s) => s.windows);
  const activeWindowId = useWindowManager((s) => s.activeWindowId);
  const closeWindow = useWindowManager((s) => s.closeWindow);
  const focusWindow = useWindowManager((s) => s.focusWindow);
  const minimizeWindow = useWindowManager((s) => s.minimizeWindow);
  const maximizeWindow = useWindowManager((s) => s.maximizeWindow);
  const restoreWindow = useWindowManager((s) => s.restoreWindow);
  const moveWindow = useWindowManager((s) => s.moveWindow);
  const resizeWindow = useWindowManager((s) => s.resizeWindow);

  /* ─── About dialog state ────────────────────────────────────────────── */

  const [aboutOpen, setAboutOpen] = useState(false);

  /* ─── Scroll to category ────────────────────────────────────────────── */

  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = useCallback((category: string) => {
    const el = groupRefs.current[category];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  /* ─── Open initial skill on mount ───────────────────────────────────── */

  useEffect(() => {
    if (initialOpenSkill) {
      const skill = skills.find((s) => s.id === initialOpenSkill);
      if (skill) {
        openSkillWindow(skill.id, skill.title);
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Skill lookup helper ───────────────────────────────────────────── */

  const findSkill = useCallback(
    (id: string): Skill | undefined => skills.find((s) => s.id === id),
    [skills]
  );

  /* ─── Render window content ─────────────────────────────────────────── */

  const renderWindowContent = useCallback(
    (win: (typeof windows)[number]) => {
      switch (win.content.type) {
        case "skill": {
          const skill = findSkill(win.content.skillId);
          if (!skill) {
            return (
              <div className="p-4 font-[family-name:var(--font-system)] text-xs text-[var(--color-text-secondary)]">
                Skill not found: {win.content.skillId}
              </div>
            );
          }
          return <SkillWindow skill={skill} />;
        }
        case "changelog":
          return (
            <div className="p-4 font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
              <p className="font-bold mb-2 text-[var(--color-text-accent)]">
                {"What's New in Some Claude Skills"}
              </p>
              <p className="text-[var(--color-text-secondary)]">
                Changelog viewer coming soon.
              </p>
            </div>
          );
        case "search":
          return (
            <div className="p-4 font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
              <p className="font-bold mb-2 text-[var(--color-text-accent)]">
                Find Skills
              </p>
              <p className="text-[var(--color-text-secondary)]">
                Search functionality coming soon. Browse categories below.
              </p>
            </div>
          );
        case "about":
          return (
            <div className="p-4 font-[family-name:var(--font-system)] text-xs text-[var(--color-text-primary)]">
              <p className="font-bold text-[var(--color-text-accent)]">
                About Some Claude Skills
              </p>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                A curated gallery of Claude Code skills.
              </p>
            </div>
          );
        default:
          return (
            <div className="p-4 font-[family-name:var(--font-system)] text-xs text-[var(--color-text-secondary)]">
              Window content unavailable.
            </div>
          );
      }
    },
    [findSkill]
  );

  /* ─── Render ────────────────────────────────────────────────────────── */

  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        {/* Desktop area */}
        <Win31Background
          className={cn(
            "flex-1 relative overflow-hidden",
            "!min-h-0" // Override Win31Background's min-h-screen
          )}
        >
          {/* Program groups (scrollable icon area) */}
          <div className="absolute inset-0 overflow-y-auto p-[var(--win31-desktop-padding)]">
            {categories.map((category, idx) => (
              <div
                key={category}
                ref={(el) => {
                  groupRefs.current[category] = el;
                }}
              >
                <ProgramGroup
                  category={category}
                  skills={skillsByCategory[category] || []}
                  defaultOpen={idx < DEFAULT_OPEN_COUNT}
                />
              </div>
            ))}

            {/* Bottom spacer so content doesn't hide behind windows */}
            <div className="h-16" aria-hidden />
          </div>

          {/* Open windows (absolutely positioned, on top of groups) */}
          {windows.map((win) => (
            <Win31Window
              key={win.id}
              title={win.title}
              initialX={win.x}
              initialY={win.y}
              initialWidth={win.width}
              initialHeight={win.height}
              isActive={win.id === activeWindowId}
              zIndex={win.zIndex}
              isMinimized={win.isMinimized}
              isMaximized={win.isMaximized}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => maximizeWindow(win.id)}
              onRestore={() => restoreWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              onMove={(x, y) => moveWindow(win.id, x, y)}
              onResize={(w, h) => resizeWindow(win.id, w, h)}
            >
              {renderWindowContent(win)}
            </Win31Window>
          ))}
        </Win31Background>

        {/* Taskbar */}
        <Taskbar
          categories={categories}
          onCategoryClick={scrollToCategory}
          onAboutClick={() => setAboutOpen(true)}
        />
      </div>

      {/* About dialog (rendered outside the layout to avoid clipping) */}
      <Win31Dialog
        open={aboutOpen}
        onOpenChange={setAboutOpen}
        title="About Some Claude Skills"
        width="max-w-sm"
      >
        <div className="flex flex-col gap-3 text-center">
          <div
            className={cn(
              "text-lg font-bold",
              "font-[family-name:var(--font-window)]",
              "text-[var(--color-text-accent)]"
            )}
          >
            Some Claude Skills
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            Version 0.3.0
          </div>
          <div
            className={cn(
              "border-t border-b py-2 my-1",
              "border-t-[var(--color-border-inset-light)]",
              "border-b-[var(--color-border-inset-dark)]"
            )}
          >
            <p className="text-xs">
              A curated gallery of{" "}
              <strong className="text-[var(--color-text-accent)]">
                {skills.length}
              </strong>{" "}
              Claude Code skills across{" "}
              <strong className="text-[var(--color-text-accent)]">
                {categories.length}
              </strong>{" "}
              categories.
            </p>
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Built with Next.js, Zustand, and Radix UI.
            <br />
            Windows 3.1 aesthetic. Modern engineering.
          </p>
        </div>
      </Win31Dialog>
    </>
  );
}
