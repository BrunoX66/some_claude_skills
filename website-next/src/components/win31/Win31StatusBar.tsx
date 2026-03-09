"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface StatusBarSectionProps {
  children: ReactNode;
  /** Flex basis or width, e.g. "auto" or "200px" */
  width?: string;
  className?: string;
}

/**
 * StatusBarSection - An individual sunken section within a Win31StatusBar.
 *
 * Each section has an inset bevel to appear recessed, like Win31 status
 * bar panes.
 *
 * @example
 * ```tsx
 * <StatusBarSection>Ready</StatusBarSection>
 * <StatusBarSection width="120px">Ln 1, Col 1</StatusBarSection>
 * ```
 */
export function StatusBarSection({
  children,
  width,
  className,
}: StatusBarSectionProps) {
  return (
    <div
      className={cn(
        "px-2 py-0.5",
        "border-2",
        "border-t-[var(--color-border-inset-light)]",
        "border-l-[var(--color-border-inset-light)]",
        "border-b-[var(--color-border-inset-dark)]",
        "border-r-[var(--color-border-inset-dark)]",
        "font-[family-name:var(--font-system)]",
        "text-xs",
        "text-[var(--color-text-primary)]",
        "truncate",
        className
      )}
      style={width ? { width, flexShrink: 0 } : { flex: 1 }}
    >
      {children}
    </div>
  );
}

export interface Win31StatusBarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Win31StatusBar - A horizontal bar at the bottom of a window with sunken sections.
 *
 * Typically placed at the bottom of a Win31Window to show status info,
 * cursor position, mode indicators, etc.
 *
 * @example
 * ```tsx
 * <Win31StatusBar>
 *   <StatusBarSection>Ready</StatusBarSection>
 *   <StatusBarSection width="100px">INS</StatusBarSection>
 *   <StatusBarSection width="100px">Ln 1, Col 1</StatusBarSection>
 * </Win31StatusBar>
 * ```
 */
export function Win31StatusBar({ children, className }: Win31StatusBarProps) {
  return (
    <div
      className={cn(
        "flex gap-0.5",
        "bg-[var(--color-surface)]",
        "p-0.5",
        "border-t-2",
        "border-t-[var(--color-border-inset-light)]",
        className
      )}
    >
      {children}
    </div>
  );
}
