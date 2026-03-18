"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSkillNav } from "@/state/skillNav";
import { useSkillsData } from "@/state/skillsData";
import { openSkillDetails } from "@/lib/windowHelpers";
import { cn } from "@/lib/utils";

/**
 * SkillNavBar — navigation bar shared by all three SKILL_DETAILS windows.
 *
 * Renders back/forward buttons, the current skill title, and a typeahead
 * input for jumping directly to any skill.
 */
export function SkillNavBar() {
  const currentSkillId = useSkillNav((s) => s.currentSkillId);
  const goBack         = useSkillNav((s) => s.goBack);
  const goForward      = useSkillNav((s) => s.goForward);
  const canBack        = useSkillNav((s) => s.canGoBack());
  const canFwd         = useSkillNav((s) => s.canGoForward());
  const skills         = useSkillsData((s) => s.skills);

  const currentSkill = skills.find((s) => s.id === currentSkillId);

  const [query, setQuery]       = useState("");
  const [open,  setOpen]        = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? skills
        .filter(
          (s) =>
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.id.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  const handleSelect = useCallback(
    (skillId: string, title: string) => {
      setQuery("");
      setOpen(false);
      openSkillDetails(skillId, title);
    },
    []
  );

  // Close dropdown on outside click
  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        listRef.current  && !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const btnClass = (disabled: boolean) =>
    cn(
      "flex items-center justify-center w-6 h-[22px] shrink-0",
      "font-[family-name:var(--font-system)] text-[10px]",
      "bg-[var(--color-surface)]",
      "border-2",
      disabled
        ? [
            "text-[var(--color-text-muted)] cursor-not-allowed",
            "border-t-[var(--color-border-raised-dark)]",
            "border-l-[var(--color-border-raised-dark)]",
            "border-b-[var(--color-border-raised-light)]",
            "border-r-[var(--color-border-raised-light)]",
          ].join(" ")
        : [
            "text-[var(--color-text-primary)] cursor-pointer",
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]",
            "active:border-t-[var(--color-border-raised-dark)]",
            "active:border-l-[var(--color-border-raised-dark)]",
            "active:border-b-[var(--color-border-raised-light)]",
            "active:border-r-[var(--color-border-raised-light)]",
          ].join(" ")
    );

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 shrink-0",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-inset-light)]"
      )}
    >
      {/* Back */}
      <button
        className={btnClass(!canBack)}
        disabled={!canBack}
        onClick={goBack}
        aria-label="Previous skill"
        title="Back"
      >
        <ChevronLeft size={12} />
      </button>

      {/* Forward */}
      <button
        className={btnClass(!canFwd)}
        disabled={!canFwd}
        onClick={goForward}
        aria-label="Next skill"
        title="Forward"
      >
        <ChevronRight size={12} />
      </button>

      {/* Current skill title */}
      <span
        className={cn(
          "text-[10px] font-bold truncate mx-1 min-w-0 flex-1",
          "font-[family-name:var(--font-system)]",
          "text-[var(--color-text-primary)]"
        )}
      >
        {currentSkill?.title ?? "No skill open"}
      </span>

      {/* Typeahead */}
      <div className="relative shrink-0">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Go to skill..."
          className={cn(
            "h-[22px] w-[140px] px-2",
            "font-[family-name:var(--font-system)] text-[10px]",
            "text-[var(--color-text-primary)]",
            "bg-[var(--color-surface-inset)]",
            "border-2",
            "border-t-[var(--color-border-inset-light)]",
            "border-l-[var(--color-border-inset-light)]",
            "border-b-[var(--color-border-inset-dark)]",
            "border-r-[var(--color-border-inset-dark)]",
            "outline-none",
            "placeholder:text-[var(--color-text-muted)]"
          )}
        />
        {open && filtered.length > 0 && (
          <div
            ref={listRef}
            className={cn(
              "absolute top-full right-0 z-50 min-w-[220px]",
              "bg-[var(--color-surface)]",
              "border-2",
              "border-t-[var(--color-border-raised-light)]",
              "border-l-[var(--color-border-raised-light)]",
              "border-b-[var(--color-border-raised-dark)]",
              "border-r-[var(--color-border-raised-dark)]",
              "shadow-[2px_2px_0_var(--color-black)]",
              "max-h-[200px] overflow-y-auto"
            )}
          >
            {filtered.map((s) => (
              <button
                key={s.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(s.id, s.title);
                }}
                className={cn(
                  "w-full text-left px-3 py-1",
                  "font-[family-name:var(--font-system)] text-[10px]",
                  "text-[var(--color-text-primary)]",
                  "hover:bg-[var(--color-titlebar-active)]",
                  "hover:text-[var(--color-text-on-titlebar)]",
                  "cursor-default"
                )}
              >
                <span className="font-bold">{s.title}</span>
                <span className="ml-2 text-[9px] text-[var(--color-text-muted)]">
                  {s.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
