"use client";

import { useState, useMemo } from "react";
import { Win31Panel, Win31Button, Win31StatusBar, StatusBarSection } from "@/components/win31";
import { cn } from "@/lib/utils";
import changelogData from "@/data/changelog.json";

type ChangelogEntry = {
  date: string;
  hash: string;
  type: string;
  scope: string;
  description: string;
  category: string;
  skillCount: number | null;
};

type ChangelogDay = {
  date: string;
  items: ChangelogEntry[];
};

const CATEGORIES = ["all", "features", "ui", "performance", "fixes"] as const;
type Category = (typeof CATEGORIES)[number];

function categoryLabel(cat: Category) {
  return cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1);
}

function typeIcon(type: string): string {
  switch (type) {
    case "feat": return "+";
    case "fix":  return "~";
    case "perf": return "!";
    default:     return "·";
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * ChangelogWindow — renders the project changelog as a Win31 app window.
 * Filter tabs: All | Features | UI | Performance | Fixes
 */
export function ChangelogWindow() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const days: ChangelogDay[] = changelogData.entries as ChangelogDay[];

  const filtered = useMemo(() => {
    if (activeCategory === "all") return days;
    return days
      .map((day) => ({
        ...day,
        items: day.items.filter((item) => item.category === activeCategory),
      }))
      .filter((day) => day.items.length > 0);
  }, [days, activeCategory]);

  const totalVisible = filtered.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Filter tabs */}
      <div className="flex gap-1 p-1 border-b border-b-[var(--color-border-outer)]">
        {CATEGORIES.map((cat) => (
          <Win31Button
            key={cat}
            size="sm"
            variant={activeCategory === cat ? "primary" : "default"}
            onClick={() => setActiveCategory(cat)}
          >
            {categoryLabel(cat)}
          </Win31Button>
        ))}
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {filtered.map((day) => (
          <div key={day.date}>
            {/* Date header */}
            <div
              className={cn(
                "text-[10px] font-bold mb-1 px-1",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-accent)]"
              )}
            >
              {formatDate(day.date)}
            </div>

            {/* Entries for this day */}
            <div className="space-y-1">
              {day.items.map((item, idx) => (
                <Win31Panel
                  key={`${item.hash}-${idx}`}
                  variant="inset"
                  className="px-2 py-1"
                >
                  <div className="flex items-start gap-2">
                    {/* Type indicator */}
                    <span
                      className={cn(
                        "text-[10px] font-bold shrink-0 mt-0.5",
                        "font-[family-name:var(--font-code)]",
                        item.type === "feat" && "text-[var(--color-text-accent)]",
                        item.type === "fix" && "text-orange-600",
                        item.type === "perf" && "text-purple-700"
                      )}
                    >
                      {typeIcon(item.type)}
                    </span>

                    <div className="min-w-0">
                      {/* Scope badge */}
                      {item.scope && (
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase mr-1",
                            "font-[family-name:var(--font-system)]",
                            "text-[var(--color-text-muted)]"
                          )}
                        >
                          [{item.scope}]
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-[11px]",
                          "font-[family-name:var(--font-system)]",
                          "text-[var(--color-text-primary)]"
                        )}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>
                </Win31Panel>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-full text-[var(--color-text-muted)] text-xs font-[family-name:var(--font-system)]">
            No entries in this category.
          </div>
        )}
      </div>

      {/* Status bar */}
      <Win31StatusBar>
        <StatusBarSection>{totalVisible} entries</StatusBarSection>
        <StatusBarSection width="120px">
          {changelogData.totalEntries} total
        </StatusBarSection>
      </Win31StatusBar>
    </div>
  );
}
