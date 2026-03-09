"use client";

import { Win31Prose } from "@/components/win31";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

interface SkillWindowProps {
  skill: Skill;
}

/**
 * SkillWindow - Window content that renders a skill's markdown documentation.
 *
 * Displays the skill's SKILL.md content using Win31Prose for themed markdown
 * rendering. Includes a small header with the skill's category badge.
 * Used as the child of a Win31Window when a skill icon is opened.
 */
export function SkillWindow({ skill }: SkillWindowProps) {
  return (
    <div
      className={cn(
        "h-full flex flex-col",
        "bg-[var(--color-surface-inset)]"
      )}
    >
      {/* Skill metadata bar */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5",
          "bg-[var(--color-surface)]",
          "border-b",
          "border-b-[var(--color-border-inset-light)]",
          "shrink-0"
        )}
      >
        <span
          className={cn(
            "text-[10px]",
            "font-[family-name:var(--font-system)]",
            "text-[var(--color-text-secondary)]"
          )}
        >
          Category:
        </span>
        <span
          className={cn(
            "text-[10px] font-bold",
            "font-[family-name:var(--font-system)]",
            "text-[var(--color-text-accent)]",
            "bg-[var(--color-surface-inset)]",
            "border border-[var(--color-border-inset-light)]",
            "px-1.5 py-0.5"
          )}
        >
          {skill.category}
        </span>
        {skill.tags.length > 0 && (
          <>
            <span
              className={cn(
                "text-[10px]",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-secondary)]",
                "ml-2"
              )}
            >
              Tags:
            </span>
            <div className="flex gap-1 flex-wrap">
              {skill.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "text-[9px]",
                    "font-[family-name:var(--font-system)]",
                    "text-[var(--color-text-muted)]",
                    "bg-[var(--color-surface)]",
                    "border border-[var(--color-border-inset-light)]",
                    "px-1 py-0.5"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Markdown content */}
      <div className="flex-1 overflow-auto p-3">
        <Win31Prose content={skill.content} />
      </div>
    </div>
  );
}
