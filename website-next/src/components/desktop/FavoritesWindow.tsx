"use client";

import { useState } from "react";
import { Win31Panel, Win31StatusBar, StatusBarSection } from "@/components/win31";
import { cn } from "@/lib/utils";
import { useStarredSkills } from "@/hooks/useStarredSkills";
import { useSkillsData } from "@/state/skillsData";
import { useShallow } from "zustand/shallow";
import { openSkillWindow } from "@/lib/windowHelpers";
import type { Skill } from "@/types/skill";

/**
 * FavoritesWindow — grid of starred/favorited skills.
 * Reads from localStorage via useStarredSkills hook.
 */
export function FavoritesWindow() {
  const skills = useSkillsData(useShallow((s) => s.skills));
  const { starredIds } = useStarredSkills();
  const starred = skills.filter((s) => starredIds.has(s.id));

  if (starred.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <Win31Panel variant="inset" className="p-6 text-center max-w-[240px]">
            <div
              className={cn(
                "text-xs font-bold mb-1",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-accent)]"
              )}
            >
              No starred skills yet
            </div>
            <p
              className={cn(
                "text-[10px]",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-muted)]"
              )}
            >
              Open any skill and click the star to save it here.
            </p>
          </Win31Panel>
        </div>
        <Win31StatusBar>
          <StatusBarSection>0 starred skills</StatusBarSection>
        </Win31StatusBar>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
          {starred.map((skill) => (
            <FavoriteIcon key={skill.id} skill={skill} />
          ))}
        </div>
      </div>

      <Win31StatusBar>
        <StatusBarSection>
          {starred.length} starred skill{starred.length !== 1 ? "s" : ""}
        </StatusBarSection>
      </Win31StatusBar>
    </div>
  );
}

/* ─── FavoriteIcon ──────────────────────────────────────────── */

function FavoriteIcon({ skill }: { skill: Skill }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => openSkillWindow(skill.id, skill.title)}
      className={cn(
        "flex flex-col items-center gap-1 p-1 w-full",
        "cursor-pointer group focus:outline-none",
        "hover:bg-[var(--color-titlebar-active)]/10"
      )}
      aria-label={`Open ${skill.title}`}
      title={skill.description}
    >
      <div
        className={cn(
          "w-12 h-12 shrink-0",
          "border",
          "border-t-[var(--color-border-inset-light)]",
          "border-l-[var(--color-border-inset-light)]",
          "border-b-[var(--color-border-inset-dark)]",
          "border-r-[var(--color-border-inset-dark)]",
          "overflow-hidden bg-[var(--color-surface-inset)]"
        )}
      >
        {imgError ? (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              "bg-[var(--color-titlebar-active)]",
              "text-[var(--color-titlebar-text)]",
              "font-[family-name:var(--font-system)]",
              "text-base font-bold"
            )}
            aria-hidden
          >
            {skill.title
              .split(/[\s-]+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase() ?? "")
              .join("")}
          </div>
        ) : (
          <img
            src={skill.heroImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <span
        className={cn(
          "text-[10px] leading-tight text-center w-full line-clamp-2 px-0.5",
          "font-[family-name:var(--font-system)]",
          "text-[var(--color-text-primary)]",
          "group-focus:text-[var(--color-titlebar-text)]",
          "group-focus:bg-[var(--color-titlebar-active)]"
        )}
      >
        {skill.title}
      </span>
    </button>
  );
}
