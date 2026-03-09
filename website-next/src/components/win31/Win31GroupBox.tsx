"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Win31GroupBoxProps {
  /** Label displayed in the top border of the group box */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Win31GroupBox - A labeled container with an inset border and legend.
 *
 * Mimics the Win31 GroupBox control: an etched border with a text label
 * inset into the top edge, used to visually group related controls.
 *
 * @example
 * ```tsx
 * <Win31GroupBox label="Options">
 *   <Win31Button>Option A</Win31Button>
 *   <Win31Button>Option B</Win31Button>
 * </Win31GroupBox>
 * ```
 */
export function Win31GroupBox({
  label,
  children,
  className,
}: Win31GroupBoxProps) {
  return (
    <fieldset
      className={cn(
        "relative",
        "mt-2 p-3 pt-4",
        "border-2",
        "border-t-[var(--color-border-inset-light)]",
        "border-l-[var(--color-border-inset-light)]",
        "border-r-[var(--color-border-inset-dark)]",
        "border-b-[var(--color-border-inset-dark)]",
        className
      )}
    >
      <legend
        className={cn(
          "px-1",
          "font-[family-name:var(--font-system)]",
          "text-xs",
          "text-[var(--color-text-primary)]"
        )}
      >
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
