"use client";

import { useState, useMemo } from "react";
import { Win31Panel, Win31Button, Win31StatusBar, StatusBarSection } from "@/components/win31";
import { cn } from "@/lib/utils";
import { ALL_AGENTS } from "@/data/agents";
import { AGENT_ROLES, AGENT_STATUS_CONFIG } from "@/types/agent";
import type { Agent } from "@/types/agent";

/**
 * AgentsWindow — directory of Founding Council agents.
 * Role filter buttons + card grid.
 */
export function AgentsWindow() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (roleFilter === "all") return ALL_AGENTS;
    return ALL_AGENTS.filter((a) => a.role === roleFilter);
  }, [roleFilter]);

  return (
    <div className="flex flex-col h-full">
      {/* Role filter toolbar */}
      <div className="flex gap-1 flex-wrap p-1.5 border-b border-b-[var(--color-border-outer)]">
        {AGENT_ROLES.map((role) => (
          <Win31Button
            key={role}
            size="sm"
            variant={roleFilter === role ? "primary" : "default"}
            onClick={() => setRoleFilter(role)}
          >
            {role === "all" ? "All" : role}
          </Win31Button>
        ))}
      </div>

      {/* Agent cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isExpanded={expanded === agent.id}
            onToggle={() => setExpanded(expanded === agent.id ? null : agent.id)}
          />
        ))}
      </div>

      {/* Status bar */}
      <Win31StatusBar>
        <StatusBarSection>
          {filtered.length} agent{filtered.length !== 1 ? "s" : ""}
        </StatusBarSection>
        <StatusBarSection width="120px">
          {ALL_AGENTS.filter((a) => a.badge === "FOUNDING").length} founding members
        </StatusBarSection>
      </Win31StatusBar>
    </div>
  );
}

/* ─── AgentCard ─────────────────────────────────────────────── */

function AgentCard({
  agent,
  isExpanded,
  onToggle,
}: {
  agent: Agent;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusCfg = AGENT_STATUS_CONFIG[agent.status];

  return (
    <Win31Panel variant="raised" className="p-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          {/* Emoji avatar */}
          <span className="text-lg leading-none shrink-0" aria-hidden>
            {agent.emoji}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={cn(
                  "text-xs font-bold",
                  "font-[family-name:var(--font-system)]",
                  "text-[var(--color-text-primary)]"
                )}
              >
                {agent.name}
              </span>

              {/* Role badge */}
              <span
                className={cn(
                  "text-[9px] px-1 py-0.5 font-bold",
                  "bg-[var(--color-surface-inset)]",
                  "text-[var(--color-text-secondary)]",
                  "font-[family-name:var(--font-system)]"
                )}
              >
                {agent.role}
              </span>

              {/* Status badge */}
              <span
                className="text-[9px] font-bold px-1 py-0.5"
                style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
              >
                {statusCfg.label}
              </span>
            </div>

            <p
              className={cn(
                "text-[11px] mt-0.5",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-secondary)]"
              )}
            >
              {agent.description}
            </p>
          </div>
        </div>

        <Win31Button size="sm" onClick={onToggle} className="shrink-0">
          {isExpanded ? "▲" : "▼"}
        </Win31Button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-2 space-y-2 pl-7">
          {/* Beliefs */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mb-1 font-[family-name:var(--font-system)]">
              Core Beliefs
            </div>
            <ul className="space-y-0.5">
              {agent.beliefs.map((belief, i) => (
                <li
                  key={i}
                  className={cn(
                    "text-[10px]",
                    "font-[family-name:var(--font-system)]",
                    "text-[var(--color-text-secondary)]"
                  )}
                >
                  &bull; {belief}
                </li>
              ))}
            </ul>
          </div>

          {/* Pledge */}
          {agent.pledge && (
            <Win31Panel variant="inset" className="p-1.5">
              <p
                className={cn(
                  "text-[10px] italic",
                  "font-[family-name:var(--font-system)]",
                  "text-[var(--color-text-accent)]"
                )}
              >
                &ldquo;{agent.pledge}&rdquo;
              </p>
            </Win31Panel>
          )}

          {/* Coordinates with */}
          {agent.coordinatesWith.length > 0 && (
            <div>
              <span className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mr-1 font-[family-name:var(--font-system)]">
                Coordinates with:
              </span>
              <span className="text-[10px] text-[var(--color-text-secondary)] font-[family-name:var(--font-system)]">
                {agent.coordinatesWith.join(", ")}
              </span>
            </div>
          )}
        </div>
      )}
    </Win31Panel>
  );
}
