"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Win31Tooltip
 * Radix Tooltip wrapped in the classic Windows 3.1 yellow sticky-note
 * style. Uses semantic tooltip tokens so themes can override if needed.
 * -------------------------------------------------------------------------- */

export interface Win31TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayDuration?: number;
  className?: string;
}

export function Win31Tooltip({
  content,
  children,
  side = "bottom",
  delayDuration = 400,
  className,
}: Win31TooltipProps) {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            sideOffset={4}
            className={cn(
              "z-50 select-none",
              "px-2 py-1 text-xs",
              "bg-[var(--color-tooltip-bg)]",
              "text-[var(--color-tooltip-text)]",
              "border border-[var(--color-border-raised-dark)]",
              "font-[family-name:var(--font-system)]",
              className,
            )}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
