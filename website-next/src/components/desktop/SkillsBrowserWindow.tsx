"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  FileCode, File, FileText, FolderOpen, FolderClosed,
  ChevronRight, ChevronDown,
} from "lucide-react";
import { useSkillsData } from "@/state/skillsData";
import { useExplorationProgress } from "@/hooks/useExplorationProgress";
import { openSkillDetails } from "@/lib/windowHelpers";
import { estimateReadTime } from "@/utils/readTime";
import { cn } from "@/lib/utils";
import type { Skill, SkillFolderFile } from "@/types/skill";

type ViewMode = "grid" | "list";

function formatCategoryName(slug: string): string {
  if (slug.includes(" ")) return slug;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const CODE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".sh", ".md", ".json", ".yaml", ".yml", ".css", ".txt"]);

/**
 * SkillsBrowserWindow — Win31 File Manager-style skill explorer.
 *
 * Three-pane layout:
 *   Left:   category tree with counts
 *   Center: skill cards with hero images (grid or list)
 *   Right:  preview pane (appears on skill select)
 *
 * Single-click selects → preview pane.
 * Double-click → opens full skill-details window.
 */
export function SkillsBrowserWindow() {
  const { skills, categories, skillsByCategory } = useSkillsData();
  const { exploredCount, isExplored } = useExplorationProgress();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Filter skills by active category + search
  const filteredSkills = useMemo(() => {
    let pool: Skill[] = activeCategory
      ? (skillsByCategory[activeCategory] ?? [])
      : skills;

    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return pool;
  }, [skills, skillsByCategory, activeCategory, search]);

  // Single click = select for preview
  const handleSkillSelect = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
  }, []);

  // Double click = open full details window
  const handleSkillOpen = useCallback((skill: Skill) => {
    openSkillDetails(skill.id, skill.title);
  }, []);

  // Close preview
  const handleClosePreview = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  /* ── Toolbar button style ─────────────────────────────────────────────── */

  const btnClass = (active: boolean) =>
    cn(
      "px-3 py-1 text-[10px] font-bold font-[family-name:var(--font-system)] cursor-pointer",
      "border",
      active
        ? [
            "border-t-[var(--color-border-raised-dark)]",
            "border-l-[var(--color-border-raised-dark)]",
            "border-b-[var(--color-border-raised-light)]",
            "border-r-[var(--color-border-raised-light)]",
            "bg-[var(--color-surface-inset)]",
          ]
        : [
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]",
            "bg-[var(--color-surface-raised)]",
          ]
    );

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface)]">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 shrink-0",
          "bg-[var(--color-surface)]",
          "border-b border-b-[var(--color-border-raised-dark)]"
        )}
      >
        <button
          className={btnClass(viewMode === "grid")}
          onClick={() => setViewMode("grid")}
          aria-label="Grid view"
        >
          Grid
        </button>
        <button
          className={btnClass(viewMode === "list")}
          onClick={() => setViewMode("list")}
          aria-label="List view"
        >
          List
        </button>

        {selectedSkill && (
          <>
            <div className="w-px h-4 bg-[var(--color-border-raised-dark)]" />
            <button
              className={btnClass(false)}
              onClick={() => handleSkillOpen(selectedSkill)}
              aria-label="Open full details"
            >
              Open
            </button>
          </>
        )}

        <div className="flex-1" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className={cn(
            "w-48 px-2 py-1 text-[11px]",
            "font-[family-name:var(--font-system)]",
            "bg-[var(--color-surface-inset)]",
            "text-[var(--color-text-primary)]",
            "border",
            "border-t-[var(--color-border-inset-dark)]",
            "border-l-[var(--color-border-inset-dark)]",
            "border-b-[var(--color-border-inset-light)]",
            "border-r-[var(--color-border-inset-light)]",
            "placeholder:text-[var(--color-text-muted)]",
            "outline-none"
          )}
        />
      </div>

      {/* ── Three-pane body ─────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">
        {/* Left panel: category tree */}
        <div
          className={cn(
            "w-[170px] shrink-0 overflow-y-auto p-1",
            "bg-[var(--color-surface-inset)]",
            "border-r border-r-[var(--color-border-raised-dark)]"
          )}
        >
          <CategoryTree
            categories={categories}
            skillsByCategory={skillsByCategory}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* Center panel: skill cards */}
        <div className="flex-1 overflow-y-auto p-3 bg-[var(--color-surface-inset)]">
          {filteredSkills.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-muted)]">
                No skills found{search ? ` matching "${search}"` : ""}.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <SkillGrid
              skills={filteredSkills}
              isExplored={isExplored}
              selectedId={selectedSkill?.id ?? null}
              onSelect={handleSkillSelect}
              onOpen={handleSkillOpen}
            />
          ) : (
            <SkillList
              skills={filteredSkills}
              isExplored={isExplored}
              selectedId={selectedSkill?.id ?? null}
              onSelect={handleSkillSelect}
              onOpen={handleSkillOpen}
            />
          )}
        </div>

        {/* Right panel: preview pane (when skill selected) */}
        {selectedSkill && (
          <div
            className={cn(
              "w-[300px] shrink-0 overflow-hidden flex flex-col",
              "bg-[var(--color-surface)]",
              "border-l border-l-[var(--color-border-raised-dark)]"
            )}
          >
            <SkillPreviewPane
              skill={selectedSkill}
              isExplored={isExplored(selectedSkill.id)}
              onOpen={() => handleSkillOpen(selectedSkill)}
              onClose={handleClosePreview}
            />
          </div>
        )}
      </div>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-4 px-3 py-1 shrink-0",
          "font-[family-name:var(--font-system)] text-[9px]",
          "text-[var(--color-text-primary)]",
          "bg-[var(--color-surface)]",
          "border-t border-t-[var(--color-border-raised-light)]"
        )}
      >
        <span>
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""}
          {activeCategory ? ` in "${formatCategoryName(activeCategory)}"` : ""}
        </span>
        <span className="text-[var(--color-text-muted)]">|</span>
        <span>{exploredCount} explored</span>
        <span className="text-[var(--color-text-muted)]">|</span>
        <span>{viewMode === "grid" ? "Grid" : "List"} View</span>
        {selectedSkill && (
          <>
            <span className="text-[var(--color-text-muted)]">|</span>
            <span className="truncate text-[var(--color-text-accent)]">
              {selectedSkill.title}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Category tree ─────────────────────────────────────────────────────── */

function CategoryTree({
  categories,
  skillsByCategory,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  skillsByCategory: Record<string, Skill[]>;
  activeCategory: string | null;
  onSelect: (cat: string | null) => void;
}) {
  const total = Object.values(skillsByCategory).reduce((n, s) => n + s.length, 0);

  return (
    <div className="space-y-px">
      {/* All skills root */}
      <button
        className={cn(
          "w-full text-left px-2 py-1 flex items-center gap-1",
          "font-[family-name:var(--font-system)] text-[10px] font-bold",
          "cursor-pointer select-none",
          activeCategory === null
            ? "bg-[var(--color-titlebar-active)] text-[var(--color-titlebar-text)]"
            : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
        )}
        onClick={() => onSelect(null)}
      >
        <span className="text-[9px]">{activeCategory === null ? "\u25BC" : "\u25B6"}</span>
        All Skills ({total})
      </button>

      {/* Category items */}
      {categories.map((cat) => {
        const count = skillsByCategory[cat]?.length ?? 0;
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            className={cn(
              "w-full text-left px-2 py-1 pl-5 flex items-center gap-1",
              "font-[family-name:var(--font-system)] text-[10px]",
              "cursor-pointer select-none",
              isActive
                ? "bg-[var(--color-titlebar-active)] text-[var(--color-titlebar-text)]"
                : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
            )}
            onClick={() => onSelect(cat)}
          >
            <span className="text-[8px]">{isActive ? "\u25BC" : "\u251C"}</span>
            {formatCategoryName(cat)} ({count})
          </button>
        );
      })}
    </div>
  );
}

/* ── Grid view ─────────────────────────────────────────────────────────── */

function SkillGrid({
  skills,
  isExplored,
  selectedId,
  onSelect,
  onOpen,
}: {
  skills: Skill[];
  isExplored: (id: string) => boolean;
  selectedId: string | null;
  onSelect: (skill: Skill) => void;
  onOpen: (skill: Skill) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {skills.map((skill) => {
        const isSelected = skill.id === selectedId;
        return (
          <button
            key={skill.id}
            className={cn(
              "text-left cursor-pointer group",
              "border",
              isSelected
                ? [
                    "border-[var(--color-text-accent)]",
                    "ring-1 ring-[var(--color-text-accent)]",
                  ]
                : [
                    "border-t-[var(--color-border-raised-light)]",
                    "border-l-[var(--color-border-raised-light)]",
                    "border-b-[var(--color-border-raised-dark)]",
                    "border-r-[var(--color-border-raised-dark)]",
                    "active:border-t-[var(--color-border-raised-dark)]",
                    "active:border-l-[var(--color-border-raised-dark)]",
                    "active:border-b-[var(--color-border-raised-light)]",
                    "active:border-r-[var(--color-border-raised-light)]",
                  ],
              "bg-[var(--color-surface)]",
              "focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-[var(--color-text-primary)]"
            )}
            onClick={() => onSelect(skill)}
            onDoubleClick={() => onOpen(skill)}
            aria-label={`${isSelected ? "Selected: " : ""}${skill.title}`}
          >
            {/* Hero image */}
            <div className="relative w-full h-28 overflow-hidden bg-[var(--color-surface-inset)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.heroImage}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Explored badge */}
              {isExplored(skill.id) && (
                <div
                  className={cn(
                    "absolute top-1 right-1 px-1 py-px",
                    "text-[7px] font-bold font-[family-name:var(--font-system)]",
                    "bg-[var(--color-titlebar-active)] text-[var(--color-titlebar-text)]"
                  )}
                >
                  VISITED
                </div>
              )}
              {/* Badge */}
              {skill.badge && (
                <div
                  className={cn(
                    "absolute top-1 left-1 px-1 py-px",
                    "text-[7px] font-bold font-[family-name:var(--font-system)]",
                    "bg-[var(--color-text-accent)] text-[var(--color-surface)]"
                  )}
                >
                  {skill.badge}
                </div>
              )}
            </div>

            {/* Info bar */}
            <div className={cn(
              "px-2 py-1.5",
              isSelected
                ? "bg-[var(--color-titlebar-active)]"
                : "bg-[var(--color-surface-raised)]"
            )}>
              <p
                className={cn(
                  "font-[family-name:var(--font-system)] text-[10px] font-bold truncate",
                  isSelected
                    ? "text-[var(--color-titlebar-text)]"
                    : "text-[var(--color-text-primary)] group-hover:text-[var(--color-text-accent)]"
                )}
              >
                {skill.title}
              </p>
              <p className={cn(
                "font-[family-name:var(--font-system)] text-[8px] truncate",
                isSelected
                  ? "text-[var(--color-titlebar-text)] opacity-80"
                  : "text-[var(--color-text-muted)]"
              )}>
                {formatCategoryName(skill.category)} · ~{estimateReadTime(skill.content)} min read
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── List view ─────────────────────────────────────────────────────────── */

function SkillList({
  skills,
  isExplored,
  selectedId,
  onSelect,
  onOpen,
}: {
  skills: Skill[];
  isExplored: (id: string) => boolean;
  selectedId: string | null;
  onSelect: (skill: Skill) => void;
  onOpen: (skill: Skill) => void;
}) {
  return (
    <div className="space-y-px">
      {/* Header row */}
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1",
          "font-[family-name:var(--font-system)] text-[9px] font-bold",
          "text-[var(--color-text-muted)]",
          "border-b border-b-[var(--color-border-raised-dark)]"
        )}
      >
        <span className="w-10 shrink-0">Hero</span>
        <span className="flex-1">Name</span>
        <span className="w-24">Category</span>
        <span className="w-14 text-right">Read</span>
      </div>

      {skills.map((skill) => {
        const isSelected = skill.id === selectedId;
        return (
          <button
            key={skill.id}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1 text-left",
              "font-[family-name:var(--font-system)] text-[10px]",
              "cursor-pointer select-none",
              "focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-[var(--color-text-primary)]",
              isSelected
                ? "bg-[var(--color-titlebar-active)] text-[var(--color-titlebar-text)]"
                : [
                    "hover:bg-[var(--color-titlebar-active)] hover:text-[var(--color-titlebar-text)]",
                    isExplored(skill.id) ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]",
                  ]
            )}
            onClick={() => onSelect(skill)}
            onDoubleClick={() => onOpen(skill)}
          >
            {/* Tiny hero thumbnail */}
            <div className="w-10 h-6 shrink-0 overflow-hidden bg-[var(--color-surface-inset)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.heroImage}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="flex-1 truncate font-bold">{skill.title}</span>
            <span className="w-24 truncate text-[9px] opacity-70">
              {formatCategoryName(skill.category)}
            </span>
            <span className="w-14 text-right text-[9px] opacity-70">
              ~{estimateReadTime(skill.content)}m
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Preview pane ──────────────────────────────────────────────────────── */

function SkillPreviewPane({
  skill,
  isExplored,
  onOpen,
  onClose,
}: {
  skill: Skill;
  isExplored: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const prevSkillRef = useRef(skill.id);

  // Reset folder state when skill changes
  useEffect(() => {
    if (prevSkillRef.current !== skill.id) {
      prevSkillRef.current = skill.id;
      setExpandedFolders(new Set());
    }
  }, [skill.id]);

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);

  const readTime = estimateReadTime(skill.content);

  return (
    <div className="flex flex-col h-full">
      {/* Preview title bar */}
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 shrink-0",
          "bg-[var(--color-titlebar-active)]",
          "border-b border-b-[var(--color-border-raised-dark)]"
        )}
      >
        <span className="flex-1 font-[family-name:var(--font-system)] text-[10px] font-bold text-[var(--color-titlebar-text)] truncate">
          Preview
        </span>
        <button
          onClick={onClose}
          className={cn(
            "w-4 h-3.5 flex items-center justify-center text-[9px] font-bold",
            "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
            "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
            "cursor-pointer"
          )}
          aria-label="Close preview"
        >
          x
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero image — big and beautiful */}
        <div className="relative w-full h-36 overflow-hidden bg-[var(--color-surface-inset)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={skill.heroImage}
            alt={skill.title}
            className="w-full h-full object-cover"
          />
          {skill.badge && (
            <div
              className={cn(
                "absolute top-1.5 left-1.5 px-1.5 py-0.5",
                "text-[8px] font-bold font-[family-name:var(--font-system)]",
                "bg-[var(--color-text-accent)] text-[var(--color-surface)]"
              )}
            >
              {skill.badge}
            </div>
          )}
          {isExplored && (
            <div
              className={cn(
                "absolute top-1.5 right-1.5 px-1.5 py-0.5",
                "text-[8px] font-bold font-[family-name:var(--font-system)]",
                "bg-[var(--color-titlebar-active)] text-[var(--color-titlebar-text)]"
              )}
            >
              VISITED
            </div>
          )}
        </div>

        {/* Title + metadata */}
        <div className="px-3 py-2 border-b border-b-[var(--color-border-inset-light)]">
          <h3 className="font-[family-name:var(--font-system)] text-xs font-bold text-[var(--color-text-primary)] leading-tight">
            {skill.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn(
              "text-[9px] font-bold font-[family-name:var(--font-system)]",
              "text-[var(--color-text-accent)] bg-[var(--color-surface-inset)]",
              "border border-[var(--color-border-inset-light)] px-1 py-px"
            )}>
              {formatCategoryName(skill.category)}
            </span>
            <span className="font-[family-name:var(--font-system)] text-[9px] text-[var(--color-text-muted)]">
              ~{readTime} min read
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-3 py-2 border-b border-b-[var(--color-border-inset-light)]">
          <p className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
            {skill.description}
          </p>
        </div>

        {/* Tags */}
        {skill.tags.length > 0 && (
          <div className="px-3 py-1.5 border-b border-b-[var(--color-border-inset-light)]">
            <div className="flex flex-wrap gap-1">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "text-[8px] font-[family-name:var(--font-system)]",
                    "text-[var(--color-text-muted)]",
                    "border border-[var(--color-border-inset-light)] px-1 py-px"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Folder tree */}
        {skill.folderMeta.hasContent && (
          <div className="px-2 py-2 border-b border-b-[var(--color-border-inset-light)]">
            <p className="font-[family-name:var(--font-system)] text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide px-1 mb-1">
              Files ({skill.folderMeta.fileCount} files, {skill.folderMeta.folderCount} folders)
            </p>
            <div className="bg-[var(--color-surface-inset)] border border-[var(--color-border-inset-dark)] p-1">
              {/* SKILL.md always first */}
              <div className="flex items-center gap-1 py-0.5 px-1">
                <FileCode size={10} className="text-[var(--color-text-accent)] shrink-0" />
                <span className="font-[family-name:var(--font-code)] text-[9px] font-bold text-[var(--color-text-primary)]">
                  SKILL.md
                </span>
              </div>
              {skill.folderMeta.files
                .filter((f) => !(f.type === "file" && f.name === "SKILL.md"))
                .map((item) => (
                  <PreviewTreeItem
                    key={item.path}
                    item={item}
                    depth={0}
                    expandedFolders={expandedFolders}
                    onToggleFolder={toggleFolder}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Content preview (first ~300 chars) */}
        <div className="px-3 py-2">
          <p className="font-[family-name:var(--font-system)] text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
            Content Preview
          </p>
          <p className="font-[family-name:var(--font-code)] text-[9px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
            {truncateContent(skill.content, 400)}
          </p>
        </div>
      </div>

      {/* Open full button */}
      <div className="shrink-0 p-2 border-t border-t-[var(--color-border-raised-light)]">
        <button
          onClick={onOpen}
          className={cn(
            "w-full py-1.5 text-[10px] font-bold font-[family-name:var(--font-system)]",
            "bg-[var(--color-surface-raised)] cursor-pointer",
            "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
            "active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
            "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]"
          )}
        >
          Open Full Details
        </button>
      </div>
    </div>
  );
}

/* ── Preview tree item (read-only, no file loading) ───────────────────── */

function getPreviewFileIcon(name: string) {
  const ext = name.slice(name.lastIndexOf("."));
  if (CODE_EXTS.has(ext)) return FileCode;
  if ([".log", ".csv"].includes(ext)) return FileText;
  return File;
}

function PreviewTreeItem({
  item,
  depth,
  expandedFolders,
  onToggleFolder,
}: {
  item: SkillFolderFile;
  depth: number;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}) {
  const isFolder = item.type === "folder";
  const isExpanded = expandedFolders.has(item.path);
  const Icon = isFolder ? (isExpanded ? FolderOpen : FolderClosed) : getPreviewFileIcon(item.name);
  const Chevron = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div>
      {isFolder ? (
        <button
          onClick={() => onToggleFolder(item.path)}
          className="flex items-center gap-1 w-full py-0.5 text-left hover:bg-[var(--color-surface)] cursor-pointer"
          style={{ paddingLeft: `${depth * 10 + 4}px` }}
        >
          <Chevron size={8} className="text-[var(--color-text-muted)] shrink-0" />
          <Icon size={10} className="text-[var(--color-warning)] shrink-0" />
          <span className="font-[family-name:var(--font-code)] text-[9px] text-[var(--color-text-primary)] truncate">
            {item.name}/
          </span>
        </button>
      ) : (
        <div
          className="flex items-center gap-1 py-0.5"
          style={{ paddingLeft: `${depth * 10 + 14}px` }}
        >
          <Icon size={10} className="text-[var(--color-text-accent)] shrink-0" />
          <span className="font-[family-name:var(--font-code)] text-[9px] text-[var(--color-text-muted)] truncate">
            {item.name}
          </span>
        </div>
      )}
      {isFolder && isExpanded && item.children?.map((child) => (
        <PreviewTreeItem
          key={child.path}
          item={child}
          depth={depth + 1}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function truncateContent(content: string, maxLen: number): string {
  // Strip frontmatter
  let text = content;
  if (text.startsWith("---")) {
    const end = text.indexOf("---", 3);
    if (end !== -1) text = text.slice(end + 3).trim();
  }
  // Strip markdown headers and formatting for preview
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "[code block]")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();

  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}
