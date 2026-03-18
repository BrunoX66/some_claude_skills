"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface MobileTitleBarProps {
  /** Current window title, or "Skills" when on home grid */
  title: string;
  /** Optional right-side content (e.g. exploration counter) */
  rightContent?: React.ReactNode;
}

/**
 * MobileTitleBar - Navy gradient status bar for pocket/PDA mode.
 * Fixed at top, 44px tall. Shows title on left, time on right.
 * Title crossfades when changing between views.
 */
export function MobileTitleBar({ title, rightContent }: MobileTitleBarProps) {
  const [time, setTime] = useState("");
  const [displayTitle, setDisplayTitle] = useState(title);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const pendingTitleRef = useRef(title);

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    fmt();
    const id = setInterval(fmt, 30_000);
    return () => clearInterval(id);
  }, []);

  // Crossfade: fade out → swap text → fade in
  useEffect(() => {
    if (title === displayTitle) return;
    pendingTitleRef.current = title;
    setTitleOpacity(0);

    const timer = setTimeout(() => {
      setDisplayTitle(pendingTitleRef.current);
      setTitleOpacity(1);
    }, 150);

    return () => clearTimeout(timer);
  }, [title, displayTitle]);

  return (
    <div
      className={cn(
        "h-[var(--win31-touch-target)] shrink-0 flex items-center px-3",
        "select-none"
      )}
      style={{
        background:
          "linear-gradient(90deg, var(--color-titlebar-active), var(--color-titlebar-end, #4040c0))",
      }}
    >
      <span
        className={cn(
          "flex-1 truncate",
          "font-[family-name:var(--font-window)] text-sm font-bold tracking-wide",
          "text-[var(--color-titlebar-text)]"
        )}
        style={{
          opacity: titleOpacity,
          transition: "opacity 150ms ease",
        }}
      >
        {displayTitle}
      </span>

      {rightContent && (
        <span
          className={cn(
            "font-[family-name:var(--font-system)] text-[10px] tabular-nums",
            "text-[var(--color-titlebar-text)] opacity-60 mr-2"
          )}
        >
          {rightContent}
        </span>
      )}

      <span
        className={cn(
          "font-[family-name:var(--font-system)] text-xs tabular-nums",
          "text-[var(--color-titlebar-text)] opacity-80"
        )}
      >
        {time}
      </span>
    </div>
  );
}
