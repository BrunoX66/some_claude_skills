"use client";

import { useCallback, useState } from "react";
import { openSkillDetails } from "@/lib/windowHelpers";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

interface SkillIconProps {
  skill: Skill;
}

/**
 * SkillIcon - A clickable desktop icon representing a single skill.
 *
 * Displays a 48x48 hero image with the skill title below. Clicking opens
 * the skill in a Win31Window via the window manager. Follows Win31 Program
 * Manager conventions: single click to select, double-click to open.
 * Both are wired to open for simplicity.
 *
 * Selected state uses inverted colors (navy bg, white text) on focus.
 * Handles broken hero images with a graceful fallback.
 */
export function SkillIcon({ skill }: SkillIconProps) {
  const [imgError, setImgError] = useState(false);

  const handleOpen = useCallback(() => {
    openSkillDetails(skill.id, skill.title);
  }, [skill.id, skill.title]);

  return (
    <button
      onClick={handleOpen}
      onDoubleClick={handleOpen}
      className={cn(
        "flex flex-col items-center gap-1 w-[72px] p-1",
        "cursor-pointer group",
        "focus:outline-none",
        "hover:bg-[var(--color-titlebar-active)]/10"
      )}
      title={skill.description}
      aria-label={`Open ${skill.title}`}
    >
      {/* Icon image with Win31 inset border */}
      <div
        className={cn(
          "w-12 h-12",
          "border",
          "border-t-[var(--color-border-inset-light)]",
          "border-l-[var(--color-border-inset-light)]",
          "border-b-[var(--color-border-inset-dark)]",
          "border-r-[var(--color-border-inset-dark)]",
          "overflow-hidden",
          "bg-[var(--color-surface-inset)]",
          "group-focus:border-[var(--color-titlebar-active)]"
        )}
      >
        {imgError ? (
          /* Fallback: show first two letters of the title */
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

      {/* Title label */}
      <span
        className={cn(
          "text-[10px] leading-tight",
          "font-[family-name:var(--font-system)]",
          "text-[var(--color-text-primary)]",
          "text-center w-full",
          "line-clamp-2",
          // Focus/selected state: inverted colors
          "group-focus:text-[var(--color-titlebar-text)]",
          "group-focus:bg-[var(--color-titlebar-active)]",
          "px-0.5"
        )}
      >
        {skill.title}
      </span>
    </button>
  );
}
