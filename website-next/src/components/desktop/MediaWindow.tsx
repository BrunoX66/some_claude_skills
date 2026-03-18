"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  openWinampWindow,
  openMSPaintWindow,
  openBaitWindow,
  openBrowserWindow,
  openAboutWindow,
} from "@/lib/windowHelpers";

/* ── Fun Stuff program icons ───────────────────────────────────────────── */

interface MediaApp {
  id:      string;
  label:   string;
  icon:    React.ReactNode;
  accent?: string;
}

function PaintIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="24" rx="16" ry="12" fill="#c0c0c0" stroke="#000" strokeWidth="1.5"/>
      <circle cx="14" cy="22" r="3" fill="#ff0000"/>
      <circle cx="20" cy="19" r="3" fill="#ffff00"/>
      <circle cx="27" cy="19" r="3" fill="#0000ff"/>
      <circle cx="33" cy="22" r="3" fill="#00aa00"/>
      <circle cx="30" cy="28" r="3" fill="#ff8800"/>
      <circle cx="16" cy="28" r="3" fill="#aa00aa"/>
      <rect x="26" y="6" width="5" height="16" rx="1" fill="#8B4513" stroke="#000" strokeWidth="1"/>
      <rect x="27" y="20" width="3" height="4" fill="#888"/>
    </svg>
  );
}

function WinampIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="36" height="28" rx="2" fill="#1a1a1a" stroke="#555" strokeWidth="1.5"/>
      <rect x="6" y="10" width="32" height="24" rx="1" fill="#000"/>
      <rect x="9"  y="26" width="3" height="6" fill="#00ff00"/>
      <rect x="14" y="22" width="3" height="10" fill="#00ff00"/>
      <rect x="19" y="18" width="3" height="14" fill="#00ff00"/>
      <rect x="24" y="20" width="3" height="12" fill="#00ff00"/>
      <rect x="29" y="24" width="3" height="8" fill="#00ff00"/>
      <rect x="34" y="27" width="3" height="5" fill="#00ff00"/>
      <rect x="4" y="8" width="36" height="5" rx="2" fill="#1919aa"/>
      <text x="8" y="14" fontSize="4" fill="white" fontFamily="monospace">WINAMP</text>
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Globe */}
      <circle cx="22" cy="22" r="14" fill="#4169E1" stroke="#000080" strokeWidth="1.5"/>
      {/* Latitude lines */}
      <ellipse cx="22" cy="22" rx="14" ry="6" fill="none" stroke="#6699FF" strokeWidth="0.8"/>
      <ellipse cx="22" cy="22" rx="14" ry="11" fill="none" stroke="#6699FF" strokeWidth="0.5"/>
      {/* Longitude lines */}
      <ellipse cx="22" cy="22" rx="6" ry="14" fill="none" stroke="#6699FF" strokeWidth="0.8"/>
      <line x1="22" y1="8" x2="22" y2="36" stroke="#6699FF" strokeWidth="0.8"/>
      <line x1="8" y1="22" x2="36" y2="22" stroke="#6699FF" strokeWidth="0.8"/>
      {/* Orbital ring */}
      <ellipse cx="22" cy="22" rx="18" ry="6" fill="none" stroke="#FFD700" strokeWidth="1.5" transform="rotate(-30 22 22)"/>
    </svg>
  );
}

function PrizeIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Money bag */}
      <path d="M14 36 Q14 22 22 18 Q30 22 30 36 Z" fill="#228B22" stroke="#006400" strokeWidth="1.5"/>
      {/* Dollar sign */}
      <text x="22" y="32" textAnchor="middle" fontSize="12" fill="#FFD700" fontWeight="bold" fontFamily="serif">$</text>
      {/* Top tie */}
      <path d="M18 18 Q22 14 26 18" fill="none" stroke="#006400" strokeWidth="2"/>
      {/* Sparkles */}
      <circle cx="10" cy="14" r="1.5" fill="#FFD700"/>
      <circle cx="34" cy="12" r="1" fill="#FFD700"/>
      <circle cx="8" cy="26" r="1" fill="#FFD700"/>
      <circle cx="36" cy="24" r="1.5" fill="#FFD700"/>
      <text x="22" y="12" textAnchor="middle" fontSize="8" fill="#FF4500" fontWeight="bold" fontFamily="sans-serif">!!!</text>
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Card background */}
      <rect x="6" y="8" width="32" height="28" rx="2" fill="#f5f0e0" stroke="#000" strokeWidth="1.5"/>
      {/* Photo placeholder */}
      <rect x="10" y="12" width="12" height="14" fill="#ddd" stroke="#999" strokeWidth="0.8"/>
      <circle cx="16" cy="17" r="3" fill="#c0a080"/>
      <path d="M10 26 Q16 20 22 26" fill="#88aa88"/>
      {/* Text lines */}
      <rect x="25" y="13" width="10" height="2" rx="1" fill="#008080"/>
      <rect x="25" y="18" width="8" height="1.5" rx="0.5" fill="#999"/>
      <rect x="25" y="22" width="10" height="1.5" rx="0.5" fill="#999"/>
      <rect x="25" y="26" width="6" height="1.5" rx="0.5" fill="#999"/>
      {/* Accent strip */}
      <rect x="6" y="8" width="32" height="3" fill="#008080"/>
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function MediaWindow() {
  const [selected, setSelected] = useState<string | null>(null);

  const apps: MediaApp[] = [
    { id: "mspaint",  label: "MSPaint",          icon: <PaintIcon />,   accent: "#aa00aa" },
    { id: "winamp",   label: "Winamp",           icon: <WinampIcon />,  accent: "#00aa00" },
    { id: "browser",  label: "Internet\nExplorer", icon: <BrowserIcon />, accent: "#4169E1" },
    { id: "bait",     label: "PRIZE_\nMONEY.EXE",  icon: <PrizeIcon />,  accent: "#FF4500" },
    { id: "about",    label: "About",             icon: <AboutIcon />,   accent: "#008080" },
  ];

  const openApp = (id: string) => {
    if (id === "mspaint") openMSPaintWindow();
    else if (id === "winamp") openWinampWindow();
    else if (id === "browser") openBrowserWindow();
    else if (id === "bait") openBaitWindow();
    else if (id === "about") openAboutWindow();
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-6 gap-y-4 p-4 content-start",
        "bg-[var(--color-surface-inset)]",
        "h-full overflow-y-auto"
      )}
      onClick={() => setSelected(null)}
    >
      {apps.map((app) => (
        <button
          key={app.id}
          className={cn(
            "flex flex-col items-center gap-1 p-2 w-[72px]",
            "cursor-pointer select-none focus:outline-none rounded-none",
            selected === app.id && [
              "bg-[var(--color-titlebar-active)]",
              "text-[var(--color-titlebar-text)]",
            ]
          )}
          onClick={(e) => { e.stopPropagation(); setSelected(app.id); }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            openApp(app.id);
          }}
          title={app.label.replace("\n", " ")}
        >
          {app.icon}
          <span className={cn(
            "text-center leading-tight font-[family-name:var(--font-system)] text-[10px] whitespace-pre-line",
            selected === app.id
              ? "text-[var(--color-titlebar-text)]"
              : "text-[var(--color-text-primary)]"
          )}>
            {app.label}
          </span>
          <span className="text-[8px] font-[family-name:var(--font-system)] text-[var(--color-text-accent)]">
            dbl-click
          </span>
        </button>
      ))}
    </div>
  );
}
