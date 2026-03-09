"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Win31PatternType = "solid" | "halftone" | "crosshatch" | "dots";

export interface Win31BackgroundProps {
  children?: ReactNode;
  /** Desktop pattern style. Defaults to "solid". */
  pattern?: Win31PatternType;
  /** Override the background color. Defaults to var(--color-desktop). */
  color?: string;
  className?: string;
}

/**
 * Win31Background - The teal desktop background.
 *
 * Provides the classic Windows 3.1 desktop surface. Supports optional
 * patterns via CSS background-image overlays. Color defaults to the
 * `--color-desktop` semantic token so it responds to theme changes.
 *
 * @example
 * ```tsx
 * <Win31Background>
 *   <Win31Panel className="p-4">Window on desktop</Win31Panel>
 * </Win31Background>
 *
 * <Win31Background pattern="halftone" />
 * ```
 */
export function Win31Background({
  children,
  pattern = "solid",
  color,
  className,
}: Win31BackgroundProps) {
  const bgColor = color ?? "var(--color-desktop)";

  // Build pattern-specific inline style
  const patternStyle = getPatternStyle(pattern, bgColor);

  return (
    <div
      className={cn("min-h-screen w-full", className)}
      style={patternStyle}
    >
      {children}
    </div>
  );
}

function getPatternStyle(
  pattern: Win31PatternType,
  bgColor: string
): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundColor: bgColor,
  };

  switch (pattern) {
    case "halftone":
      return {
        ...base,
        backgroundImage: [
          `radial-gradient(circle, var(--color-teal-600) 1px, transparent 1px)`,
        ].join(", "),
        backgroundSize: "4px 4px",
      };

    case "crosshatch":
      return {
        ...base,
        backgroundImage: [
          `linear-gradient(45deg, var(--color-teal-600) 25%, transparent 25%, transparent 75%, var(--color-teal-600) 75%)`,
          `linear-gradient(-45deg, var(--color-teal-600) 25%, transparent 25%, transparent 75%, var(--color-teal-600) 75%)`,
        ].join(", "),
        backgroundSize: "8px 8px",
      };

    case "dots":
      return {
        ...base,
        backgroundImage: `radial-gradient(circle, var(--color-teal-600) 1.5px, transparent 1.5px)`,
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0, 4px 4px",
      };

    case "solid":
    default:
      return base;
  }
}
