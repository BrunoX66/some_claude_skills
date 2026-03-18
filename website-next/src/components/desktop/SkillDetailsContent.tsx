"use client";

import {
  Download, ExternalLink, FileCode, File, FileText,
  FolderOpen, FolderClosed, ChevronRight, ChevronDown,
  Heart, Star,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { Win31Prose } from "@/components/win31";
import { useSkillNav } from "@/state/skillNav";
import { useSkillsData } from "@/state/skillsData";
import { openSkillDetails } from "@/lib/windowHelpers";
import { downloadSkillZip } from "@/utils/downloadSkillZip";
import { useStarredSkills } from "@/hooks/useStarredSkills";
import { useExplorationProgress } from "@/hooks/useExplorationProgress";
import { useExplorationStreak } from "@/hooks/useExplorationStreak";
import { estimateReadTime } from "@/utils/readTime";
import { InstallTabs } from "./InstallTabs";
import { SkillNavBar } from "./SkillNavBar";
import { cn } from "@/lib/utils";
import type { SkillFolderFile } from "@/types/skill";

/* ── Constants ───────────────────────────────────────────────────────────── */

const GITHUB_BASE = "https://github.com/erichowens/some_claude_skills/blob/main/.claude/skills";
const RAW_BASE    = "https://raw.githubusercontent.com/erichowens/some_claude_skills/main/.claude/skills";

const CODE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".sh", ".md", ".json", ".yaml", ".yml", ".css", ".txt"]);

/* ── File tree ───────────────────────────────────────────────────────────── */

function getFileIcon(name: string) {
  const ext = name.slice(name.lastIndexOf("."));
  if (CODE_EXTS.has(ext)) return FileCode;
  if ([".log", ".csv"].includes(ext)) return FileText;
  return File;
}

function TreeItem({
  item, skillId, depth, selectedPath, expandedFolders, onSelectFile, onToggleFolder,
}: {
  item: SkillFolderFile; skillId: string; depth: number;
  selectedPath: string | null; expandedFolders: Set<string>;
  onSelectFile: (path: string) => void; onToggleFolder: (path: string) => void;
}) {
  const isFolder   = item.type === "folder";
  const isExpanded = expandedFolders.has(item.path);
  const isSelected = selectedPath === item.path;
  const Icon    = isFolder ? (isExpanded ? FolderOpen : FolderClosed) : getFileIcon(item.name);
  const Chevron = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div>
      {isFolder ? (
        <button
          onClick={() => onToggleFolder(item.path)}
          className="flex items-center gap-1 w-full py-0.5 text-left hover:bg-[var(--color-surface)]"
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          <Chevron size={9} className="text-[var(--color-text-muted)] shrink-0" />
          <Icon size={12} className="text-[var(--color-warning)] shrink-0" />
          <span className="font-[family-name:var(--font-code)] text-[10px] text-[var(--color-text-primary)] truncate">
            {item.name}/
          </span>
        </button>
      ) : (
        <button
          onClick={() => onSelectFile(item.path)}
          className={cn(
            "flex items-center gap-1 w-full py-0.5 text-left",
            isSelected ? "bg-[var(--color-titlebar-active)]" : "hover:bg-[var(--color-surface)]"
          )}
          style={{ paddingLeft: `${depth * 12 + 16}px` }}
        >
          <Icon size={12} className={isSelected ? "text-[var(--color-titlebar-text)] shrink-0" : "text-[var(--color-text-accent)] shrink-0"} />
          <span className={cn(
            "font-[family-name:var(--font-code)] text-[10px] truncate",
            isSelected ? "text-[var(--color-titlebar-text)]" : "text-[var(--color-text-primary)]"
          )}>
            {item.name}
          </span>
        </button>
      )}
      {isFolder && isExpanded && item.children?.map((child) => (
        <TreeItem
          key={child.path}
          item={child} skillId={skillId} depth={depth + 1}
          selectedPath={selectedPath} expandedFolders={expandedFolders}
          onSelectFile={onSelectFile} onToggleFolder={onToggleFolder}
        />
      ))}
    </div>
  );
}

/* ── Community ratings ───────────────────────────────────────────────────── */

// Deterministic seed so each skill has consistent "community" data
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededFloat(seed: number, min: number, max: number, decimals = 1) {
  const frac = (seed % 1000) / 1000;
  return parseFloat((min + frac * (max - min)).toFixed(decimals));
}

function getCommunityData(skillId: string) {
  const seed = hashSeed(skillId);
  const rating  = seededFloat(seed,       3.4, 4.9);
  const count   = 10 + (seed % 190); // 10–199 ratings
  return { rating, count };
}

function StarRating({
  value, max = 5, interactive = false, size = 12,
  onChange,
}: {
  value: number; max?: number; interactive?: boolean; size?: number;
  onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= display;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled ? "text-[var(--color-warning)]" : "text-[var(--color-border-inset-dark)]",
              interactive && "cursor-pointer transition-colors"
            )}
            fill={filled ? "currentColor" : "none"}
            onMouseEnter={() => interactive && setHover(i + 1)}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}

function useSkillRating(skillId: string) {
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`scs-rating-${skillId}`);
      if (raw) setUserRating(parseInt(raw));
    } catch { /* ignore */ }
  }, [skillId]);

  const rate = useCallback((stars: number) => {
    setUserRating(stars);
    try { localStorage.setItem(`scs-rating-${skillId}`, String(stars)); } catch { /* ignore */ }
  }, [skillId]);

  return { userRating, rate };
}

/* ── Community reviews ───────────────────────────────────────────────────── */

interface Review { author: string; stars: number; text: string; date: string; }

// Seeded sample reviews per skill
const SAMPLE_AUTHORS = ["dev_a", "ml_researcher", "prompter99", "cluade_fan", "swe42", "anon_user"];
const SAMPLE_TEXTS = [
  "Saves me hours every sprint. Exactly what I needed.",
  "Works out of the box. Clear instructions too.",
  "Great for my workflow — been using it daily.",
  "Simple but powerful. Recommended.",
  "Does what it says. Could use more examples.",
  "Solid skill, picked it up in minutes.",
];

function getSeedReviews(skillId: string): Review[] {
  const seed  = hashSeed(skillId);
  const count = 2 + (seed % 2); // 2–3 reviews
  return Array.from({ length: count }).map((_, i) => ({
    author: SAMPLE_AUTHORS[(seed + i * 3) % SAMPLE_AUTHORS.length],
    stars:  4 + ((seed + i) % 2),
    text:   SAMPLE_TEXTS[(seed + i * 7) % SAMPLE_TEXTS.length],
    date:   `${2024 + ((seed + i) % 2)}-${String(1 + ((seed * (i + 1)) % 12)).padStart(2, "0")}`,
  }));
}

function useSkillReviews(skillId: string) {
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`scs-review-${skillId}`);
      if (raw) setUserReview(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [skillId]);

  const submit = useCallback((review: Review) => {
    setUserReview(review);
    try { localStorage.setItem(`scs-review-${skillId}`, JSON.stringify(review)); } catch { /* ignore */ }
  }, [skillId]);

  return { userReview, submit };
}

/* ── Right panel (Install | Community) ───────────────────────────────────── */

function RightPanel({ skillId, skillTitle }: { skillId: string; skillTitle: string }) {
  const [tab, setTab] = useState<"install" | "community">("install");
  const [downloading, setDownloading] = useState(false);
  const { rating, count } = getCommunityData(skillId);
  const { userRating, rate } = useSkillRating(skillId);
  const { userReview, submit } = useSkillReviews(skillId);
  const [draftText, setDraftText] = useState("");
  const [draftStars, setDraftStars] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const seedReviews = getSeedReviews(skillId);

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadSkillZip(skillId); }
    finally { setDownloading(false); }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-b-[var(--color-border-inset-dark)]">
        {(["install", "community"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-1 text-[10px] font-bold font-[family-name:var(--font-system)] capitalize",
              tab === t
                ? "bg-[var(--color-surface-inset)] text-[var(--color-text-accent)] border-b-2 border-b-[var(--color-text-accent)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {t === "install" ? "Install" : "Community"}
          </button>
        ))}
      </div>

      {/* Install tab */}
      {tab === "install" && (
        <div className="flex-1 overflow-y-auto">
          {/* Download button */}
          <div className="px-2 py-2 border-b border-b-[var(--color-border-inset-light)]">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 px-2 py-1.5",
                "text-[10px] font-bold font-[family-name:var(--font-system)]",
                "bg-[var(--color-surface-raised)] cursor-pointer",
                "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Download size={10} />
              {downloading ? "Downloading..." : "Download ZIP"}
            </button>
          </div>
          <div className="p-2">
            <InstallTabs skillId={skillId} skillName={skillTitle} />
          </div>
        </div>
      )}

      {/* Community tab */}
      {tab === "community" && (
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {/* Aggregate rating */}
          <div className={cn(
            "p-2 bg-[var(--color-surface-inset)]",
            "border border-[var(--color-border-inset-dark)]"
          )}>
            <p className="font-[family-name:var(--font-system)] text-[9px] text-[var(--color-text-muted)] mb-1 uppercase tracking-wide">
              Community Rating
            </p>
            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-code)] text-[18px] font-bold text-[var(--color-warning)] leading-none">
                {rating.toFixed(1)}
              </span>
              <div>
                <StarRating value={rating} size={11} />
                <p className="font-[family-name:var(--font-code)] text-[9px] text-[var(--color-text-muted)] mt-0.5">
                  {count} ratings
                </p>
              </div>
            </div>
          </div>

          {/* User rating */}
          <div>
            <p className="font-[family-name:var(--font-system)] text-[9px] text-[var(--color-text-muted)] mb-1 uppercase tracking-wide">
              Your Rating
            </p>
            <StarRating value={userRating} interactive size={14} onChange={rate} />
            {userRating > 0 && (
              <p className="font-[family-name:var(--font-code)] text-[9px] text-[var(--color-text-muted)] mt-0.5">
                You rated: {userRating}/5
              </p>
            )}
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="font-[family-name:var(--font-system)] text-[9px] text-[var(--color-text-muted)] uppercase tracking-wide">
                Reviews
              </p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className={cn(
                    "px-1.5 py-0.5 text-[9px] font-[family-name:var(--font-system)] font-bold",
                    "bg-[var(--color-surface-raised)]",
                    "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
                    "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
                    "cursor-pointer"
                  )}
                >
                  + Write
                </button>
              )}
            </div>

            {showForm && (
              <div className="mb-2 space-y-1.5">
                <StarRating value={draftStars} interactive size={14} onChange={setDraftStars} />
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Your review..."
                  rows={3}
                  className={cn(
                    "w-full text-[10px] font-[family-name:var(--font-code)] p-1.5 resize-none",
                    "bg-white text-black border-2",
                    "border-t-[var(--color-border-inset-dark)] border-l-[var(--color-border-inset-dark)]",
                    "border-b-[var(--color-border-raised-light)] border-r-[var(--color-border-raised-light)]",
                    "outline-none"
                  )}
                />
                <div className="flex gap-1">
                  <button
                    disabled={!draftText.trim() || !draftStars}
                    onClick={() => {
                      submit({ author: "you", stars: draftStars, text: draftText.trim(), date: new Date().toISOString().slice(0, 7) });
                      setShowForm(false);
                      setDraftText(""); setDraftStars(0);
                    }}
                    className={cn(
                      "flex-1 py-0.5 text-[9px] font-bold font-[family-name:var(--font-system)]",
                      "bg-[var(--color-surface-raised)] cursor-pointer",
                      "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
                      "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
                      "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >Submit</button>
                  <button
                    onClick={() => { setShowForm(false); setDraftText(""); setDraftStars(0); }}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-[family-name:var(--font-system)]",
                      "bg-[var(--color-surface-raised)] cursor-pointer",
                      "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
                      "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]"
                    )}
                  >Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {userReview && (
                <ReviewCard review={{ ...userReview, author: "you ✓" }} highlight />
              )}
              {seedReviews.map((r, i) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, highlight = false }: { review: Review; highlight?: boolean }) {
  return (
    <div className={cn(
      "p-1.5 border text-[9px]",
      highlight
        ? "border-[var(--color-text-accent)] bg-[var(--color-surface-inset)]"
        : "border-[var(--color-border-inset-dark)] bg-[var(--color-surface)]"
    )}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-[family-name:var(--font-code)] text-[var(--color-text-muted)]">{review.author}</span>
        <span className="text-[var(--color-text-muted)]">{review.date}</span>
      </div>
      <StarRating value={review.stars} size={9} />
      <p className="font-[family-name:var(--font-system)] text-[var(--color-text-secondary)] mt-0.5 leading-tight">
        {review.text}
      </p>
    </div>
  );
}

/* ── Syntax-highlighted markdown pane ────────────────────────────────────── */

function MarkdownPane({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Highlight all code blocks lazily
    import("highlight.js").then((mod) => {
      const hljs = mod.default;
      ref.current?.querySelectorAll("pre code").forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
      });
    });
  }, [content]);

  return (
    <>
      <style>{HLJS_WIN31_THEME}</style>
      <div
        ref={ref}
        className="prose-win31"
        dangerouslySetInnerHTML={{ __html: renderPlainMarkdown(content) }}
      />
    </>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */

export function SkillDetailsContent() {
  const currentSkillId = useSkillNav((s) => s.currentSkillId);
  const skills = useSkillsData((s) => s.skills);
  const { starredIds: favorites, toggleStar: toggleFav } = useStarredSkills();
  const { markExplored } = useExplorationProgress();
  const { incrementStreak } = useExplorationStreak();

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent]           = useState<string | null>(null);
  const [fileLoading, setFileLoading]           = useState(false);
  const [expandedFolders, setExpandedFolders]   = useState<Set<string>>(new Set());
  const [downloading, setDownloading]           = useState(false);

  const skill = skills.find((s) => s.id === currentSkillId);

  // Track exploration on skill view
  const markedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!skill || markedRef.current === skill.id) return;
    markedRef.current = skill.id;
    const isNew = markExplored(skill.id);
    if (isNew) incrementStreak();
  }, [skill, markExplored, incrementStreak]);

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);

  const handleSelectFile = useCallback(async (path: string) => {
    if (!skill) return;
    setSelectedFilePath(path);
    setFileLoading(true);
    setFileContent(null);
    try {
      const url = `${RAW_BASE}/${skill.id}/${path}`;
      const res = await fetch(url);
      setFileContent(res.ok ? await res.text() : `Could not load: ${path}`);
    } catch {
      setFileContent(`Error loading: ${path}`);
    } finally {
      setFileLoading(false);
    }
  }, [skill]);

  const handleSelectSkillMd = useCallback(() => {
    setSelectedFilePath(null);
    setFileContent(null);
  }, []);

  if (!skill) {
    return (
      <div className="h-full flex flex-col">
        <SkillNavBar />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-muted)]">
            No skill selected. Use the typeahead above or click a skill icon.
          </p>
        </div>
      </div>
    );
  }

  const isFav       = favorites.has(skill.id);
  const githubUrl   = `${GITHUB_BASE}/${skill.id}`;
  const isMarkdown  = selectedFilePath?.endsWith(".md") ?? true;

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadSkillZip(skill.id); }
    finally { setDownloading(false); }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      <SkillNavBar />

      {/* ── Hero image — always shown ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={skill.heroImage}
        alt={`${skill.title} hero`}
        className="w-full h-48 object-cover border-b border-[var(--color-border-raised-dark)] shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />

      {/* ── Metadata bar ── */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 flex-wrap shrink-0",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-inset-light)]"
      )}>
        <span className={cn(
          "text-[10px] font-bold font-[family-name:var(--font-system)]",
          "text-[var(--color-text-accent)] bg-[var(--color-surface-inset)]",
          "border border-[var(--color-border-inset-light)] px-1.5 py-0.5"
        )}>
          {skill.category}
        </span>
        {skill.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={cn(
            "text-[9px] font-[family-name:var(--font-system)] text-[var(--color-text-muted)]",
            "border border-[var(--color-border-inset-light)] px-1 py-0.5"
          )}>
            {tag}
          </span>
        ))}
        <span className={cn(
          "text-[9px] font-[family-name:var(--font-system)] text-[var(--color-text-muted)]",
          "border border-[var(--color-border-inset-light)] px-1 py-0.5"
        )}>
          ~{estimateReadTime(skill.content)} min read
        </span>
        {selectedFilePath && (
          <span className="font-[family-name:var(--font-code)] text-[10px] text-[var(--color-text-muted)] truncate max-w-[180px]">
            {selectedFilePath}
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          {/* Favorite heart */}
          <button
            onClick={() => toggleFav(skill.id)}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
            className={cn(
              "flex items-center gap-0.5 px-1.5 py-0.5 cursor-pointer",
              "bg-[var(--color-surface-raised)]",
              "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
              "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
              "text-[10px] font-[family-name:var(--font-system)]"
            )}
          >
            <Heart
              size={10}
              fill={isFav ? "currentColor" : "none"}
              className={isFav ? "text-red-500" : "text-[var(--color-text-muted)]"}
            />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5",
              "text-[10px] font-bold font-[family-name:var(--font-system)]",
              "bg-[var(--color-surface-raised)] cursor-pointer",
              "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
              "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Download size={10} />
            {downloading ? "..." : "ZIP"}
          </button>
        </div>
      </div>

      {/* ── Three-column body ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Col 1: File tree ── */}
        <div
          className={cn(
            "flex flex-col shrink-0 overflow-hidden",
            "border-r border-r-[var(--color-border-inset-dark)]",
            "bg-[var(--color-surface)]"
          )}
          style={{ width: 160 }}
        >
          {/* SKILL.md entry */}
          <button
            onClick={handleSelectSkillMd}
            className={cn(
              "flex items-center gap-1 w-full py-1 px-2 text-left shrink-0",
              selectedFilePath === null
                ? "bg-[var(--color-titlebar-active)]"
                : "hover:bg-[var(--color-surface-inset)]"
            )}
          >
            <FileCode
              size={12}
              className={selectedFilePath === null ? "text-[var(--color-titlebar-text)] shrink-0" : "text-[var(--color-text-accent)] shrink-0"}
            />
            <span className={cn(
              "font-[family-name:var(--font-code)] text-[10px] font-bold",
              selectedFilePath === null ? "text-[var(--color-titlebar-text)]" : "text-[var(--color-text-primary)]"
            )}>
              SKILL.md
            </span>
          </button>

          <div className="flex-1 overflow-y-auto py-0.5">
            {skill.folderMeta.hasContent && skill.folderMeta.files
              .filter((f) => !(f.type === "file" && f.name === "SKILL.md"))
              .map((item) => (
                <TreeItem
                  key={item.path}
                  item={item} skillId={skill.id} depth={0}
                  selectedPath={selectedFilePath} expandedFolders={expandedFolders}
                  onSelectFile={handleSelectFile} onToggleFolder={toggleFolder}
                />
              ))}
          </div>

          {/* GitHub link */}
          <div className="shrink-0 px-2 py-1 border-t border-t-[var(--color-border-inset-light)]">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[9px] font-[family-name:var(--font-code)] text-[var(--color-text-link)] no-underline hover:underline"
            >
              <ExternalLink size={9} />
              GitHub
            </a>
          </div>
        </div>

        {/* ── Col 2: Content pane ── */}
        <div
          className="flex-1 flex flex-col min-w-0"
          onClick={(e) => {
            const a = (e.target as HTMLElement).closest("a");
            if (!a?.href) return;
            const url = new URL(a.href);
            if (url.pathname.startsWith("/skills/")) {
              e.preventDefault();
              const id = url.pathname.replace("/skills/", "");
              const target = skills.find((s) => s.id === id);
              if (target) openSkillDetails(target.id, target.title);
            }
          }}
        >
          <div className="flex-1 overflow-auto p-3">
            {selectedFilePath === null ? (
              <Win31Prose contentHtml={skill.contentHtml} />
            ) : fileLoading ? (
              <p className="font-[family-name:var(--font-code)] text-[10px] text-[var(--color-text-muted)]">Loading...</p>
            ) : fileContent !== null ? (
              isMarkdown ? (
                <MarkdownPane content={fileContent} />
              ) : (
                <pre className="font-[family-name:var(--font-code)] text-[11px] text-[var(--color-text-primary)] whitespace-pre-wrap break-words">
                  {fileContent}
                </pre>
              )
            ) : null}
          </div>
        </div>

        {/* ── Col 3: Install / Community ── */}
        <div
          className="shrink-0 border-l border-l-[var(--color-border-inset-dark)]"
          style={{ width: 260 }}
        >
          <RightPanel skillId={skill.id} skillTitle={skill.title} />
        </div>
      </div>
    </div>
  );
}

/* ── Minimal markdown renderer ────────────────────────────────────────────── */

function renderPlainMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/```([\w]*)\n([\s\S]*?)```/g, "<pre><code class=\"language-$1\">$2</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^---+$/gm, "<hr />")
    .split(/\n{2,}/).map((block) => {
      if (/^<(h[1-6]|pre|blockquote|li|hr)/.test(block.trim())) return block;
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    }).join("\n");
}

/* ── Win31-flavored highlight.js theme ───────────────────────────────────── */

const HLJS_WIN31_THEME = `
.hljs { background: #1a1a2e; color: #e0e0f0; padding: 0; }
.hljs-keyword, .hljs-selector-tag { color: #66b3ff; font-weight: bold; }
.hljs-string, .hljs-attr { color: #7fffb2; }
.hljs-number, .hljs-literal { color: #ffcc66; }
.hljs-comment { color: #888aaa; font-style: italic; }
.hljs-title, .hljs-name { color: #ff99cc; }
.hljs-type { color: #80d0ff; }
.hljs-built_in { color: #ffa07a; }
.hljs-variable { color: #e0e0f0; }
.hljs-symbol { color: #ff99cc; }
`;
