"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Win31PatternType = "solid" | "halftone" | "crosshatch" | "dots" | "image";

export interface Win31BackgroundProps {
  children?: ReactNode;
  /** Desktop pattern style. Defaults to "solid". Use "image" with imageUrl. */
  pattern?: Win31PatternType;
  /** Override the background color. Defaults to var(--color-desktop). */
  color?: string;
  /** URL for background image (used when pattern="image"). */
  imageUrl?: string;
  className?: string;
}

/**
 * Win31Background - The desktop background.
 *
 * Supports solid color, CSS patterns, or a wallpaper image.
 * Color defaults to `--color-desktop` so it responds to theme changes.
 *
 * @example
 * ```tsx
 * <Win31Background pattern="image" imageUrl="/img/desktop-wallpaper.webp" />
 * ```
 */
export function Win31Background({
  children,
  pattern = "image",
  color,
  imageUrl = "/img/desktop-wallpaper.webp",
  className,
}: Win31BackgroundProps) {
  const bgColor = color ?? "var(--color-desktop)";
  const patternStyle = getPatternStyle(pattern, bgColor, imageUrl);

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
  bgColor: string,
  imageUrl?: string
): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundColor: bgColor,
  };

  switch (pattern) {
    case "image":
      return {
        ...base,
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };

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
