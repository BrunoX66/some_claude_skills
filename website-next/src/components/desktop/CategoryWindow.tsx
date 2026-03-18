"use client";

import { Win31MDIWindow } from "@/components/win31";
import { SkillIcon } from "./SkillIcon";
import type { Skill } from "@/types/skill";

interface CategoryWindowProps {
  category: string;
  skills: Skill[];
  initialX?: number;
  initialY?: number;
  isActive: boolean;
  isMinimized?: boolean;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
}

function formatCategoryName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * CategoryWindow - A Win31 MDI child window for one skill category.
 *
 * Each category on the desktop is its own draggable mini-window
 * containing a grid of SkillIcons. This matches the Windows 3.1
 * Program Manager paradigm shown in the wireframes.
 */
export function CategoryWindow({
  category,
  skills,
  initialX = 20,
  initialY = 20,
  isActive,
  isMinimized = false,
  zIndex,
  onClose,
  onFocus,
}: CategoryWindowProps) {
  const displayName = formatCategoryName(category);
  const title = `${displayName} (${skills.length})`;

  return (
    <Win31MDIWindow
      title={title}
      initialX={initialX}
      initialY={initialY}
      initialWidth={320}
      initialHeight={220}
      isActive={isActive}
      isMinimized={isMinimized}
      zIndex={zIndex}
      onClose={onClose}
      onFocus={onFocus}
    >
      <div className="flex flex-wrap gap-1 p-2 content-start">
        {skills.map((skill) => (
          <SkillIcon key={skill.id} skill={skill} />
        ))}
      </div>
    </Win31MDIWindow>
  );
}
