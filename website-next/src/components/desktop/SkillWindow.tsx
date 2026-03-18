"use client";

import { useState } from "react";
import { Download, ExternalLink, ChevronDown, ChevronRight, FolderTree, Wrench } from "lucide-react";
import { Win31Prose } from "@/components/win31";
import { cn } from "@/lib/utils";
import { downloadSkillZip } from "@/utils/downloadSkillZip";
import { InstallTabs } from "./InstallTabs";
import { SkillFileTree } from "./SkillFileTree";
import type { Skill } from "@/types/skill";

interface SkillWindowProps {
  skill: Skill;
}

/**
 * SkillWindow - Full-featured window content for skill documentation.
 *
 * Layout:
 *   1. Hero image (if exists)
 *   2. Metadata bar (category, tags, file count)
 *   3. Action row (Download ZIP, GitHub link)
 *   4. Install panel (collapsible, InstallTabs)
 *   5. File tree (collapsible, only if skill has extra files)
 *   6. Markdown content (Win31Prose with pre-rendered HTML)
 */
export function SkillWindow({ skill }: SkillWindowProps) {
  const [installOpen, setInstallOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadSkillZip(skill.id);
    } finally {
      setDownloading(false);
    }
  };

  const githubUrl = `https://github.com/erichowens/some_claude_skills/tree/main/.claude/skills/${skill.id}`;

  return (
    <div
      className={cn("h-full flex flex-col", "bg-[var(--color-surface-inset)]")}
    >
      {/* Hero image */}
      <div className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={skill.heroImage}
          alt={`${skill.title} hero`}
          className="w-full h-52 object-cover border-b-2 border-[var(--color-border-raised-dark)]"
          onError={(e) => {
            // Hide if no hero image exists
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Metadata bar */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 flex-wrap",
          "bg-[var(--color-surface)]",
          "border-b border-b-[var(--color-border-inset-light)]",
          "shrink-0"
        )}
      >
        <span
          className={cn(
            "text-[7px] font-bold uppercase",
            "font-[family-name:var(--font-display)]",
            "text-[var(--color-text-accent)]",
            "bg-[var(--color-surface-inset)]",
            "border-2 border-[var(--color-text-accent)]",
            "px-1.5 py-0.5 leading-tight"
          )}
        >
          {skill.category}
        </span>
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
        {skill.folderMeta.hasContent && (
          <span
            className={cn(
              "text-[9px]",
              "font-[family-name:var(--font-system)]",
              "text-[var(--color-info)]",
              "bg-[var(--color-surface-inset)]",
              "border border-[var(--color-border-inset-light)]",
              "px-1 py-0.5 ml-auto"
            )}
          >
            {skill.folderMeta.fileCount} files
          </span>
        )}
      </div>

      {/* Action row */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5",
          "bg-[var(--color-surface)]",
          "border-b border-b-[var(--color-border-inset-light)]",
          "shrink-0"
        )}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={cn(
            "flex items-center gap-1 px-2 py-1",
            "text-[10px] font-bold font-[family-name:var(--font-system)]",
            "bg-[var(--color-surface-raised)]",
            "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
            "cursor-pointer active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
            "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Download size={12} />
          {downloading ? "Downloading..." : "Download ZIP"}
        </button>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-1 px-2 py-1",
            "text-[10px] font-bold font-[family-name:var(--font-system)]",
            "text-[var(--color-text-primary)] no-underline",
            "bg-[var(--color-surface-raised)]",
            "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
            "cursor-pointer active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
            "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]"
          )}
        >
          <ExternalLink size={12} />
          GitHub
        </a>
      </div>

      {/* Scrollable content area — beige paper background */}
      <div className="flex-1 overflow-auto bg-[var(--color-content-bg)]">
        {/* Install panel (collapsible) */}
        <div className="border-b border-[var(--color-border-inset-light)]">
          <button
            onClick={() => setInstallOpen(!installOpen)}
            className={cn(
              "flex items-center gap-1.5 w-full px-3 py-1.5",
              "text-[10px] font-bold font-[family-name:var(--font-system)]",
              "text-[var(--color-text-primary)]",
              "bg-[var(--color-surface)]",
              "cursor-pointer border-none text-left",
              "hover:bg-[var(--color-surface-raised)]"
            )}
          >
            {installOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <Wrench size={12} />
            Install Instructions
          </button>
          {installOpen && (
            <div className="px-3 pb-3">
              <InstallTabs skillId={skill.id} skillName={skill.title} />
            </div>
          )}
        </div>

        {/* File tree (collapsible, only if skill has extra content) */}
        {skill.folderMeta.hasContent && (
          <div className="border-b border-[var(--color-border-inset-light)]">
            <button
              onClick={() => setFilesOpen(!filesOpen)}
              className={cn(
                "flex items-center gap-1.5 w-full px-3 py-1.5",
                "text-[10px] font-bold font-[family-name:var(--font-system)]",
                "text-[var(--color-text-primary)]",
                "bg-[var(--color-surface)]",
                "cursor-pointer border-none text-left",
                "hover:bg-[var(--color-surface-raised)]"
              )}
            >
              {filesOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <FolderTree size={12} />
              Skill Files ({skill.folderMeta.fileCount} files, {skill.folderMeta.folderCount} folders)
            </button>
            {filesOpen && (
              <div className="px-3 pb-3">
                <SkillFileTree
                  files={skill.folderMeta.files}
                  skillId={skill.id}
                />
              </div>
            )}
          </div>
        )}

        {/* Markdown content */}
        <div className="p-3">
          <Win31Prose contentHtml={skill.contentHtml} />
        </div>
      </div>
    </div>
  );
}
