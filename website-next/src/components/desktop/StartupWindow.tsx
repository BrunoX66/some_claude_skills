"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { STARTUP_ITEMS, type ProgramGroup } from "./SkillsManagerWindow";

/* ── App-specific icons (Win31 pixel art style) ────────────────────────────── */

function IEIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Globe */}
      <circle cx="22" cy="22" r="16" fill="#4080d0" stroke="#000080" strokeWidth="1.5"/>
      {/* Latitude lines */}
      <ellipse cx="22" cy="22" rx="16" ry="6" fill="none" stroke="#6090dd" strokeWidth="1"/>
      <ellipse cx="22" cy="22" rx="16" ry="12" fill="none" stroke="#6090dd" strokeWidth="0.8"/>
      {/* Longitude line */}
      <ellipse cx="22" cy="22" rx="6" ry="16" fill="none" stroke="#6090dd" strokeWidth="1"/>
      {/* Orbit "e" ring */}
      <ellipse cx="22" cy="22" rx="18" ry="8" fill="none" stroke="#000080" strokeWidth="2.5"
        transform="rotate(-25 22 22)"/>
      {/* Highlight */}
      <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
}

function WelcomeIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="8" y="4" width="28" height="36" rx="1" fill="#fffff0" stroke="#000" strokeWidth="1.5"/>
      {/* Header bar */}
      <rect x="10" y="6" width="24" height="6" fill="#000080"/>
      <text x="14" y="11" fontSize="5" fill="white" fontFamily="monospace" fontWeight="bold">README</text>
      {/* Text lines */}
      <rect x="12" y="16" width="20" height="2" rx="0.5" fill="#808080"/>
      <rect x="12" y="20" width="16" height="2" rx="0.5" fill="#808080"/>
      <rect x="12" y="24" width="18" height="2" rx="0.5" fill="#808080"/>
      <rect x="12" y="28" width="14" height="2" rx="0.5" fill="#808080"/>
      {/* Star */}
      <polygon points="30,30 31.5,33 35,33.5 32.5,35.5 33,39 30,37 27,39 27.5,35.5 25,33.5 28.5,33"
        fill="#ffd700" stroke="#b8860b" strokeWidth="0.5"/>
    </svg>
  );
}

function FeaturedIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trophy base */}
      <rect x="17" y="32" width="10" height="3" fill="#c0c0c0" stroke="#808080" strokeWidth="1"/>
      <rect x="14" y="35" width="16" height="3" rx="1" fill="#c0c0c0" stroke="#808080" strokeWidth="1"/>
      {/* Trophy stem */}
      <rect x="20" y="28" width="4" height="5" fill="#ffd700" stroke="#b8860b" strokeWidth="0.5"/>
      {/* Trophy cup */}
      <path d="M12 8 L32 8 L30 24 Q28 28 22 28 Q16 28 14 24 Z" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5"/>
      {/* Trophy rim */}
      <rect x="10" y="6" width="24" height="4" rx="1" fill="#ffd700" stroke="#b8860b" strokeWidth="1"/>
      {/* Handles */}
      <path d="M12 12 Q6 12 6 18 Q6 22 12 22" fill="none" stroke="#b8860b" strokeWidth="2"/>
      <path d="M32 12 Q38 12 38 18 Q38 22 32 22" fill="none" stroke="#b8860b" strokeWidth="2"/>
      {/* Star on cup */}
      <polygon points="22,13 23.5,17 27,17.5 24.5,19.5 25,23 22,21 19,23 19.5,19.5 17,17.5 20.5,17"
        fill="#fff8dc" stroke="#daa520" strokeWidth="0.5"/>
    </svg>
  );
}

function AboutIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dialog box */}
      <rect x="4" y="6" width="36" height="32" rx="1" fill="#c0c0c0" stroke="#000" strokeWidth="1.5"/>
      {/* Title bar */}
      <rect x="6" y="8" width="32" height="6" fill="#000080"/>
      <text x="10" y="13" fontSize="5" fill="white" fontFamily="monospace" fontWeight="bold">ABOUT</text>
      {/* Info circle */}
      <circle cx="22" cy="26" r="8" fill="#000080" stroke="#4040c0" strokeWidth="1"/>
      <text x="20" y="23" fontSize="6" fill="white" fontFamily="serif" fontWeight="bold">i</text>
      <rect x="20" y="25" width="4" height="7" rx="1" fill="white"/>
      <circle cx="22" cy="22" r="2" fill="white"/>
    </svg>
  );
}

/** Map startup item IDs to their app icons */
const STARTUP_ICONS: Record<string, (props: { size?: number }) => React.ReactNode> = {
  "startup-ie":       IEIcon,
  "startup-welcome":  WelcomeIcon,
  "startup-featured": FeaturedIcon,
  "startup-about":    AboutIcon,
};

/* ── Component ────────────────────────────────────────────────────────────── */

/**
 * StartupWindow - Win31 Startup program group.
 *
 * Shows the items that auto-launch on first visit:
 * Internet Explorer, Welcome, Featured, About.
 * Double-click to open, single-click to select (classic Win31 behavior).
 */
export function StartupWindow() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-6 gap-y-4 p-4 content-start",
        "bg-[var(--color-surface-inset)]",
        "h-full overflow-y-auto"
      )}
      onClick={() => setSelected(null)}
    >
      {STARTUP_ITEMS.map((item: ProgramGroup) => {
        const IconComponent = STARTUP_ICONS[item.id];
        return (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-center gap-1 p-2 w-[72px]",
              "cursor-pointer select-none focus:outline-none rounded-none",
              selected === item.id && [
                "bg-[var(--color-titlebar-active)]",
                "text-[var(--color-titlebar-text)]",
              ]
            )}
            onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              item.onOpen();
            }}
            aria-label={`Open ${item.label}`}
          >
            {IconComponent ? <IconComponent size={44} /> : (
              <div className="w-11 h-11 bg-[var(--color-surface)] border border-[var(--color-border-inset-dark)] flex items-center justify-center">
                <span className="text-xs text-[var(--color-text-muted)]">?</span>
              </div>
            )}
            <span className={cn(
              "text-center leading-tight font-[family-name:var(--font-system)] text-[10px] font-bold",
              selected === item.id
                ? "text-[var(--color-titlebar-text)]"
                : "text-[var(--color-text-primary)]"
            )}>
              {item.label}
            </span>
            <span className={cn(
              "text-[8px] font-[family-name:var(--font-system)]",
              selected === item.id
                ? "text-[var(--color-titlebar-text)] opacity-80"
                : "text-[var(--color-text-muted)]"
            )}>
              {item.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
