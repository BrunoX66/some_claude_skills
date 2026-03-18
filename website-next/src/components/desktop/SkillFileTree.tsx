"use client";

import { useState } from "react";
import { FolderOpen, FolderClosed, File, FileCode, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillFolderFile } from "@/types/skill";

interface SkillFileTreeProps {
  files: SkillFolderFile[];
  skillId: string;
}

const GITHUB_BASE = "https://github.com/erichowens/some_claude_skills/blob/main/.claude/skills";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".sh", ".md", ".json", ".yaml", ".yml", ".css"]);

function getFileIcon(name: string) {
  const ext = name.slice(name.lastIndexOf("."));
  if (CODE_EXTENSIONS.has(ext)) return FileCode;
  if ([".txt", ".log", ".csv"].includes(ext)) return FileText;
  return File;
}

function renderTreeItem(
  item: SkillFolderFile,
  skillId: string,
  depth: number,
  expandedFolders: Set<string>,
  toggleFolder: (path: string) => void
): React.ReactNode {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolders.has(item.path);
  const Icon = isFolder
    ? isExpanded ? FolderOpen : FolderClosed
    : getFileIcon(item.name);
  const Chevron = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div key={item.path}>
      {isFolder ? (
        <button
          onClick={() => toggleFolder(item.path)}
          className="flex items-center gap-1.5 w-full py-0.5 px-1 hover:bg-[var(--color-surface)] cursor-pointer border-none bg-transparent text-left"
          style={{ paddingLeft: `${depth * 16 + 4}px` }}
        >
          <Chevron size={10} className="text-[var(--color-text-muted)] shrink-0" />
          <Icon size={14} className="text-[var(--color-warning)] shrink-0" />
          <span className="text-[var(--color-text-primary)] font-[family-name:var(--font-code)] text-xs">
            {item.name}/
          </span>
        </button>
      ) : (
        <a
          href={`${GITHUB_BASE}/${skillId}/${item.path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 w-full py-0.5 px-1 hover:bg-[var(--color-surface)] no-underline"
          style={{ paddingLeft: `${depth * 16 + 18}px` }}
        >
          <Icon size={14} className="text-[var(--color-text-accent)] shrink-0" />
          <span className="text-[var(--color-text-primary)] font-[family-name:var(--font-code)] text-xs flex-1">
            {item.name}
          </span>
          {item.size != null && (
            <span className="text-[9px] text-[var(--color-text-muted)] shrink-0">
              {formatSize(item.size)}
            </span>
          )}
        </a>
      )}
      {isFolder && isExpanded && item.children?.map((child) =>
        renderTreeItem(child, skillId, depth + 1, expandedFolders, toggleFolder)
      )}
    </div>
  );
}

export function SkillFileTree({ files, skillId }: SkillFileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div
      className={cn(
        "border-2",
        "border-t-[var(--color-border-inset-light)]",
        "border-l-[var(--color-border-inset-light)]",
        "border-b-[var(--color-border-inset-dark)]",
        "border-r-[var(--color-border-inset-dark)]",
        "bg-[var(--color-surface-inset)]",
        "p-2 text-xs font-[family-name:var(--font-code)]"
      )}
    >
      <div className="space-y-0.5">
        {files.map((item) =>
          renderTreeItem(item, skillId, 0, expandedFolders, toggleFolder)
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-[var(--color-border-inset-light)] text-[9px] text-[var(--color-text-muted)]">
        <a
          href={`${GITHUB_BASE}/${skillId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-text-link)] underline hover:text-[var(--color-text-accent)]"
        >
          View full folder on GitHub
        </a>
      </div>
    </div>
  );
}
