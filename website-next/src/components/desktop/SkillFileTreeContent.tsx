"use client";

import { useSkillNav } from "@/state/skillNav";
import { useSkillsData } from "@/state/skillsData";
import { SkillFileTree } from "./SkillFileTree";
import { SkillNavBar } from "./SkillNavBar";
import { cn } from "@/lib/utils";

/**
 * SkillFileTreeContent — the FILETREE.EXE window in SKILL_DETAILS.
 * Shows the file structure of the currently open skill.
 */
export function SkillFileTreeContent() {
  const currentSkillId = useSkillNav((s) => s.currentSkillId);
  const skills = useSkillsData((s) => s.skills);

  const skill = skills.find((s) => s.id === currentSkillId);

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      <SkillNavBar />

      {skill ? (
        skill.folderMeta.hasContent ? (
          <div className="flex-1 overflow-auto p-2">
            <SkillFileTree files={skill.folderMeta.files} skillId={skill.id} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center gap-2">
            <p className={cn(
              "font-[family-name:var(--font-system)] text-xs",
              "text-[var(--color-text-muted)]"
            )}>
              Single-file skill
            </p>
            <p className={cn(
              "font-[family-name:var(--font-code)] text-[10px]",
              "text-[var(--color-text-muted)]"
            )}>
              SKILL.md
            </p>
          </div>
        )
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-muted)]">
            No skill selected
          </p>
        </div>
      )}
    </div>
  );
}
