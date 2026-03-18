"use client";

import { cn } from "@/lib/utils";

/**
 * Category color palette — one per major category slug.
 * Fallback to a default gold for unmapped categories.
 */
const CATEGORY_COLORS: Record<string, { body: string; tab: string }> = {
  "Design & Creative":        { body: "#f59e0b", tab: "#d97706" },
  "AI & Machine Learning":    { body: "#6366f1", tab: "#4f46e5" },
  "DevOps & Site Reliability":{ body: "#10b981", tab: "#059669" },
  "Code Quality & Testing":   { body: "#3b82f6", tab: "#2563eb" },
  "Lifestyle & Personal":     { body: "#ec4899", tab: "#db2777" },
  "Productivity & Meta":      { body: "#8b5cf6", tab: "#7c3aed" },
  "Content & Writing":        { body: "#14b8a6", tab: "#0d9488" },
  "Business & Monetization":  { body: "#f97316", tab: "#ea580c" },
  "Career & Interview":       { body: "#84cc16", tab: "#65a30d" },
  "Research & Analysis":      { body: "#06b6d4", tab: "#0891b2" },
  "Data & Analytics":         { body: "#0ea5e9", tab: "#0284c7" },
  "Legal & Compliance":       { body: "#a78bfa", tab: "#7c3aed" },
  "Project Management":       { body: "#fb923c", tab: "#ea580c" },
};

/** Deterministic color from category name hash for unmapped categories */
const FALLBACK_PALETTES = [
  { body: "#c0c0c0", tab: "#a0a0a0" },
  { body: "#fbbf24", tab: "#d97706" },
  { body: "#60a5fa", tab: "#3b82f6" },
  { body: "#34d399", tab: "#10b981" },
  { body: "#f472b6", tab: "#ec4899" },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getCategoryColors(category: string): { body: string; tab: string } {
  return CATEGORY_COLORS[category] ?? FALLBACK_PALETTES[hashStr(category) % FALLBACK_PALETTES.length];
}

interface FolderIconProps {
  category: string;
  /** Whether the folder is currently open */
  isOpen?: boolean;
  /** Pixel size (square bounding box for the folder graphic) */
  size?: number;
  className?: string;
}

/**
 * FolderIcon - A Windows 3.1–style folder icon SVG.
 *
 * Each category gets a deterministic color. Open folders show
 * documents peeking out of the top.
 */
export function FolderIcon({ category, isOpen = false, size = 40, className }: FolderIconProps) {
  const { body, tab } = getCategoryColors(category);

  // Slightly darker shade for edges/shadow
  const shadow = "rgba(0,0,0,0.35)";
  const highlight = "rgba(255,255,255,0.55)";

  return (
    <svg
      viewBox="0 0 32 26"
      width={size}
      height={Math.round(size * 0.8)}
      className={cn("shrink-0 select-none", className)}
      aria-hidden
    >
      {/* Folder tab (top-left raised bit) */}
      <rect x="0" y="3" width="9" height="4" fill={tab} />
      <rect x="9" y="5" width="2" height="2" fill={tab} />
      {/* Tab highlight */}
      <rect x="0" y="3" width="9" height="1" fill={highlight} />
      <rect x="0" y="3" width="1" height="4" fill={highlight} />

      {/* Folder body */}
      <rect x="0" y="7" width="32" height="17" fill={body} />

      {isOpen && (
        /* Documents peeking out when open */
        <>
          <rect x="6" y="3" width="5" height="5" fill="white" opacity="0.85" />
          <rect x="13" y="2" width="5" height="6" fill="white" opacity="0.85" />
          <rect x="20" y="3" width="5" height="5" fill="white" opacity="0.7" />
        </>
      )}

      {/* Folder body highlight (top) */}
      <rect x="0" y="7" width="32" height="1" fill={highlight} />
      {/* Left edge highlight */}
      <rect x="0" y="7" width="1" height="17" fill={highlight} />
      {/* Bottom shadow */}
      <rect x="0" y="23" width="32" height="1" fill={shadow} />
      {/* Right shadow */}
      <rect x="31" y="7" width="1" height="17" fill={shadow} />
    </svg>
  );
}
