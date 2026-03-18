"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { openSkillDetails } from "@/lib/windowHelpers";
import { useSkillsData } from "@/state/skillsData";

/* ── Curated artifacts ───────────────────────────────────────────────────── */

interface Artifact {
  id: string;
  title: string;
  skillId: string;
  tagline: string;
  why: string;
  highlight: string;  // one-liner quote from the artifact
  heroImage?: string; // optional hero image path
  accentColor?: string; // accent for detail view
}

/**
 * Map artifact skillIds to existing hero images in /img/artifacts/.
 * These have long timestamped filenames from the original generation.
 */
const ARTIFACT_IMAGE_MAP: Record<string, string> = {
  "skill-coach": "/img/artifacts/skill-coach-self-improvement-hero_2025-11-25T09-00-16-040Z.png",
  "site-reliability-engineer": "/img/artifacts/site-reliability-engineer-integration-hero_2025-11-26T07-36-24-786Z.png",
  "code-necromancer": "/img/artifacts/vaporwave-midi-player-hero_2025-11-25T09-44-41-839Z.png",
  "orchestrator": "/img/artifacts/orchestrator-hero.webp",
  "recursive-synthesis": "/img/artifacts/recursive-synthesis-hero.webp",
  "adhd-daily-planner": "/img/artifacts/adhd-planner-hero.webp",
};

const ARTIFACTS: Artifact[] = [
  {
    id: "skill-coach-review",
    title: "Skill Coach: Real-Time Quality Review",
    skillId: "skill-coach",
    tagline: "A meta-skill that coaches you while you build other skills",
    why: "This is the most recursive artifact in the gallery: a skill that reviews skills. It reads SKILL.md files, rates them against rubrics, and gives actionable rewrites. Watching it improve itself is mesmerizing.",
    highlight: '"Your description formula is missing the exclusions clause. Add NOT FOR: [use-case] to prevent misrouting."',
    accentColor: "#6366f1",
  },
  {
    id: "orchestrator-artifact",
    title: "Orchestrator: Coordinate Agent Teams",
    skillId: "orchestrator",
    tagline: "The master coordinator for multi-skill parallel workflows",
    why: "The Orchestrator skill is how you get multiple Claude agents working in formation. It accepts a goal, decomposes it into routable subtasks, fans out to specialists, and synthesizes their outputs into a single coherent result. The most architectural skill in the gallery.",
    highlight: '"Decompose → Route → Parallelize → Synthesize. The agent loop in four words."',
    accentColor: "#0891b2",
  },
  {
    id: "recursive-synthesis-artifact",
    title: "Recursive Synthesis: Multi-Agent Collaboration",
    skillId: "recursive-synthesis",
    tagline: "Orchestrate agents that orchestrate agents",
    why: "This skill demonstrates the meta-level: an agent whose job is to spawn, coordinate, and synthesize other agents. Essential reading for understanding agentic architecture.",
    highlight: '"Synthesis is not summarization — it finds the emergent insight no single agent could see."',
    accentColor: "#7c3aed",
  },
  {
    id: "skill-architect-artifact",
    title: "Skill Architect: Full Skill Lifecycle",
    skillId: "skill-architect",
    tagline: "Design, audit, and score skills end-to-end",
    why: "The most comprehensive single skill in the gallery. It handles the entire lifecycle: brainstorm → spec → implement → test → score → improve. Reference architecture for any serious skill author.",
    highlight: '"Atomic, composable, self-documenting. That\'s the goal."',
    accentColor: "#059669",
  },
  {
    id: "adhd-planner-artifact",
    title: "ADHD Daily Planner: Time-Blind Friendly",
    skillId: "adhd-daily-planner",
    tagline: "Planning system built for executive function challenges",
    why: "A rare example of a skill built around accessibility and cognitive differences, not just technical capability. The time-boxing and interrupt strategies are practically useful for anyone, ADHD or not.",
    highlight: '"Time-blindness is a navigation problem. This skill is the map."',
    accentColor: "#d97706",
  },
  {
    id: "code-necromancer-artifact",
    title: "Code Necromancer: Resurrect Legacy Code",
    skillId: "code-necromancer",
    tagline: "Bring dead codebases back to life, systematically",
    why: "One of the most practically useful skills in the gallery — a structured framework for approaching scary old code. Reads like a thriller, works like a surgeon.",
    highlight: '"You don\'t debug legacy code. You perform an archaeological excavation."',
    accentColor: "#dc2626",
  },
];

/* ── Detail View ─────────────────────────────────────────────────────────── */

function ArtifactDetailView({
  artifact,
  onBack,
}: {
  artifact: Artifact;
  onBack: () => void;
}) {
  const skills = useSkillsData((s) => s.skills);
  const skill = skills.find((s) => s.id === artifact.skillId);
  const [imgError, setImgError] = useState(false);

  const accent = artifact.accentColor || "var(--color-text-accent)";
  const heroSrc = ARTIFACT_IMAGE_MAP[artifact.skillId] || `/img/skills/${artifact.skillId}-hero.webp`;

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      {/* Hero image or gradient fallback */}
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroSrc}
          alt={`${artifact.title} hero`}
          className="w-full h-40 object-cover shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="w-full h-28 shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}
        />
      )}

      {/* Accent title bar */}
      <div
        className="px-4 py-2.5 shrink-0"
        style={{ background: accent }}
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
              {artifact.title}
            </h2>
            <p className="text-white/70 text-[10px] font-[family-name:var(--font-system)] truncate mt-0.5">
              {artifact.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Why this matters */}
        <div>
          <h3 className="font-[family-name:var(--font-system)] text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
            Why This Matters
          </h3>
          <div className={cn(
            "p-3",
            "bg-[var(--color-surface)]",
            "border-2",
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]"
          )}>
            <p className="font-[family-name:var(--font-system)] text-[11px] text-[var(--color-text-primary)] leading-relaxed">
              {artifact.why}
            </p>
          </div>
        </div>

        {/* Pull quote */}
        <blockquote
          className={cn(
            "pl-3 py-2 italic",
            "font-[family-name:var(--font-code)] text-[12px] leading-relaxed",
            "text-[var(--color-text-secondary)]"
          )}
          style={{ borderLeft: `3px solid ${accent}` }}
        >
          {artifact.highlight}
        </blockquote>

        {/* Action buttons */}
        <div className="flex gap-2">
          {skill && (
            <button
              onClick={() => openSkillDetails(skill.id, skill.title)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5",
                "text-[10px] font-bold font-[family-name:var(--font-system)]",
                "bg-[var(--color-surface-raised)] cursor-pointer",
                "border-2",
                "border-t-[var(--color-border-raised-light)]",
                "border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)]",
                "border-r-[var(--color-border-raised-dark)]",
                "active:border-t-[var(--color-border-raised-dark)]",
                "active:border-l-[var(--color-border-raised-dark)]",
                "active:border-b-[var(--color-border-raised-light)]",
                "active:border-r-[var(--color-border-raised-light)]"
              )}
            >
              Open Skill
            </button>
          )}
          <a
            href={`https://github.com/erichowens/some_claude_skills/tree/main/.claude/skills/${artifact.skillId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 no-underline",
              "text-[10px] font-[family-name:var(--font-system)]",
              "text-[var(--color-text-primary)]",
              "bg-[var(--color-surface-raised)]",
              "border-2",
              "border-t-[var(--color-border-raised-light)]",
              "border-l-[var(--color-border-raised-light)]",
              "border-b-[var(--color-border-raised-dark)]",
              "border-r-[var(--color-border-raised-dark)]"
            )}
          >
            <ExternalLink size={10} />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Artifact thumbnail helper ──────────────────────────────────────────── */

function ArtifactThumbnail({ artifact }: { artifact: Artifact }) {
  const [err, setErr] = useState(false);
  const imgSrc = ARTIFACT_IMAGE_MAP[artifact.skillId] || `/img/skills/${artifact.skillId}-hero.webp`;
  const accent = artifact.accentColor || "var(--color-text-accent)";

  if (err) {
    return (
      <div
        className="w-20 shrink-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}
      >
        <span className="text-white/90 text-2xl font-bold font-[family-name:var(--font-system)]">
          {artifact.title.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt=""
      className="w-20 shrink-0 object-cover"
      onError={() => setErr(true)}
    />
  );
}

/* ── Artifact list card ────────────────────────────────────────────────── */

function ArtifactListCard({
  artifact: a,
  onSelect,
}: {
  artifact: Artifact;
  onSelect: () => void;
}) {
  const accent = a.accentColor || "var(--color-text-accent)";

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
        "overflow-hidden"
      )}
    >
      {/* Thicker color accent strip */}
      <div className="h-1.5 w-full" style={{ background: accent }} />

      <div className="flex">
        {/* Hero thumbnail */}
        <ArtifactThumbnail artifact={a} />

        {/* Content area with colored left border */}
        <div
          className="flex-1 min-w-0 p-3"
          style={{ borderLeft: `3px solid ${accent}` }}
        >
          <p className="font-[family-name:var(--font-system)] text-xs font-bold text-[var(--color-text-primary)] leading-tight">
            {a.title}
          </p>
          <p className="font-[family-name:var(--font-system)] text-[10px] mt-0.5" style={{ color: accent }}>
            {a.tagline}
          </p>

          <p className="text-[11px] text-[var(--color-text-secondary)] font-[family-name:var(--font-system)] leading-relaxed mt-1.5 mb-2 line-clamp-2">
            {a.why}
          </p>

          {/* Pull quote */}
          <blockquote className={cn(
            "pl-2 border-l-2",
            "font-[family-name:var(--font-code)] text-[9px] italic",
            "text-[var(--color-text-muted)]"
          )} style={{ borderColor: accent }}>
            {a.highlight}
          </blockquote>
        </div>
      </div>
    </button>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function ArtifactsWindow() {
  const [selected, setSelected] = useState<Artifact | null>(null);

  // Detail view
  if (selected) {
    return <ArtifactDetailView artifact={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      {/* Header */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 shrink-0",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-inset-light)]"
      )}>
        <span className="font-[family-name:var(--font-system)] text-xs font-bold text-[var(--color-text-primary)]">
          Curated Artifacts
        </span>
        <span className="ml-auto text-[10px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)]">
          {ARTIFACTS.length} featured
        </span>
      </div>

      {/* Artifact cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {ARTIFACTS.map((a) => (
          <ArtifactListCard
            key={a.id}
            artifact={a}
            onSelect={() => setSelected(a)}
          />
        ))}
      </div>
    </div>
  );
}
