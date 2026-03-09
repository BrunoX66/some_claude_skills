"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Win31Dialog
 * Radix Dialog wrapped in Windows 3.1 chrome: raised panel, navy titlebar,
 * "x" close button. Radix provides focus trap, ESC close, and ARIA roles
 * automatically -- we just supply the visual layer.
 * -------------------------------------------------------------------------- */

export interface Win31DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
  /** Tailwind width class, e.g. "max-w-md" or "w-[400px]" */
  width?: string;
}

export function Win31Dialog({
  open,
  onOpenChange,
  title,
  children,
  className,
  width = "max-w-lg",
}: Win31DialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Scrim */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-40",
            "bg-[var(--color-surface-overlay)]",
          )}
        />

        {/* Window */}
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "z-50 w-[calc(100%-2rem)]",
            width,
            // Raised panel chrome
            "bg-[var(--color-surface)]",
            "border-2",
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]",
            // Drop shadow
            "shadow-[4px_4px_0_var(--color-black)]",
            "focus:outline-none",
            className,
          )}
        >
          {/* Titlebar */}
          <div className="bg-[var(--color-titlebar-active)] h-[var(--win31-titlebar-height)] flex items-center justify-between px-2">
            <Dialog.Title className="text-xs font-bold text-[var(--color-text-on-titlebar)] font-[family-name:var(--font-window)] tracking-wide truncate">
              {title}
            </Dialog.Title>

            <Dialog.Close
              className={cn(
                "w-5 h-[14px] flex items-center justify-center",
                "text-[10px] leading-none font-bold",
                // Raised button
                "bg-[var(--color-surface)]",
                "border",
                "border-t-[var(--color-border-raised-light)]",
                "border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)]",
                "border-r-[var(--color-border-raised-dark)]",
                "text-[var(--color-text-primary)]",
                "cursor-pointer",
                // Active: invert bevel
                "active:border-t-[var(--color-border-raised-dark)]",
                "active:border-l-[var(--color-border-raised-dark)]",
                "active:border-b-[var(--color-border-raised-light)]",
                "active:border-r-[var(--color-border-raised-light)]",
              )}
              aria-label="Close"
            >
              <span aria-hidden>x</span>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-4 font-[family-name:var(--font-system)] text-sm text-[var(--color-text-primary)]">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* Re-export Dialog.Trigger for convenience */
export const Win31DialogTrigger = Dialog.Trigger;
