"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { openSkillDetails } from "@/lib/windowHelpers";
import { useSkillsData } from "@/state/skillsData";
import { ArrowLeft } from "lucide-react";
import { TUTORIAL_CONTENT } from "@/data/tutorialContent";
import type { TutorialStep } from "@/data/tutorialContent";
import type { Skill } from "@/types/skill";

/* ── Tutorial data ────────────────────────────────────────────────────────── */

interface Tutorial {
  id: string;
  title: string;
  audience: "beginner" | "power";
  description: string;
  skillIds: string[];      // skills involved
  difficulty: 1 | 2 | 3;
  duration: string;
  heroImage?: string;      // optional hero image path
  accentColor: string;     // per-card accent color
}

const TUTORIALS: Tutorial[] = [
  // ── For non-technical users ────────────────────────────────────────────
  {
    id: "first-email",
    title: "Write a Perfect Email Using Claude",
    audience: "beginner",
    description:
      "Use the email-composer skill to draft professional, warm, or difficult messages. No technical setup — just copy one command.",
    skillIds: ["email-composer"],
    difficulty: 1,
    duration: "5 min",
    heroImage: "/img/tutorials/first-email-hero.webp",
    accentColor: "#2563eb",
  },
  {
    id: "plan-vacation",
    title: "Plan Your Next Trip with AI",
    audience: "beginner",
    description:
      "Use Claude as a travel partner to research destinations, build itineraries, and estimate budgets — all in plain English.",
    skillIds: ["personal-finance-coach"],
    difficulty: 1,
    duration: "10 min",
    heroImage: "/img/tutorials/plan-vacation-hero.webp",
    accentColor: "#0891b2",
  },
  {
    id: "health-letter",
    title: "Write a Letter to Your Doctor",
    audience: "beginner",
    description:
      "Describe your symptoms in plain language and Claude helps you write a clear, organized medical summary.",
    skillIds: ["clinical-diagnostic-reasoning"],
    difficulty: 1,
    duration: "8 min",
    heroImage: "/img/tutorials/health-letter-hero.webp",
    accentColor: "#059669",
  },
  {
    id: "budget-help",
    title: "Make a Budget Spreadsheet",
    audience: "beginner",
    description:
      "Claude creates a personal monthly budget in plain English. Export to Excel or Google Sheets. No formulas needed.",
    skillIds: ["personal-finance-coach"],
    difficulty: 2,
    duration: "15 min",
    heroImage: "/img/tutorials/budget-help-hero.webp",
    accentColor: "#0d9488",
  },
  {
    id: "photo-organize",
    title: "Organize Your Photos and Files",
    audience: "beginner",
    description:
      "Use the photo-content-recognition skill to describe, categorize, and tag your photos with AI assistance.",
    skillIds: ["photo-content-recognition-curation-expert"],
    difficulty: 2,
    duration: "20 min",
    heroImage: "/img/tutorials/photo-organize-hero.webp",
    accentColor: "#6366f1",
  },

  // ── For advanced / Anthropic engineers ────────────────────────────────
  {
    id: "first-agent-swarm",
    title: "Your First Agent Swarm with Orchestrator",
    audience: "power",
    description:
      "Use the orchestrator skill to fan a single goal out to specialist agents in parallel, then synthesize their outputs. Start with a simple 3-node swarm: decompose → parallelize → merge. The foundational multi-agent pattern.",
    skillIds: ["orchestrator", "recursive-synthesis", "agent-creator"],
    difficulty: 3,
    duration: "45 min",
    heroImage: "/img/tutorials/first-agent-swarm-hero.webp",
    accentColor: "#7c3aed",
  },
  {
    id: "adhd-os",
    title: "ADHD OS: Personal Productivity with Background Agents",
    audience: "power",
    description:
      "Wire the adhd-daily-planner skill into a cron-triggered agent that generates your day plan, breaks tasks into time-boxed chunks, and uses wisdom-accountability-coach to track streaks across sessions. Persistent memory via Claude's tool use.",
    skillIds: ["adhd-daily-planner", "background-job-orchestrator", "wisdom-accountability-coach"],
    difficulty: 3,
    duration: "90 min",
    heroImage: "/img/tutorials/adhd-os-hero.webp",
    accentColor: "#d97706",
  },
  {
    id: "pr-review-swarm",
    title: "Parallel PR Review with Multi-Agent Teams",
    audience: "power",
    description:
      "Route a pull request through 4 specialist agents in parallel: security-auditor, code-architecture, vitest-testing-patterns, and typescript-advanced-patterns. Each returns a structured report that the orchestrator merges into a single review.",
    skillIds: ["security-auditor", "code-architecture", "vitest-testing-patterns", "typescript-advanced-patterns"],
    difficulty: 3,
    duration: "60 min",
    heroImage: "/img/tutorials/pr-review-swarm-hero.webp",
    accentColor: "#dc2626",
  },
  {
    id: "skill-composition",
    title: "Skill Composition: Building Complex Tools from Primitives",
    audience: "power",
    description:
      "Learn how to chain skills as sub-agents, pass structured outputs between them, and build higher-level tools from existing skills without modifying them. The recursive-synthesis skill demonstrates this pattern at its most extreme.",
    skillIds: ["skill-architect", "orchestrator", "recursive-synthesis"],
    difficulty: 3,
    duration: "40 min",
    heroImage: "/img/tutorials/skill-composition-hero.webp",
    accentColor: "#059669",
  },
  {
    id: "self-healing-cron",
    title: "Self-Healing Background Jobs with Agent Error Recovery",
    audience: "power",
    description:
      "Use background-job-orchestrator + logging-observability to build cron jobs that detect their own failures, emit structured logs, and either auto-repair or escalate to you with a diagnosis report. The site-reliability-engineer skill handles the on-call playbook.",
    skillIds: ["background-job-orchestrator", "logging-observability", "site-reliability-engineer"],
    difficulty: 3,
    duration: "75 min",
    heroImage: "/img/tutorials/self-healing-cron-hero.webp",
    accentColor: "#0891b2",
  },
];

/* ── Shared styles ────────────────────────────────────────────────────────── */

const win31Btn = cn(
  "px-3 py-1 text-[10px] font-bold font-[family-name:var(--font-system)] cursor-pointer",
  "bg-[var(--color-surface-raised)]",
  "border-2",
  "border-t-[var(--color-border-raised-light)]",
  "border-l-[var(--color-border-raised-light)]",
  "border-b-[var(--color-border-raised-dark)]",
  "border-r-[var(--color-border-raised-dark)]",
  "active:border-t-[var(--color-border-raised-dark)]",
  "active:border-l-[var(--color-border-raised-dark)]",
  "active:border-b-[var(--color-border-raised-light)]",
  "active:border-r-[var(--color-border-raised-light)]"
);

/* ── Detail view ─────────────────────────────────────────────────────────── */

/* ── Tutorial body renderer ────────────────────────────────────────────── */

const TEXT_BASE = "font-[family-name:var(--font-system)] text-[13px] text-[var(--color-text-primary)] leading-[1.6]";

/**
 * Parse inline markdown: **bold**, `code`, plain text.
 */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    const boldPos = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const codePos = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

    if (boldPos === Infinity && codePos === Infinity) {
      parts.push(<span key={idx++}>{remaining}</span>);
      break;
    }

    if (boldPos <= codePos && boldMatch) {
      if (boldPos > 0) parts.push(<span key={idx++}>{remaining.slice(0, boldPos)}</span>);
      parts.push(
        <strong key={idx++} className="font-bold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldPos + boldMatch[0].length);
    } else if (codeMatch) {
      if (codePos > 0) parts.push(<span key={idx++}>{remaining.slice(0, codePos)}</span>);
      parts.push(
        <code
          key={idx++}
          className={cn(
            "px-1 py-0.5 text-[12px]",
            "font-[family-name:var(--font-code)]",
            "bg-[var(--color-code-bg)] text-[var(--color-code-text)]",
            "border border-[var(--color-border-inset-dark)]"
          )}
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codePos + codeMatch[0].length);
    }
  }
  return parts;
}

/**
 * Renders tutorial markdown into React elements.
 * Supports: code fences, **bold**, `inline code`, - bullets, 1. numbered lists, ## headings
 */
function TutorialBody({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let codeBlock: string[] = [];
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fence toggle
    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <pre
            key={`code-${i}`}
            className={cn(
              "p-3 my-2 overflow-x-auto text-[12px] leading-[1.5]",
              "font-[family-name:var(--font-code)]",
              "bg-[var(--color-code-bg)] text-[var(--color-code-text)]",
              "border-2",
              "border-t-[var(--color-border-inset-dark)]",
              "border-l-[var(--color-border-inset-dark)]",
              "border-b-[var(--color-border-inset-light)]",
              "border-r-[var(--color-border-inset-light)]"
            )}
          >
            <code>{codeBlock.join("\n")}</code>
          </pre>
        );
        codeBlock = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBlock.push(line);
      continue;
    }

    // Empty line → spacer
    if (line.trim() === "") {
      elements.push(<div key={`sp-${i}`} className="h-2" />);
      continue;
    }

    // ## Heading
    if (line.startsWith("## ")) {
      elements.push(
        <h4 key={`h-${i}`} className={cn(TEXT_BASE, "font-bold text-[14px] mt-2")}>
          {renderInline(line.slice(3))}
        </h4>
      );
      continue;
    }

    // Numbered list: 1. text
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`ol-${i}`} className={cn(TEXT_BASE, "flex gap-2 pl-1")}>
          <span className="text-[var(--color-text-secondary)] shrink-0 w-4 text-right">{numMatch[1]}.</span>
          <span>{renderInline(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Bullet list: - text
    if (line.startsWith("- ")) {
      elements.push(
        <div key={`li-${i}`} className={cn(TEXT_BASE, "flex gap-2 pl-1")}>
          <span className="text-[var(--color-text-secondary)] shrink-0">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
      continue;
    }

    // | table row — render as preformatted
    if (line.startsWith("|")) {
      elements.push(
        <div key={`tbl-${i}`} className="font-[family-name:var(--font-code)] text-[11px] text-[var(--color-text-primary)] leading-[1.4] whitespace-pre">
          {line}
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className={TEXT_BASE}>
        {renderInline(line)}
      </p>
    );
  }

  return <>{elements}</>;
}

/* ── Detail view ─────────────────────────────────────────────────────────── */

function TutorialDetailView({
  tutorial,
  onBack,
}: {
  tutorial: Tutorial;
  onBack: () => void;
}) {
  const skills = useSkillsData((s) => s.skills);
  const [imgError, setImgError] = useState(false);

  const isBeginner = tutorial.audience === "beginner";
  const accentColor = tutorial.accentColor;
  const gradientFrom = accentColor;
  const gradientTo = `${accentColor}99`;
  const steps: TutorialStep[] = TUTORIAL_CONTENT[tutorial.id] || [];

  const diffLabel = (d: number) => "★".repeat(d) + "☆".repeat(3 - d);

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      {/* Hero image or gradient fallback */}
      {tutorial.heroImage && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tutorial.heroImage}
          alt={`${tutorial.title} hero`}
          className="w-full h-40 object-cover shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="w-full h-28 shrink-0"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        />
      )}

      {/* Colored title bar */}
      <div
        className="px-4 py-2.5 shrink-0"
        style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold cursor-pointer shrink-0",
              "font-[family-name:var(--font-system)]",
              "bg-[rgba(255,255,255,0.15)]",
              "border border-[rgba(255,255,255,0.3)]",
              "text-white hover:bg-[rgba(255,255,255,0.25)]"
            )}
          >
            <ArrowLeft size={10} />
            Back
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-[family-name:var(--font-system)] text-sm font-bold leading-tight truncate">
              {tutorial.title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-white/80 text-[10px] font-[family-name:var(--font-system)]">
            {isBeginner ? "Beginner" : "Power User"}
          </span>
          <span className="text-white/70 text-[10px] font-mono">
            {diffLabel(tutorial.difficulty)}
          </span>
          <span className="text-white/70 text-[10px] font-[family-name:var(--font-system)]">
            {tutorial.duration}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tutorial steps */}
        {steps.length > 0 ? (
          steps.map((step, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-2">
                {/* Accent-colored step number circle */}
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold font-[family-name:var(--font-system)] shrink-0"
                  style={{ background: accentColor }}
                >
                  {idx + 1}
                </span>
                <h3
                  className="font-[family-name:var(--font-system)] text-[14px] font-bold"
                  style={{ color: accentColor }}
                >
                  {step.heading}
                </h3>
              </div>
              <div className={cn(
                "p-3",
                "bg-[var(--color-surface-raised)]",
                "border-2",
                "border-t-[var(--color-border-raised-light)]",
                "border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)]",
                "border-r-[var(--color-border-raised-dark)]"
              )}>
                <TutorialBody text={step.body} />
              </div>
            </div>
          ))
        ) : (
          <div className={cn(
            "p-3",
            "bg-[var(--color-surface-raised)]",
            "border-2",
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]"
          )}>
            <p className="font-[family-name:var(--font-system)] text-[13px] text-[var(--color-text-primary)] leading-relaxed">
              {tutorial.description}
            </p>
          </div>
        )}

        {/* Skills Used */}
        <div>
          <h3 className="font-[family-name:var(--font-system)] text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
            Skills Used in This Tutorial
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {tutorial.skillIds.map((sid) => {
              const s = skills.find((sk) => sk.id === sid);
              if (!s) return (
                <div key={sid} className={cn(
                  "p-2 bg-[var(--color-surface)] opacity-50",
                  "border border-[var(--color-border-inset-dark)]"
                )}>
                  <span className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-muted)]">
                    {sid} (not found)
                  </span>
                </div>
              );
              return (
                <button
                  key={sid}
                  onClick={() => openSkillDetails(s.id, s.title)}
                  className={cn(
                    "flex items-center gap-3 p-2 text-left cursor-pointer",
                    "bg-[var(--color-surface)]",
                    "border-2",
                    "border-t-[var(--color-border-raised-light)]",
                    "border-l-[var(--color-border-raised-light)]",
                    "border-b-[var(--color-border-raised-dark)]",
                    "border-r-[var(--color-border-raised-dark)]",
                    "hover:bg-[var(--color-surface-inset)]"
                  )}
                >
                  {/* Skill hero thumbnail */}
                  <SkillThumbnail skillId={s.id} heroImage={s.heroImage} />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-system)] text-[11px] font-bold text-[var(--color-text-primary)] truncate">
                      {s.title}
                    </p>
                    <p className="font-[family-name:var(--font-system)] text-[9px] text-[var(--color-text-secondary)] truncate mt-0.5">
                      {s.category}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold font-[family-name:var(--font-system)] shrink-0 px-1.5 py-0.5"
                    style={{ color: accentColor }}
                  >
                    Open →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Skill thumbnail helper ──────────────────────────────────────────────── */

function SkillThumbnail({ skillId, heroImage }: { skillId: string; heroImage?: string }) {
  const [err, setErr] = useState(false);
  const imgSrc = heroImage || `/img/skills/${skillId}-hero.webp`;

  if (err) {
    return (
      <div className="w-12 h-8 shrink-0 bg-[var(--color-surface-inset)] border border-[var(--color-border-inset-dark)] flex items-center justify-center">
        <span className="text-[8px] font-[family-name:var(--font-code)] text-[var(--color-text-muted)]">
          .md
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={skillId}
      className="w-12 h-8 object-cover shrink-0 border border-[var(--color-border-inset-dark)]"
      onError={() => setErr(true)}
    />
  );
}

/* ── Tutorial list card ─────────────────────────────────────────────────── */

function TutorialListCard({
  tutorial: t,
  skills,
  onSelect,
  audienceLabel,
  diffLabel,
}: {
  tutorial: Tutorial;
  skills: Skill[];
  onSelect: () => void;
  audienceLabel: (a: string) => string;
  diffLabel: (d: number) => string;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left cursor-pointer",
        "bg-[var(--color-surface)]",
        "border-2",
        "border-t-[var(--color-border-raised-light)]",
        "border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)]",
        "border-r-[var(--color-border-raised-dark)]",
        "hover:bg-[var(--color-surface-inset)]",
        "transition-colors",
        "overflow-hidden",
        "flex"
      )}
    >
      {/* Hero thumbnail */}
      {t.heroImage && !imgErr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.heroImage}
          alt=""
          className="w-20 shrink-0 object-cover"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div
          className="w-20 shrink-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor}88)` }}
        >
          <span className="text-white/90 text-2xl font-bold font-[family-name:var(--font-system)]">
            {t.title.charAt(0)}
          </span>
        </div>
      )}

      {/* Content area with colored left border */}
      <div
        className="flex-1 min-w-0 p-3"
        style={{ borderLeft: `3px solid ${t.accentColor}` }}
      >
        {/* Header row */}
        <div className="flex items-start gap-2 mb-1">
          <span className="font-[family-name:var(--font-system)] text-xs font-bold text-[var(--color-text-primary)] flex-1 leading-tight">
            {t.title}
          </span>
          <span
            className="text-[9px] font-bold font-[family-name:var(--font-system)] shrink-0 px-1.5 py-0.5 rounded-sm"
            style={{ color: t.accentColor }}
          >
            {audienceLabel(t.audience)}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-[var(--color-text-secondary)] font-[family-name:var(--font-system)] leading-relaxed mb-2 line-clamp-2">
          {t.description}
        </p>

        {/* Footer row: skills + meta */}
        <div className="flex items-center gap-1 flex-wrap">
          {t.skillIds.map((sid) => {
            const s = skills.find((sk) => sk.id === sid);
            return (
              <span
                key={sid}
                className={cn(
                  "text-[9px] px-1.5 py-0.5",
                  "font-[family-name:var(--font-system)]",
                  "bg-[var(--color-surface-inset)]",
                  "border border-[var(--color-border-inset-light)]",
                )}
                style={{ color: t.accentColor }}
              >
                {s?.title ?? sid}
              </span>
            );
          })}
          <span className="ml-auto text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)] shrink-0">
            {t.duration}
          </span>
          <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
            {diffLabel(t.difficulty)}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function TutorialsWindow() {
  const [audience, setAudience] = useState<"all" | "beginner" | "power">("all");
  const [selected, setSelected] = useState<Tutorial | null>(null);
  const skills = useSkillsData((s) => s.skills);

  // Detail view
  if (selected) {
    return <TutorialDetailView tutorial={selected} onBack={() => setSelected(null)} />;
  }

  const visible = TUTORIALS.filter(
    (t) => audience === "all" || t.audience === audience
  );

  const diffLabel  = (d: number) => "★".repeat(d) + "☆".repeat(3 - d);
  const audienceLabel = (a: string) =>
    a === "beginner" ? "Beginner" : "Power User";

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      {/* Filter bar */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 shrink-0",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-inset-light)]"
      )}>
        {(["all", "beginner", "power"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setAudience(f)}
            className={cn(
              "px-3 py-1 text-[10px] font-bold font-[family-name:var(--font-system)] cursor-pointer",
              "border-2",
              audience === f
                ? ["bg-[var(--color-surface-inset)]",
                    "border-t-[var(--color-border-raised-dark)]",
                    "border-l-[var(--color-border-raised-dark)]",
                    "border-b-[var(--color-border-raised-light)]",
                    "border-r-[var(--color-border-raised-light)]"].join(" ")
                : ["bg-[var(--color-surface-raised)]",
                    "border-t-[var(--color-border-raised-light)]",
                    "border-l-[var(--color-border-raised-light)]",
                    "border-b-[var(--color-border-raised-dark)]",
                    "border-r-[var(--color-border-raised-dark)]"].join(" ")
            )}
          >
            {f === "all" ? "All" : f === "beginner" ? "Beginners" : "Power Users"}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)]">
          {visible.length} tutorials
        </span>
      </div>

      {/* Tutorial list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {visible.map((t) => (
          <TutorialListCard
            key={t.id}
            tutorial={t}
            skills={skills}
            onSelect={() => setSelected(t)}
            audienceLabel={audienceLabel}
            diffLabel={diffLabel}
          />
        ))}
      </div>
    </div>
  );
}
