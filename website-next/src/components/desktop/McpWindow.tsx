"use client";

import { useState, useMemo } from "react";
import { Win31Panel, Win31Button, Win31StatusBar, StatusBarSection } from "@/components/win31";
import { cn } from "@/lib/utils";
import { ALL_MCPS } from "@/data/mcps";
import { MCP_CATEGORIES, MCP_STATUS_CONFIG } from "@/types/mcp";
import type { McpServer } from "@/types/mcp";

/**
 * McpWindow — MCP gallery inside a Win31 desktop window.
 * Search input + category filter + card grid.
 */
export function McpWindow() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = ALL_MCPS;
    if (category !== "all") {
      results = results.filter((m) => m.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tools.some(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q)
          )
      );
    }
    return results;
  }, [query, category]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-1.5 space-y-1 border-b border-b-[var(--color-border-outer)]">
        {/* Search */}
        <Win31Panel variant="inset" className="flex items-center px-1 py-0.5">
          <span className="text-[10px] mr-1 text-[var(--color-text-muted)] font-[family-name:var(--font-system)]">
            Search:
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter MCPs..."
            className={cn(
              "flex-1 bg-transparent outline-none",
              "text-xs font-[family-name:var(--font-system)]",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-muted)]"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </Win31Panel>

        {/* Category filters */}
        <div className="flex gap-1 flex-wrap">
          {MCP_CATEGORIES.map((cat) => (
            <Win31Button
              key={cat}
              size="sm"
              variant={category === cat ? "primary" : "default"}
              onClick={() => setCategory(cat)}
            >
              {cat === "all" ? "All" : cat}
            </Win31Button>
          ))}
        </div>
      </div>

      {/* MCP cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.map((mcp) => (
          <McpCard
            key={mcp.id}
            mcp={mcp}
            isExpanded={expanded === mcp.id}
            onToggle={() => setExpanded(expanded === mcp.id ? null : mcp.id)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-24 text-[var(--color-text-muted)] text-xs font-[family-name:var(--font-system)]">
            No MCPs match your search.
          </div>
        )}
      </div>

      {/* Status bar */}
      <Win31StatusBar>
        <StatusBarSection>
          Showing {filtered.length} of {ALL_MCPS.length} MCPs
        </StatusBarSection>
      </Win31StatusBar>
    </div>
  );
}

/* ─── McpCard ─────────────────────────────────────────────────── */

function McpCard({
  mcp,
  isExpanded,
  onToggle,
}: {
  mcp: McpServer;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const statusCfg = MCP_STATUS_CONFIG[mcp.status];

  const installJson = JSON.stringify(
    {
      command: mcp.installConfig.command,
      args: mcp.installConfig.args,
      ...(mcp.installConfig.env && { env: mcp.installConfig.env }),
    },
    null,
    2
  );

  return (
    <Win31Panel variant="raised" className="p-2">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "text-xs font-bold",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-primary)]"
              )}
            >
              {mcp.name}
            </span>

            {/* Status badge */}
            <span
              className="text-[9px] font-bold px-1 py-0.5 rounded-none"
              style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
            >
              {statusCfg.label}
            </span>

            {/* Special badge */}
            {mcp.badge && (
              <span className="text-[9px] font-bold px-1 py-0.5 bg-[var(--color-text-accent)] text-white">
                {mcp.badge}
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
            {mcp.description}
          </p>
        </div>

        <Win31Button size="sm" onClick={onToggle} className="shrink-0">
          {isExpanded ? "▲" : "▼"}
        </Win31Button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {/* Tools list */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mb-1 font-[family-name:var(--font-system)]">
              Tools
            </div>
            <div className="space-y-0.5">
              {mcp.tools.map((tool) => (
                <div key={tool.name} className="flex gap-1.5 text-[10px] font-[family-name:var(--font-system)]">
                  <span className="font-bold text-[var(--color-text-accent)] shrink-0">{tool.name}</span>
                  <span className="text-[var(--color-text-secondary)]">{tool.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Install config */}
          <div>
            <div className="text-[9px] font-bold uppercase text-[var(--color-text-muted)] mb-1 font-[family-name:var(--font-system)]">
              Install Config (claude_desktop_config.json)
            </div>
            <Win31Panel variant="inset" className="p-1.5">
              <pre className="text-[9px] font-[family-name:var(--font-code)] text-[var(--color-text-primary)] whitespace-pre-wrap break-all">
                {installJson}
              </pre>
            </Win31Panel>
            {mcp.installNotes && (
              <p className="text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)] mt-1">
                {mcp.installNotes}
              </p>
            )}
          </div>
        </div>
      )}
    </Win31Panel>
  );
}
