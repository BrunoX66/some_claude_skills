"use client";

import * as Select from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------
 * Win31Select
 * Radix Select wrapped in Windows 3.1 chrome. The trigger renders as an
 * inset (sunken) panel with a small raised arrow button on the right --
 * exactly how combo-boxes looked in Win31.
 * -------------------------------------------------------------------------- */

export interface Win31SelectOption {
  value: string;
  label: string;
}

export interface Win31SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Win31SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Win31Select({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
}: Win31SelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      {/* Trigger: inset field + arrow */}
      <Select.Trigger
        className={cn(
          "inline-flex items-center justify-between",
          "min-w-[140px] h-[22px]",
          "text-xs font-[family-name:var(--font-system)]",
          "text-[var(--color-text-primary)]",
          "cursor-default select-none outline-none",
          // Inset (sunken) panel for the text area
          "bg-[var(--color-surface-inset)]",
          "border-2",
          "border-t-[var(--color-border-inset-light)]",
          "border-l-[var(--color-border-inset-light)]",
          "border-b-[var(--color-border-inset-dark)]",
          "border-r-[var(--color-border-inset-dark)]",
          className,
        )}
      >
        <Select.Value
          placeholder={placeholder}
          className="px-1 truncate"
        />

        {/* Down-arrow button */}
        <Select.Icon
          className={cn(
            "w-[16px] h-full flex items-center justify-center",
            "bg-[var(--color-surface)]",
            "border-l-2 border-l-[var(--color-border-raised-dark)]",
            "text-[var(--color-text-primary)]",
          )}
        >
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>

      {/* Dropdown panel */}
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={1}
          className={cn(
            "z-50 min-w-[var(--radix-select-trigger-width)]",
            "max-h-[200px] overflow-y-auto",
            // Raised panel chrome
            "bg-[var(--color-surface)]",
            "border-2",
            "border-t-[var(--color-border-raised-light)]",
            "border-l-[var(--color-border-raised-light)]",
            "border-b-[var(--color-border-raised-dark)]",
            "border-r-[var(--color-border-raised-dark)]",
            // Drop shadow
            "shadow-[2px_2px_0_var(--color-black)]",
          )}
        >
          <Select.Viewport className="py-0.5">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "px-4 py-1 text-xs",
                  "font-[family-name:var(--font-system)]",
                  "text-[var(--color-text-primary)]",
                  "cursor-default select-none outline-none",
                  // Highlighted state
                  "data-[highlighted]:bg-[var(--color-titlebar-active)]",
                  "data-[highlighted]:text-[var(--color-text-on-titlebar)]",
                )}
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

/* Small SVG chevron so we don't need an icon library */
function ChevronDown() {
  return (
    <svg
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      aria-hidden="true"
      className="text-[var(--color-text-primary)]"
    >
      <path
        d="M0 0L4 6L8 0H0Z"
        fill="currentColor"
      />
    </svg>
  );
}
