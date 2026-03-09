"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const panelVariants = cva("border-2", {
  variants: {
    variant: {
      raised: [
        "bg-[var(--color-surface)]",
        "border-t-[var(--color-border-raised-light)]",
        "border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)]",
        "border-r-[var(--color-border-raised-dark)]",
        "shadow-[inset_1px_1px_0_var(--color-border-raised-light),inset_-1px_-1px_0_var(--color-border-inset-light)]",
      ].join(" "),
      inset: [
        "bg-[var(--color-surface-inset)]",
        "border-t-[var(--color-border-inset-light)]",
        "border-l-[var(--color-border-inset-light)]",
        "border-b-[var(--color-border-inset-dark)]",
        "border-r-[var(--color-border-inset-dark)]",
      ].join(" "),
      flat: [
        "bg-[var(--color-surface)]",
        "border-[var(--color-border-outer)]",
      ].join(" "),
    },
  },
  defaultVariants: { variant: "raised" },
});

export interface Win31PanelProps extends VariantProps<typeof panelVariants> {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Win31Panel - A container with 3D beveled borders.
 *
 * Variants:
 * - `raised` (default): Outset bevel, used for windows and toolbars
 * - `inset`: Sunken bevel, used for text fields and list boxes
 * - `flat`: Flat border, used for status sections
 *
 * @example
 * ```tsx
 * <Win31Panel>Raised content</Win31Panel>
 * <Win31Panel variant="inset">Sunken text field</Win31Panel>
 * <Win31Panel variant="flat" className="p-4">Flat panel</Win31Panel>
 * ```
 */
export function Win31Panel({
  children,
  variant,
  className,
  style,
}: Win31PanelProps) {
  return (
    <div className={cn(panelVariants({ variant }), className)} style={style}>
      {children}
    </div>
  );
}
