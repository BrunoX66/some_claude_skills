"use client";

import { useState, useMemo } from "react";
import { Win31Panel, Win31Button, Win31StatusBar, StatusBarSection } from "@/components/win31";
import { cn } from "@/lib/utils";
import { bundles } from "@/data/bundles";
import type { Bundle, BundleAudience, BundleDifficulty } from "@/types/bundle";

const AUDIENCE_FILTERS: Array<{ value: BundleAudience | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "developers", label: "Devs" },
  { value: "entrepreneurs", label: "Founders" },
  { value: "teams", label: "Teams" },
  { value: "technical-writers", label: "Writers" },
  { value: "ml-engineers", label: "ML" },
  { value: "newcomers", label: "Newcomers" },
];

const DIFFICULTY_CONFIG: Record<BundleDifficulty, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "#166534" },
  intermediate: { label: "Intermediate", color: "#854d0e" },
  advanced: { label: "Advanced", color: "#9a3412" },
};

/**
 * BundlesWindow — skill bundle gallery with audience + difficulty filters.
 */
export function BundlesWindow() {
  const [audience, setAudience] = useState<BundleAudience | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (audience === "all") return bundles;
    return bundles.filter((b) => b.audience === audience);
  }, [audience]);

  async function copyInstall(bundle: Bundle) {
    try {
      await navigator.clipboard.writeText(bundle.installCommand);
      setCopied(bundle.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Audience filter toolbar */}
      <div className="flex gap-1 flex-wrap p-1.5 border-b border-b-[var(--color-border-outer)]">
        {AUDIENCE_FILTERS.map(({ value, label }) => (
          <Win31Button
            key={value}
            size="sm"
            variant={audience === value ? "primary" : "default"}
            onClick={() => setAudience(value as BundleAudience | "all")}
          >
            {label}
          </Win31Button>
        ))}
      </div>

      {/* Bundle cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map((bundle) => {
          const diffCfg = DIFFICULTY_CONFIG[bundle.difficulty];
          const isExpanded = expanded === bundle.id;

          return (
            <Win31Panel key={bundle.id} variant="raised" className="p-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        "text-xs font-bold",
                        "font-[family-name:var(--font-system)]",
                        "text-[var(--color-text-primary)]"
                      )}
                    >
                      {bundle.title}
                    </span>

                    <span
                      className="text-[9px] font-bold px-1 py-0.5"
                      style={{ color: diffCfg.color, backgroundColor: diffCfg.color + "20" }}
                    >
                      {diffCfg.label}
                    </span>

                    {bundle.featured && (
                      <span className="text-[9px] font-bold px-1 py-0.5 bg-[var(--color-text-accent)] text-white">
                        FEATURED
                      </span>
                    )}
                  </div>

                  <p
                    className={cn(
                      "text-[11px] mt-0.5",
                      "font-[family-name:var(--font-system)]",
                      "text-[var(--color-text-secondary)]"
                    )}
                  >
                    {bundle.description}
                  </p>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bundle.skills.slice(0, 4).map((s) => (
                      <span
                        key={s.id}
                        className={cn(
                          "text-[9px] px-1 py-0.5",
                          "bg-[var(--color-surface-inset)]",
                          "text-[var(--color-text-muted)]",
                          "font-[family-name:var(--font-system)]",
                          s.optional && "opacity-60 italic"
                        )}
                      >
                        {s.id}
                      </span>
                    ))}
                    {bundle.skills.length > 4 && (
                      <span className="text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)]">
                        +{bundle.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <Win31Button size="sm" onClick={() => setExpanded(isExpanded ? null : bundle.id)} className="shrink-0">
                  {isExpanded ? "▲" : "▼"}
                </Win31Button>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {/* Install command */}
                  <div>
                    <div className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mb-1 font-[family-name:var(--font-system)]">
                      Install Command
                    </div>
                    <div className="flex gap-1 items-center">
                      <Win31Panel variant="inset" className="flex-1 px-1.5 py-1">
                        <code className="text-[9px] font-[family-name:var(--font-code)] text-[var(--color-text-primary)] break-all">
                          {bundle.installCommand}
                        </code>
                      </Win31Panel>
                      <Win31Button size="sm" onClick={() => copyInstall(bundle)}>
                        {copied === bundle.id ? "Copied!" : "Copy"}
                      </Win31Button>
                    </div>
                  </div>

                  {/* Use cases */}
                  <div>
                    <div className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mb-1 font-[family-name:var(--font-system)]">
                      Use Cases
                    </div>
                    <ul className="space-y-0.5">
                      {bundle.useCases.map((uc, i) => (
                        <li
                          key={i}
                          className={cn(
                            "text-[10px]",
                            "font-[family-name:var(--font-system)]",
                            "text-[var(--color-text-secondary)]"
                          )}
                        >
                          &bull; {uc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cost */}
                  <div className="text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)]">
                    Est. cost: ${bundle.estimatedCost.usd.toFixed(2)} (~{bundle.estimatedCost.tokens.toLocaleString()} tokens)
                  </div>
                </div>
              )}
            </Win31Panel>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-24 text-[var(--color-text-muted)] text-xs font-[family-name:var(--font-system)]">
            No bundles for this audience.
          </div>
        )}
      </div>

      {/* Status bar */}
      <Win31StatusBar>
        <StatusBarSection>
          {filtered.length} of {bundles.length} bundles
        </StatusBarSection>
        <StatusBarSection width="100px">
          {bundles.filter((b) => b.featured).length} featured
        </StatusBarSection>
      </Win31StatusBar>
    </div>
  );
}
