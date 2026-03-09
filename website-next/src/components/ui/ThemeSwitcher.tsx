"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const THEMES = [
  { id: "classic", label: "Classic" },
  { id: "crt", label: "CRT" },
  { id: "inverted", label: "Dark" },
  { id: "cyberpunk", label: "Neon" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder skeleton during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex gap-1">
        {THEMES.map((t) => (
          <div
            key={t.id}
            className="h-7 w-14 border-2 border-[var(--color-border-raised-dark)] bg-[var(--color-surface)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {THEMES.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`
              cursor-pointer
              border-2
              px-2 py-1
              text-xs
              font-[family-name:var(--font-system)]
              text-[var(--color-text-primary)]
              bg-[var(--color-surface)]
              ${
                isActive
                  ? "border-t-[var(--color-border-raised-dark)] border-l-[var(--color-border-raised-dark)] border-b-[var(--color-border-raised-light)] border-r-[var(--color-border-raised-light)]"
                  : "border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)] border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]"
              }
              active:border-t-[var(--color-border-raised-dark)]
              active:border-l-[var(--color-border-raised-dark)]
              active:border-b-[var(--color-border-raised-light)]
              active:border-r-[var(--color-border-raised-light)]
            `}
            aria-pressed={isActive}
            title={`Switch to ${t.label} theme`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
