"use client";

import { useState } from "react";
import { Win31Panel, Win31Button, Win31StatusBar, StatusBarSection } from "@/components/win31";
import { cn } from "@/lib/utils";

const SKILLS_COUNT = 192;
const GITHUB_URL = "https://github.com/erichowens";

const TAGS = [
  { label: "AI Engineering", color: "#7c3aed" },
  { label: "Claude Code", color: "#2563eb" },
  { label: "Computer Vision", color: "#059669" },
  { label: "VR / AR", color: "#0891b2" },
  { label: "Recovery & Legal Aid", color: "#d97706" },
  { label: "Next.js", color: "#000000" },
  { label: "TypeScript", color: "#3178c6" },
  { label: "MCP Servers", color: "#dc2626" },
  { label: "Applied Math", color: "#6366f1" },
  { label: "ML & NLP", color: "#059669" },
];

const STATS = [
  { value: "15", label: "Years", color: "#2563eb" },
  { value: "15", label: "Patents", color: "#d97706" },
  { value: `${SKILLS_COUNT}+`, label: "Skills", color: "#7c3aed" },
  { value: "9", label: "Products", color: "#059669" },
];

/**
 * AboutWindow — colorful author profile with Ideogram portrait.
 */
export function AboutWindow() {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Hero header with gradient */}
        <div
          className="px-4 py-4 shrink-0"
          style={{
            background: "linear-gradient(135deg, #000080 0%, #4a0080 40%, #008080 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Portrait */}
            {!imgErr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/img/erich-owens-portrait.webp"
                alt="Erich Owens"
                className="w-20 h-20 object-cover shrink-0 border-2 border-white/30 shadow-lg"
                style={{ borderRadius: "2px" }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-20 h-20 shrink-0 bg-[#000080] border-2 border-white/30 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#FFD700] font-[family-name:var(--font-window)]">
                  EO
                </span>
              </div>
            )}

            <div>
              <h1 className="text-white font-[family-name:var(--font-window)] text-lg font-bold leading-tight">
                Erich Owens
              </h1>
              <p className="text-white/80 font-[family-name:var(--font-system)] text-[11px] mt-0.5">
                Founder, Curiositech &middot; Engineer &middot; Builder
              </p>
              <p className="text-[#FFD700] font-[family-name:var(--font-system)] text-[10px] mt-1">
                Ex-Meta ML &middot; 15 Patents &middot; Portland, OR
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 space-y-3">
          {/* Bio */}
          <Win31Panel variant="inset" className="p-2.5">
            <p
              className={cn(
                "text-[11px] leading-relaxed",
                "font-[family-name:var(--font-system)]",
                "text-[var(--color-text-primary)]"
              )}
            >
              Founded Curiositech, a Portland-based product studio building purpose-driven apps for recovery,
              legal aid, AI, and developer tools. Previously led 80+ engineers at Meta building avatar systems,
              face tracking for AR, and ranking algorithms at billion-user scale. Also built this — the internet&apos;s
              largest open-source Claude Code skill library.
            </p>
          </Win31Panel>

          {/* Stats grid — colorful */}
          <div className="grid grid-cols-4 gap-2">
            {STATS.map(({ value, label, color }) => (
              <div
                key={label}
                className="text-center p-2 border-2 border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)] border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]"
                style={{ background: `${color}11` }}
              >
                <div
                  className="text-sm font-bold font-[family-name:var(--font-system)]"
                  style={{ color }}
                >
                  {value}
                </div>
                <div className="text-[9px] font-[family-name:var(--font-system)] text-[var(--color-text-primary)]">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* What I Build — colorful tags */}
          <div>
            <div className="text-[9px] font-bold uppercase mb-1.5 font-[family-name:var(--font-system)] text-[var(--color-text-primary)] tracking-wider">
              What I Build
            </div>
            <div className="flex flex-wrap gap-1">
              {TAGS.map(({ label, color }) => (
                <span
                  key={label}
                  className="px-1.5 py-0.5 text-[9px] font-bold font-[family-name:var(--font-system)] border"
                  style={{
                    color,
                    borderColor: `${color}44`,
                    background: `${color}11`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 justify-center pt-1">
            <Win31Button
              size="sm"
              onClick={() => window.open(GITHUB_URL, "_blank")}
            >
              GitHub
            </Win31Button>
            <Win31Button
              size="sm"
              onClick={() => window.open("https://curiositech.ai", "_blank")}
            >
              Curiositech
            </Win31Button>
            <Win31Button
              size="sm"
              onClick={() => window.open("mailto:erich@someclaudeskills.com", "_blank")}
            >
              Contact
            </Win31Button>
          </div>
        </div>
      </div>

      <Win31StatusBar>
        <StatusBarSection>Some Claude Skills v0.3.0</StatusBarSection>
      </Win31StatusBar>
    </div>
  );
}
