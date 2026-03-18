"use client";

import { cn } from "@/lib/utils";
import { openSkillsBrowserWindow, openTutorialsWindow, openBrowserWindow } from "@/lib/windowHelpers";

/**
 * WelcomeWindow — Retro 1991 Prodigy/Eidos/BBS-style intro screen.
 * Opens on first boot, explains Skills, Claude, and what to do.
 */
export function WelcomeWindow() {
  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)] overflow-auto">
      {/* Header banner — navy block like Prodigy splash */}
      <div
        className="shrink-0 px-6 py-5 text-center"
        style={{
          background: "linear-gradient(180deg, #000080 0%, #0000c0 60%, #4040c0 100%)",
        }}
      >
        <div
          className="font-[family-name:var(--font-window)] text-white leading-tight"
          style={{ fontSize: "clamp(24px, 4vw, 42px)", textShadow: "2px 2px 0 #000040" }}
        >
          WELCOME TO
        </div>
        <div
          className="font-[family-name:var(--font-window)] leading-tight mt-1"
          style={{
            fontSize: "clamp(32px, 6vw, 58px)",
            color: "#FFFF00",
            textShadow: "3px 3px 0 #808000",
          }}
        >
          SomeClaudeSkills
        </div>
        <div className="mt-2 font-[family-name:var(--font-system)] text-[#C0C0FF] text-[11px] tracking-widest uppercase">
          The Internet&apos;s Finest Claude Code Skill Library — Est. 2025
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 space-y-4 overflow-auto">

        {/* What is this? */}
        <section className={cn(
          "p-3 border-2",
          "border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
          "bg-[var(--color-surface)]"
        )}>
          <h2 className="font-[family-name:var(--font-system)] text-[11px] font-bold uppercase text-[var(--color-titlebar-active)] mb-2 tracking-wider">
            ► What Is Claude?
          </h2>
          <p className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
            Claude is an AI assistant made by Anthropic. Unlike chatbots, Claude has
            a <strong className="text-[var(--color-text-primary)]">full development environment</strong> called{" "}
            <strong className="text-[var(--color-text-primary)]">Claude Code</strong> — it can write, run,
            and debug real programs on your machine.
          </p>
        </section>

        {/* What are Skills? */}
        <section className={cn(
          "p-3 border-2",
          "border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
          "bg-[var(--color-surface)]"
        )}>
          <h2 className="font-[family-name:var(--font-system)] text-[11px] font-bold uppercase text-[var(--color-titlebar-active)] mb-2 tracking-wider">
            ► What Are Skills?
          </h2>
          <p className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
            Skills are <strong className="text-[var(--color-text-primary)]">markdown files</strong> that
            turn Claude Code into a specialist. Drop a skill into your{" "}
            <code className="bg-[var(--color-surface-inset)] px-1 text-[var(--color-text-accent)] text-[9px]">
              .claude/skills/
            </code>{" "}
            folder and Claude becomes an expert in that exact domain — from TypeScript type
            systems to pixel art, from HIPAA compliance to WinDAG orchestration.
          </p>
          <p className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-secondary)] leading-relaxed mt-2">
            This library has <strong className="text-[var(--color-text-primary)]">192+ skills</strong>{" "}
            across 14 categories — all free, all open source.
          </p>
        </section>

        {/* What can I do? */}
        <section className={cn(
          "p-3 border-2",
          "border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
          "bg-[var(--color-surface)]"
        )}>
          <h2 className="font-[family-name:var(--font-system)] text-[11px] font-bold uppercase text-[var(--color-titlebar-active)] mb-2 tracking-wider">
            ► What Can I Do Here?
          </h2>
          <div className="space-y-1">
            {[
              ["Browse", "192 skills across 14 categories — click the SKILLS folder"],
              ["Download", "Click any skill to get the ZIP, or copy the install command"],
              ["Learn", "Follow tutorials in the TUTORIALS window — beginner to power user"],
              ["Draw with AI", "Open MS Paint — it uses Claude to draw anything you describe"],
              ["Explore", "Open the Internet Explorer window to see the full site"],
            ].map(([action, desc]) => (
              <div key={action} className="flex gap-2">
                <span className="font-[family-name:var(--font-system)] text-[10px] font-bold text-[var(--color-text-accent)] shrink-0 w-16">
                  {action}
                </span>
                <span className="font-[family-name:var(--font-system)] text-[10px] text-[var(--color-text-secondary)]">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { label: "Browse Skills", action: openSkillsBrowserWindow },
            { label: "Open Tutorials", action: openTutorialsWindow },
            { label: "Open Website", action: () => openBrowserWindow() },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              className={cn(
                "px-4 py-2 min-h-[var(--win31-touch-target)]",
                "text-xs font-bold font-[family-name:var(--font-system)] cursor-pointer",
                "bg-[var(--color-surface-raised)]",
                "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
                "active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
                "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)] text-center pt-2">
          Press F1 or use the Skills menu to get started · Click anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
