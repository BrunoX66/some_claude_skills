"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useSkillNav } from "@/state/skillNav";
import { useSkillsData } from "@/state/skillsData";
import { downloadSkillZip } from "@/utils/downloadSkillZip";
import { InstallTabs } from "./InstallTabs";
import { SkillNavBar } from "./SkillNavBar";
import { cn } from "@/lib/utils";

/**
 * SkillInstallContent — the INSTALL.EXE window in SKILL_DETAILS.
 * Shows install instructions for the currently open skill.
 */
export function SkillInstallContent() {
  const currentSkillId = useSkillNav((s) => s.currentSkillId);
  const skills = useSkillsData((s) => s.skills);
  const [downloading, setDownloading] = useState(false);

  const skill = skills.find((s) => s.id === currentSkillId);

  if (!skill) {
    return (
      <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
        <SkillNavBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-muted)]">
            No skill selected
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadSkillZip(skill.id); }
    finally { setDownloading(false); }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      <SkillNavBar />

      {/* Install header */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 shrink-0",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-inset-light)]"
      )}>
        <span className="font-[family-name:var(--font-system)] text-[10px] font-bold text-[var(--color-text-primary)] flex-1">
          Install: {skill.title}
        </span>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={cn(
            "flex items-center gap-1 px-2 py-1",
            "text-[10px] font-bold font-[family-name:var(--font-system)]",
            "bg-[var(--color-surface-raised)] cursor-pointer",
            "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Download size={11} />
          {downloading ? "Downloading..." : "Download ZIP"}
        </button>
      </div>

      {/* Install tabs */}
      <div className="flex-1 overflow-auto p-3">
        <InstallTabs skillId={skill.id} skillName={skill.title} />
      </div>
    </div>
  );
}
