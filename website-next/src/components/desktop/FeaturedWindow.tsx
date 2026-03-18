"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { openSkillDetails } from "@/lib/windowHelpers";

/**
 * FeaturedWindow — rotating 1990s-style "shareware box art" skill ads.
 * Each slide features a hero image (90s web ad style) with pixel-art aesthetic.
 * Falls back to ASCII art if image fails to load.
 * Auto-advances every 6 seconds; manual prev/next navigation also available.
 */

interface SkillAd {
  skillId: string;
  title: string;
  tagline: string;
  category: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  /** ASCII/block-character art fallback */
  ascii: string;
  features: string[];
  /** 90s web banner-style ad image */
  adImage: string;
}

const FEATURED_ADS: SkillAd[] = [
  {
    skillId: "typescript-advanced-patterns",
    title: "TypeScript PRO",
    tagline: "BRANDED TYPES \u2022 DISCRIMINATED UNIONS",
    category: "DEVELOPER TOOLS",
    bgColor: "#000080",
    accentColor: "#FFFF00",
    textColor: "#FFFFFF",
    adImage: "/img/featured/typescript-advanced-patterns-ad.webp",
    ascii: `
 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
    \u2588\u2588\u2551\u2550\u2550\u255d\u2588\u2588\u2551\u2550\u2550\u2550\u2550\u255d
    \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
    \u2588\u2588\u2551   \u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2551
    \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551
    \u255a\u2550\u255d   \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d`,
    features: ["Branded Types", "Zod inference", "Type-safe events", "Exhaustive switch"],
  },
  {
    skillId: "nextjs-app-router-expert",
    title: "NEXT.JS MASTER",
    tagline: "APP ROUTER \u2022 SERVER COMPONENTS \u2022 EDGE",
    category: "WEB FRAMEWORK",
    bgColor: "#000000",
    accentColor: "#00FF41",
    textColor: "#00FF41",
    adImage: "/img/featured/nextjs-app-router-expert-ad.webp",
    ascii: `
  \u2588\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
  \u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2551\u2550\u2550\u2550\u2550\u255d
  \u2588\u2588\u2551\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557
  \u2588\u2588\u2551\u255a\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551\u2550\u2550\u255d
  \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
  \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d`,
    features: ["App Router", "Server Actions", "Streaming SSR", "Cloudflare Edge"],
  },
  {
    skillId: "supabase-admin",
    title: "SUPABASE PRO",
    tagline: "RLS POLICIES \u2022 REALTIME \u2022 EDGE FUNCTIONS",
    category: "DATABASE",
    bgColor: "#1C1C2E",
    accentColor: "#3ECF8E",
    textColor: "#FFFFFF",
    adImage: "/img/featured/supabase-admin-ad.webp",
    ascii: `
 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557
 \u2588\u2588\u2551\u2550\u2550\u2550\u2550\u255d\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2550\u2550\u2588\u2588\u2557
 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2550\u255d
 \u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2550\u2550\u2550\u255d
 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2550\u255d\u2588\u2588\u2551
 \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d`,
    features: ["Row Level Security", "Auth policies", "Realtime subscriptions", "Edge Functions"],
  },
  {
    skillId: "windows-3-1-web-designer",
    title: "WIN31 DESIGNER",
    tagline: "RETRO AESTHETICS \u2022 MODERN CODE",
    category: "DESIGN SYSTEM",
    bgColor: "#008080",
    accentColor: "#FFFFFF",
    textColor: "#000000",
    adImage: "/img/featured/windows-3-1-web-designer-ad.webp",
    ascii: `
 \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
 \u2551 Program Mgr \u2590\u2551
 \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563
 \u2551 [File][Help] \u2551
 \u2551              \u2551
 \u2551  [Icon][Icon]\u2551
 \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d`,
    features: ["3D beveled UI", "System fonts", "Navy titlebars", "MDI windows"],
  },
  {
    skillId: "react-performance-optimizer",
    title: "REACT TURBO",
    tagline: "60FPS \u2022 ZERO LAYOUT SHIFT \u2022 LIGHTHOUSE 100",
    category: "PERFORMANCE",
    bgColor: "#1A0533",
    accentColor: "#FF6B6B",
    textColor: "#FFFFFF",
    adImage: "/img/featured/react-performance-optimizer-ad.webp",
    ascii: `
 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557
 \u2588\u2588\u2551\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u2550\u2550\u2550\u2588\u2588\u2557
 \u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2550\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2550\u255d\u2588\u2588\u2551   \u2588\u2588\u2551
 \u2588\u2588\u2551\u2550\u2550\u2550\u255d \u2588\u2588\u2551\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551
 \u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2550\u255d
 \u255a\u2550\u255d     \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d`,
    features: ["memo / useMemo", "Virtualization", "Bundle splitting", "Profiler API"],
  },
  {
    skillId: "playwright-e2e-tester",
    title: "PLAYWRIGHT QA",
    tagline: "E2E TESTING \u2022 VISUAL REGRESSION \u2022 CI/CD",
    category: "TESTING",
    bgColor: "#2D1B69",
    accentColor: "#E040FB",
    textColor: "#FFFFFF",
    adImage: "/img/featured/playwright-e2e-tester-ad.webp",
    ascii: `
 \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
 \u2502 TEST: homepage  \u2502
 \u2502  \u2713 nav loads    \u2502
 \u2502  \u2713 CTA visible  \u2502
 \u2502  \u2713 form works   \u2502
 \u2502  \u2713 mobile 375px \u2502
 \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`,
    features: ["Cross-browser", "Screenshot diffs", "Network mocks", "Trace viewer"],
  },
  {
    skillId: "skill-architect",
    title: "SKILL ARCHITECT",
    tagline: "BUILD \u00B7 GRADE \u00B7 DEPLOY CLAUDE SKILLS",
    category: "META SKILL",
    bgColor: "#4A0080",
    accentColor: "#FFD700",
    textColor: "#FFFFFF",
    adImage: "/img/featured/skill-architect-ad.webp",
    ascii: `
    \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e
    \u2502 SKILL.MD\u2502
    \u2502\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2502
    \u2502 # Name  \u2502
    \u2502 ## When \u2502
    \u2502 ## How  \u2502
    \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f`,
    features: ["SKILL.md spec", "Scoring rubric", "Reference files", "Agent hooks"],
  },
];

const SLIDE_DURATION = 6000; // ms per slide

export function FeaturedWindow() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const total = FEATURED_ADS.length;

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % total);
        setFading(false);
      }, 300);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [total]);

  const navigate = (delta: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((c) => (c + delta + total) % total);
      setFading(false);
    }, 200);
  };

  const ad = FEATURED_ADS[current];

  const btnClass = cn(
    "px-2 py-0.5 text-[10px] font-bold font-[family-name:var(--font-system)] cursor-pointer shrink-0",
    "bg-[var(--color-surface-raised)]",
    "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
    "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
    "active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
    "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]"
  );

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      {/* Main ad area */}
      <div
        className="flex-1 relative overflow-hidden transition-opacity duration-300"
        style={{
          opacity: fading ? 0 : 1,
          background: ad.bgColor,
        }}
      >
        {/* Category badge top-left */}
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-bold font-[family-name:var(--font-system)] tracking-widest z-10"
          style={{ background: ad.accentColor, color: ad.bgColor }}
        >
          {ad.category}
        </div>

        {/* Slide number top-right */}
        <div
          className="absolute top-2 right-2 text-[8px] font-[family-name:var(--font-system)] opacity-60 z-10"
          style={{ color: ad.accentColor }}
        >
          {current + 1}/{total}
        </div>

        {/* Content — fills entire ad area */}
        <div className="absolute inset-0 flex pt-6">
          {/* Left: Hero image with ASCII fallback */}
          <div className="w-1/2 flex items-center justify-center p-2 overflow-hidden">
            <AdImage ad={ad} />
          </div>

          {/* Right: Ad copy */}
          <div className="w-1/2 flex flex-col justify-center pr-4 py-3 gap-2">
            <div
              className="font-[family-name:var(--font-window)] leading-tight"
              style={{
                fontSize: "clamp(16px, 3vw, 26px)",
                color: ad.accentColor,
                textShadow: `2px 2px 0 ${ad.bgColor}`,
              }}
            >
              {ad.title}
            </div>
            <div
              className="font-[family-name:var(--font-system)] text-[8px] tracking-widest leading-tight"
              style={{ color: ad.textColor, opacity: 0.8 }}
            >
              {ad.tagline}
            </div>

            {/* Feature list */}
            <div className="space-y-1">
              {ad.features.map((f) => (
                <div
                  key={f}
                  className="font-[family-name:var(--font-system)] text-[10px] flex gap-1.5 items-center"
                  style={{ color: ad.textColor }}
                >
                  <span style={{ color: ad.accentColor }}>\u25BA</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA band */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5"
          style={{ background: ad.accentColor }}
        >
          <span
            className="font-[family-name:var(--font-system)] text-[10px] font-bold"
            style={{ color: ad.bgColor }}
          >
            FREE \u00B7 OPEN SOURCE \u00B7 EST. 2025
          </span>
          <button
            onClick={() => openSkillDetails(ad.skillId, ad.title)}
            className="px-3 py-1 text-[10px] font-bold font-[family-name:var(--font-system)] cursor-pointer"
            style={{
              background: ad.bgColor,
              color: ad.accentColor,
              border: `1px solid ${ad.textColor}`,
            }}
          >
            INSTALL NOW \u00BB
          </button>
        </div>
      </div>

      {/* Navigation controls */}
      <div
        className={cn(
          "flex items-center justify-between px-2 py-1 shrink-0",
          "bg-[var(--color-surface)]",
          "border-t border-t-[var(--color-border-raised-light)]"
        )}
      >
        <button className={btnClass} onClick={() => navigate(-1)}>\u25C4 Prev</button>

        {/* Dot indicators */}
        <div className="flex gap-1">
          {FEATURED_ADS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFading(true);
                setTimeout(() => { setCurrent(i); setFading(false); }, 200);
              }}
              className="w-2 h-2 cursor-pointer"
              style={{
                background: i === current
                  ? "var(--color-titlebar-active)"
                  : "var(--color-border-inset-dark)",
                border: "1px solid var(--color-border-inset-dark)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button className={btnClass} onClick={() => navigate(1)}>Next \u25BA</button>
      </div>
    </div>
  );
}

/* ── Ad image with ASCII fallback ────────────────────────────────────────── */

function AdImage({ ad }: { ad: SkillAd }) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when ad changes
  useEffect(() => {
    setImgError(false);
  }, [ad.skillId]);

  if (imgError) {
    return (
      <pre
        className="text-[7px] leading-[1.1] font-[family-name:var(--font-code)] select-none"
        style={{ color: ad.accentColor }}
      >
        {ad.ascii}
      </pre>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.adImage}
      alt={`${ad.title} ad`}
      className="w-full h-full object-contain"
      style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))" }}
      onError={() => setImgError(true)}
    />
  );
}
