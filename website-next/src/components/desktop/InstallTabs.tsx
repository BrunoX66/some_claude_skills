"use client";

import { useState, useCallback } from "react";
import { Terminal, Globe, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExplorationProgress } from "@/hooks/useExplorationProgress";
import { useSkillsData } from "@/state/skillsData";
import { InstallCelebration } from "./InstallCelebration";

interface InstallTabsProps {
  skillId: string;
  skillName: string;
}

type TabId = "claude-code" | "claude-web" | "claude-desktop";

const TABS = [
  {
    id: "claude-code" as TabId,
    label: "Claude Code",
    Icon: Terminal,
    requirement: "CLI tool",
  },
  {
    id: "claude-web" as TabId,
    label: "Claude.ai",
    Icon: Globe,
    requirement: "Pro/Max/Team",
  },
  {
    id: "claude-desktop" as TabId,
    label: "Desktop App",
    Icon: Monitor,
    requirement: "Pro/Max/Team",
  },
];

function CopyButton({
  text,
  label,
  copiedItem,
  onCopy,
}: {
  text: string;
  label: string;
  copiedItem: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  const isCopied = copiedItem === label;

  return (
    <button
      onClick={() => onCopy(text, label)}
      className={cn(
        "px-3 py-2 border-2 font-[family-name:var(--font-code)] text-[11px] font-bold cursor-pointer shrink-0",
        isCopied
          ? "bg-[var(--color-success)] text-[var(--color-code-bg)] border-[var(--color-success)]"
          : "bg-[var(--color-code-bg)] text-[var(--color-success)] border-[var(--color-success)]"
      )}
    >
      {isCopied ? "OK!" : "COPY"}
    </button>
  );
}

function StepBadge({
  step,
  color = "var(--color-success)",
}: {
  step: string;
  color?: string;
}) {
  return (
    <span
      className="px-2 py-0.5 text-[10px] font-bold text-[var(--color-code-bg)] shrink-0"
      style={{ background: color }}
    >
      {step}
    </span>
  );
}

export function InstallTabs({ skillId, skillName }: InstallTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("claude-code");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const { exploredCount } = useExplorationProgress();
  const totalSkills = useSkillsData((s) => s.skills.length);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopiedItem(label);
    setShowCelebration(true);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleDismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const skillFileName = skillId.replace(/-/g, "_");
  const githubSkillUrl = `https://github.com/erichowens/some_claude_skills/blob/main/.claude/skills/${skillId}/SKILL.md`;
  const rawSkillUrl = `https://raw.githubusercontent.com/erichowens/some_claude_skills/main/.claude/skills/${skillId}/SKILL.md`;
  const githubFolderUrl = `https://github.com/erichowens/some_claude_skills/tree/main/.claude/skills/${skillId}`;

  return (
    <div className="bg-[var(--color-code-bg)] border-2 border-[var(--color-success)] font-[family-name:var(--font-code)]">
      {/* Tab Headers */}
      <div className="flex border-b-2 border-[var(--color-border-raised-dark)] bg-[color-mix(in_srgb,var(--color-code-bg)_90%,white)]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 px-2 border-none cursor-pointer flex flex-col items-center gap-1",
                "font-[family-name:var(--font-code)] text-[11px] transition-all duration-150",
                isActive
                  ? "bg-[var(--color-code-bg)] font-bold border-b-[3px] border-b-[var(--color-success)] text-[var(--color-success)]"
                  : "bg-transparent text-[var(--color-text-muted)] border-b-[3px] border-b-transparent"
              )}
            >
              <tab.Icon size={16} />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[9px]",
                  isActive
                    ? "text-[var(--color-success)] opacity-70"
                    : "text-[var(--color-text-muted)] opacity-50"
                )}
              >
                {tab.requirement}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Claude Code Tab */}
        {activeTab === "claude-code" && (
          <div className="space-y-4">
            {/* Step 1: Add Marketplace */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StepBadge step="STEP 1" />
                <span className="text-[var(--color-success)] text-xs">
                  Add the marketplace (one time only)
                </span>
              </div>
              <div className="flex gap-2">
                <code className="flex-1 bg-[color-mix(in_srgb,var(--color-code-bg)_80%,white)] p-2.5 border-2 border-[var(--color-success)] text-[var(--color-success)] text-[11px] block">
                  /plugin marketplace add erichowens/some_claude_skills
                </code>
                <CopyButton
                  text="/plugin marketplace add erichowens/some_claude_skills"
                  label="marketplace"
                  copiedItem={copiedItem}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>

            {/* Step 2: Install Skill */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StepBadge step="STEP 2" color="var(--color-warning)" />
                <span className="text-[var(--color-warning)] text-xs">
                  Install this skill
                </span>
              </div>
              <div className="flex gap-2">
                <code className="flex-1 bg-[color-mix(in_srgb,var(--color-code-bg)_80%,white)] p-2.5 border-2 border-[var(--color-warning)] text-[var(--color-warning)] text-[11px] block">
                  /plugin install {skillId}@some-claude-skills
                </code>
                <CopyButton
                  text={`/plugin install ${skillId}@some-claude-skills`}
                  label="install"
                  copiedItem={copiedItem}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>

            {/* Usage note */}
            <div className="bg-[color-mix(in_srgb,var(--color-code-bg)_80%,white)] border border-[var(--color-border-raised-dark)] p-2.5 text-[10px] text-[var(--color-text-muted)]">
              <span className="text-[var(--color-success)]">Done!</span> Claude
              will auto-invoke this skill, or use{" "}
              <code className="text-[var(--color-warning)] bg-[var(--color-code-bg)] px-1">
                /skill {skillFileName}
              </code>
            </div>

            {/* Attribution */}
            <div className="text-[9px] text-[var(--color-text-muted)] text-right">
              Source:{" "}
              <a
                href="https://code.claude.com/docs/en/plugin-marketplaces"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-accent)] underline"
              >
                Claude Code Docs
              </a>
            </div>
          </div>
        )}

        {/* Claude.ai Web Tab */}
        {activeTab === "claude-web" && (
          <div className="space-y-3">
            <div className="bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--color-code-bg))] border border-[var(--color-warning)] p-2 text-[10px] text-[var(--color-warning)]">
              Requires Claude Pro, Max, Team, or Enterprise plan
            </div>

            {[
              <>
                Go to{" "}
                <a
                  href="https://claude.ai/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-success)] underline"
                >
                  claude.ai/projects
                </a>{" "}
                and click{" "}
                <strong className="text-[var(--color-code-text)]">
                  + New Project
                </strong>
              </>,
              <>
                Name your project (e.g., &ldquo;{skillName}&rdquo;)
              </>,
              <>
                Click{" "}
                <strong className="text-[var(--color-code-text)]">
                  Set project instructions
                </strong>
              </>,
              <>Copy &amp; paste the skill content:</>,
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <StepBadge step={String(i + 1)} color="var(--color-warning)" />
                <span className="text-[var(--color-warning)] text-[11px]">
                  {text}
                </span>
              </div>
            ))}

            <div className="flex gap-2 flex-wrap">
              <a
                href={githubSkillUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] bg-[color-mix(in_srgb,var(--color-code-bg)_80%,white)] border-2 border-[var(--color-success)] text-[var(--color-success)] p-2.5 text-[11px] no-underline text-center font-[family-name:var(--font-code)]"
              >
                View on GitHub
              </a>
              <a
                href={rawSkillUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] bg-[color-mix(in_srgb,var(--color-code-bg)_80%,white)] border-2 border-[var(--color-text-accent)] text-[var(--color-text-accent)] p-2.5 text-[11px] no-underline text-center font-[family-name:var(--font-code)]"
              >
                Raw Text (Copy All)
              </a>
            </div>

            {/* Supporting files */}
            <div className="p-2.5 bg-[color-mix(in_srgb,var(--color-warning)_5%,var(--color-code-bg))] border border-[var(--color-border-raised-dark)]">
              <div className="text-[10px] text-[var(--color-text-muted)] mb-1.5">
                Optional: This skill may include validation scripts and
                reference docs
              </div>
              <a
                href={githubFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--color-code-bg)] border-2 border-[var(--color-text-muted)] text-[var(--color-text-muted)] py-1.5 px-2.5 text-[10px] no-underline font-[family-name:var(--font-code)]"
              >
                Browse Full Skill Package
              </a>
            </div>

            <div className="text-[9px] text-[var(--color-text-muted)] text-right">
              Source:{" "}
              <a
                href="https://support.anthropic.com/en/articles/9519177-how-can-i-create-and-manage-projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-accent)] underline"
              >
                Claude Help Center
              </a>
            </div>
          </div>
        )}

        {/* Claude Desktop Tab */}
        {activeTab === "claude-desktop" && (
          <div className="space-y-3">
            <div className="bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--color-code-bg))] border border-[var(--color-warning)] p-2 text-[10px] text-[var(--color-warning)]">
              Requires Claude Pro, Max, Team, or Enterprise plan
            </div>

            {[
              <>
                Open Claude Desktop and go to{" "}
                <strong className="text-[var(--color-code-text)]">
                  Settings
                </strong>{" "}
                &rarr;{" "}
                <strong className="text-[var(--color-code-text)]">
                  Capabilities
                </strong>
              </>,
              <>
                Enable{" "}
                <strong className="text-[var(--color-code-text)]">
                  &ldquo;Code execution and file creation&rdquo;
                </strong>
              </>,
              <>
                Scroll down to the{" "}
                <strong className="text-[var(--color-code-text)]">
                  Skills
                </strong>{" "}
                section
              </>,
              <>
                Click{" "}
                <strong className="text-[var(--color-code-text)]">
                  &ldquo;Upload skill&rdquo;
                </strong>{" "}
                button
              </>,
              <>
                Upload the skill ZIP file you downloaded from the{" "}
                <strong className="text-[var(--color-text-accent)]">
                  download button
                </strong>{" "}
                above
              </>,
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <StepBadge
                  step={String(i + 1)}
                  color="var(--color-text-muted)"
                />
                <span className="text-[var(--color-text-secondary)] text-[11px]">
                  {text}
                </span>
              </div>
            ))}

            {/* ZIP Requirements */}
            <div className="p-2.5 bg-[color-mix(in_srgb,var(--color-info)_5%,var(--color-code-bg))] border border-[var(--color-border-raised-dark)]">
              <div className="text-[10px] text-[var(--color-text-muted)] mb-1.5 font-bold">
                ZIP File Requirements:
              </div>
              <div className="text-[9px] text-[var(--color-text-muted)] leading-relaxed space-y-0.5">
                <div>
                  Must contain a folder named{" "}
                  <code className="text-[var(--color-text-secondary)]">
                    {skillId}
                  </code>
                </div>
                <div>
                  Folder must contain{" "}
                  <code className="text-[var(--color-text-secondary)]">
                    SKILL.md
                  </code>{" "}
                  file
                </div>
                <div>Skill name in SKILL.md must match folder name</div>
              </div>
            </div>

            <div className="text-[9px] text-[var(--color-text-muted)] text-right">
              Source:{" "}
              <a
                href="https://support.claude.com/en/articles/12512180-using-skills-in-claude"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-text-accent)] underline"
              >
                Using Skills in Claude
              </a>
            </div>
          </div>
        )}
      </div>

      {showCelebration && (
        <InstallCelebration
          skillName={skillName}
          exploredCount={exploredCount}
          totalSkills={totalSkills}
          onDismiss={handleDismissCelebration}
        />
      )}
    </div>
  );
}
