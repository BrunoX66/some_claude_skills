"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Win31Menu
 * Radix DropdownMenu wrapped in Windows 3.1 chrome. Provides keyboard
 * navigation, typeahead, and ARIA via Radix. We supply the visual layer.
 * -------------------------------------------------------------------------- */

/* --- Root --- */
export interface Win31MenuProps {
  children: ReactNode;
}

export function Win31Menu({ children }: Win31MenuProps) {
  return <DropdownMenu.Root>{children}</DropdownMenu.Root>;
}

/* --- Trigger --- */
export const Win31MenuTrigger = DropdownMenu.Trigger;

/* --- Content --- */
export interface Win31MenuContentProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu.Content> {
  children: ReactNode;
  className?: string;
}

export function Win31MenuContent({
  children,
  className,
  ...props
}: Win31MenuContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={2}
        className={cn(
          "z-[99999] min-w-[160px] py-1",
          // Raised panel chrome
          "bg-[var(--color-surface)]",
          "border-2",
          "border-t-[var(--color-border-raised-light)]",
          "border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)]",
          "border-r-[var(--color-border-raised-dark)]",
          // Drop shadow
          "shadow-[2px_2px_0_var(--color-black)]",
          className,
        )}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

/* --- Item --- */
export interface Win31MenuItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenu.Item> {
  children: ReactNode;
  className?: string;
}

export function Win31MenuItem({
  children,
  className,
  disabled,
  ...props
}: Win31MenuItemProps) {
  return (
    <DropdownMenu.Item
      disabled={disabled}
      className={cn(
        "px-4 py-1 text-xs",
        "font-[family-name:var(--font-system)]",
        "text-[var(--color-text-primary)]",
        "cursor-default select-none",
        "outline-none",
        // Highlighted state (keyboard or hover)
        "data-[highlighted]:bg-[var(--color-titlebar-active)]",
        "data-[highlighted]:text-[var(--color-text-on-titlebar)]",
        // Disabled
        disabled && "text-[var(--color-text-muted)] cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenu.Item>
  );
}

/* --- Separator --- */
export interface Win31MenuSeparatorProps {
  className?: string;
}

export function Win31MenuSeparator({ className }: Win31MenuSeparatorProps) {
  return (
    <DropdownMenu.Separator
      className={cn(
        "h-px my-1 mx-2",
        "bg-[var(--color-border-inset-light)]",
        className,
      )}
    />
  );
}
