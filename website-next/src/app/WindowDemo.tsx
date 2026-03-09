"use client";

import { useState } from "react";
import { Win31Window } from "@/components/win31";

/**
 * Interactive demo of Win31Window for the home page.
 * Client component wrapper since Win31Window requires mouse event handlers.
 */
export function WindowDemo() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <div className="text-center">
        <button
          className="font-[family-name:var(--font-system)] text-xs text-[var(--color-text-link)] underline cursor-pointer"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setIsMaximized(false);
          }}
        >
          Reopen README.TXT window
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[700px] h-[450px]">
      <Win31Window
        title="README.TXT"
        initialX={40}
        initialY={20}
        initialWidth={500}
        initialHeight={350}
        isActive={true}
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsMinimized(true)}
        onMaximize={() => setIsMaximized(true)}
        onRestore={() => {
          setIsMaximized(false);
          setIsMinimized(false);
        }}
      >
        <div className="p-4 font-[family-name:var(--font-body)] text-[var(--color-text-primary)]">
          <h1 className="font-[family-name:var(--font-window)] text-3xl text-[var(--color-titlebar-active)] mb-2">
            Some Claude Skills
          </h1>
          <p className="mb-2">
            This window is draggable, resizable, and theme-aware.
          </p>
          <p className="mb-2">
            Try dragging the title bar, resizing from edges and corners,
            and using the system menu (the small square icon).
          </p>
          <p className="mb-2">
            The minimize, maximize, and close buttons all work.
            Double-click the title bar to toggle maximize.
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm mt-4">
            All colors use semantic design tokens.
            Switch themes above to see them adapt.
          </p>
        </div>
      </Win31Window>

      {/* Show restore button when minimized */}
      {isMinimized && (
        <div className="absolute bottom-2 left-2">
          <button
            className="font-[family-name:var(--font-system)] text-xs bg-[var(--color-surface)] border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)] border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)] px-2 py-0.5 cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            README.TXT
          </button>
        </div>
      )}
    </div>
  );
}
