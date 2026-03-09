"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  [
    // Base styles
    "border-2",
    "text-center",
    "cursor-pointer",
    "select-none",
    "font-[family-name:var(--font-system)]",
    "transition-none",
    // Focus state: dotted inner outline
    "focus:outline-1",
    "focus:outline-dotted",
    "focus:outline-[var(--color-border-raised-dark)]",
    "focus:-outline-offset-4",
    // Disabled
    "disabled:cursor-not-allowed",
    "disabled:opacity-60",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          // Surface color
          "bg-[var(--color-surface)]",
          "text-[var(--color-text-primary)]",
          // Raised bevel
          "border-t-[var(--color-border-raised-light)]",
          "border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)]",
          "border-r-[var(--color-border-raised-dark)]",
          // Inner shadow for depth
          "shadow-[inset_-1px_-1px_0_var(--color-border-inset-light),inset_1px_1px_0_var(--color-border-inset-dark)]",
          // Hover
          "hover:not-disabled:bg-[var(--color-surface-raised)]",
          // Active: invert bevel
          "active:not-disabled:border-t-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-l-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-b-[var(--color-border-raised-light)]",
          "active:not-disabled:border-r-[var(--color-border-raised-light)]",
          "active:not-disabled:shadow-[inset_1px_1px_0_var(--color-border-inset-light),inset_-1px_-1px_0_var(--color-border-inset-dark)]",
          "active:not-disabled:translate-y-px",
        ].join(" "),
        primary: [
          // Navy background
          "bg-[var(--color-titlebar-active)]",
          "text-[var(--color-text-on-titlebar)]",
          // Raised bevel
          "border-t-[var(--color-border-raised-light)]",
          "border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)]",
          "border-r-[var(--color-border-raised-dark)]",
          // Inner shadow
          "shadow-[inset_-1px_-1px_0_var(--color-border-inset-light),inset_1px_1px_0_var(--color-border-inset-dark)]",
          // Hover
          "hover:not-disabled:brightness-125",
          // Active: invert bevel
          "active:not-disabled:border-t-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-l-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-b-[var(--color-border-raised-light)]",
          "active:not-disabled:border-r-[var(--color-border-raised-light)]",
          "active:not-disabled:shadow-[inset_1px_1px_0_var(--color-border-inset-light),inset_-1px_-1px_0_var(--color-border-inset-dark)]",
          "active:not-disabled:translate-y-px",
          // Disabled
          "disabled:text-[var(--color-text-muted)]",
        ].join(" "),
        danger: [
          // Red background
          "bg-[var(--color-error)]",
          "text-[var(--color-text-on-titlebar)]",
          // Raised bevel
          "border-t-[var(--color-border-raised-light)]",
          "border-l-[var(--color-border-raised-light)]",
          "border-b-[var(--color-border-raised-dark)]",
          "border-r-[var(--color-border-raised-dark)]",
          // Inner shadow
          "shadow-[inset_-1px_-1px_0_var(--color-border-inset-light),inset_1px_1px_0_var(--color-border-inset-dark)]",
          // Hover
          "hover:not-disabled:brightness-125",
          // Active: invert bevel
          "active:not-disabled:border-t-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-l-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-b-[var(--color-border-raised-light)]",
          "active:not-disabled:border-r-[var(--color-border-raised-light)]",
          "active:not-disabled:shadow-[inset_1px_1px_0_var(--color-border-inset-light),inset_-1px_-1px_0_var(--color-border-inset-dark)]",
          "active:not-disabled:translate-y-px",
          // Disabled
          "disabled:text-[var(--color-text-muted)]",
        ].join(" "),
        ghost: [
          // Transparent background
          "bg-transparent",
          "text-[var(--color-text-primary)]",
          "border-transparent",
          "shadow-none",
          // Hover: show surface
          "hover:not-disabled:bg-[var(--color-surface)]",
          "hover:not-disabled:border-t-[var(--color-border-raised-light)]",
          "hover:not-disabled:border-l-[var(--color-border-raised-light)]",
          "hover:not-disabled:border-b-[var(--color-border-raised-dark)]",
          "hover:not-disabled:border-r-[var(--color-border-raised-dark)]",
          // Active: invert bevel
          "active:not-disabled:bg-[var(--color-surface)]",
          "active:not-disabled:border-t-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-l-[var(--color-border-raised-dark)]",
          "active:not-disabled:border-b-[var(--color-border-raised-light)]",
          "active:not-disabled:border-r-[var(--color-border-raised-light)]",
          "active:not-disabled:translate-y-px",
        ].join(" "),
      },
      size: {
        sm: "text-xs px-3 py-1 min-w-[60px]",
        md: "text-sm px-4 py-1.5 min-w-[var(--win31-button-min-width)]",
        lg: "text-base px-5 py-2 min-w-[100px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface Win31ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

/**
 * Win31Button - A Windows 3.1 style button with 3D beveled appearance.
 *
 * Features:
 * - 3D outset border (raised) that inverts on press
 * - Four variants: default, primary (navy), danger (red), ghost (transparent)
 * - Three sizes: sm, md, lg
 * - Proper disabled state with reduced opacity
 * - Dotted focus outline (Win31 style)
 *
 * @example
 * ```tsx
 * <Win31Button onClick={fn}>OK</Win31Button>
 * <Win31Button variant="primary" size="lg">Save</Win31Button>
 * <Win31Button variant="danger">Delete</Win31Button>
 * <Win31Button variant="ghost" size="sm">X</Win31Button>
 * <Win31Button disabled>Disabled</Win31Button>
 * ```
 */
export function Win31Button({
  children,
  variant,
  size,
  className,
  ...props
}: Win31ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
