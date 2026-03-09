"use client";

import { useState, useCallback } from "react";
import { Win31GroupBox } from "@/components/win31";
import { SkillIcon } from "./SkillIcon";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

interface ProgramGroupProps {
  /** Category slug, e.g. "ai-machine-learning" */
  category: string;
  /** Skills in this category */
  skills: Skill[];
  /** Whether the group starts expanded (default false) */
  defaultOpen?: boolean;
}

/**
 * ProgramGroup - A collapsible Win31 GroupBox containing a grid of SkillIcons.
 *
 * Each category of skills is rendered as a labeled group box. The header
 * is clickable to collapse/expand, keeping the desktop tidy when there
 * are many categories. Shows skill count in the label.
 */
export function ProgramGroup({
  category,
  skills,
  defaultOpen = false,
}: ProgramGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Format "ai-machine-learning" -> "AI Machine Learning"
  const displayName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const label = `${isOpen ? "\u25BC" : "\u25B6"} ${displayName} (${skills.length})`;

  return (
    <div className="mb-2">
      {/* Clickable header using GroupBox label */}
      <Win31GroupBox label={label} className="relative">
        {/* Make the entire legend area clickable */}
        <button
          onClick={toggle}
          className={cn(
            "absolute -top-[11px] left-2 z-10",
            "px-1",
            "font-[family-name:var(--font-system)]",
            "text-xs",
            "text-[var(--color-text-primary)]",
            "bg-[var(--color-surface)]",
            "cursor-pointer",
            "hover:text-[var(--color-text-accent)]",
            // Match the legend dimensions — overlay on top
            "w-auto h-auto",
            // Make clickable area slightly larger than text
            "py-0.5"
          )}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${displayName} group`}
        >
          {label}
        </button>

        {/* Skill icon grid */}
        {isOpen && (
          <div className="flex flex-wrap gap-1 p-1 max-h-60 overflow-y-auto">
            {skills.map((skill) => (
              <SkillIcon key={skill.id} skill={skill} />
            ))}
          </div>
        )}

        {/* Collapsed placeholder */}
        {!isOpen && (
          <div className="h-1" aria-hidden />
        )}
      </Win31GroupBox>
    </div>
  );
}
