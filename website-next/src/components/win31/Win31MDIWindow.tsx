"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface Win31MDIWindowProps {
  /** Window title text */
  title: string;
  /** Window content */
  children: ReactNode;
  /** Initial X position within parent */
  initialX?: number;
  /** Initial Y position within parent */
  initialY?: number;
  /** Initial width */
  initialWidth?: number;
  /** Initial height */
  initialHeight?: number;
  /** Callbacks */
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onFocus?: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (w: number, h: number) => void;
  /** Whether this is the active child window */
  isMinimized?: boolean;
  isMaximized?: boolean;
  isActive?: boolean;
  /** z-index for stacking */
  zIndex?: number;
  /** Parent container bounds for constraining movement */
  parentBounds?: { width: number; height: number };
  /** Additional className */
  className?: string;
}

/**
 * Win31MDIWindow - A child window for use inside an MDI container (desktop).
 *
 * Simpler than Win31Window: no system menu, no resize handles.
 * Designed to be managed by a parent window manager that controls
 * stacking, minimization tray, and focus.
 *
 * Features:
 * - Draggable via title bar (constrained to parent bounds)
 * - Minimize / Maximize / Close buttons
 * - Active/inactive title bar styling
 * - All colors via semantic design tokens
 *
 * @example
 * ```tsx
 * <Win31MDIWindow
 *   title="Document1.txt"
 *   initialX={20}
 *   initialY={20}
 *   initialWidth={300}
 *   initialHeight={200}
 *   isActive={true}
 *   onClose={() => removeChild(id)}
 *   onFocus={() => bringToFront(id)}
 *   parentBounds={{ width: 800, height: 600 }}
 * >
 *   <p>Child window content</p>
 * </Win31MDIWindow>
 * ```
 */
export function Win31MDIWindow({
  title,
  children,
  initialX = 20,
  initialY = 20,
  initialWidth = 300,
  initialHeight = 200,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  onMove,
  onResize: onResizeCb,
  isMinimized = false,
  isMaximized = false,
  isActive = false,
  zIndex = 1,
  parentBounds,
  className,
}: Win31MDIWindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const preMaxRef = useRef({
    x: initialX,
    y: initialY,
    w: initialWidth,
    h: initialHeight,
  });

  /* ─── Drag handling ──────────────────────────────────────────────────── */

  const handleTitlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (isMaximized) return;
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onFocus?.();
      isDraggingRef.current = true;
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: pos.x,
        posY: pos.y,
      };
    },
    [isMaximized, pos.x, pos.y, onFocus]
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      let newX = dragStartRef.current.posX + dx;
      let newY = dragStartRef.current.posY + dy;

      // Constrain to parent bounds
      if (parentBounds) {
        newX = Math.max(0, Math.min(newX, parentBounds.width - size.w));
        newY = Math.max(0, Math.min(newY, parentBounds.height - size.h));
      }

      newY = Math.max(0, newY);
      setPos({ x: newX, y: newY });
      onMove?.(newX, newY);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [parentBounds, size.w, size.h, onMove]);

  /* ─── Maximize / Restore ─────────────────────────────────────────────── */

  const handleMaxToggle = useCallback(() => {
    if (isMaximized) {
      onRestore?.();
      setPos({ x: preMaxRef.current.x, y: preMaxRef.current.y });
      setSize({ w: preMaxRef.current.w, h: preMaxRef.current.h });
    } else {
      preMaxRef.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
      if (parentBounds) {
        setPos({ x: 0, y: 0 });
        setSize({ w: parentBounds.width, h: parentBounds.height });
        onResizeCb?.(parentBounds.width, parentBounds.height);
        onMove?.(0, 0);
      }
      onMaximize?.();
    }
  }, [isMaximized, onRestore, onMaximize, pos, size, parentBounds, onResizeCb, onMove]);

  /* ─── Render ─────────────────────────────────────────────────────────── */

  if (isMinimized) return null;

  const titleBarBg = isActive
    ? "bg-[var(--color-titlebar-active)]"
    : "bg-[var(--color-titlebar-inactive)]";

  const titleBtnClasses = cn(
    "w-3.5 h-[11px] flex items-center justify-center",
    "bg-[var(--color-surface)]",
    "border",
    "border-t-[var(--color-border-raised-light)]",
    "border-l-[var(--color-border-raised-light)]",
    "border-b-[var(--color-border-raised-dark)]",
    "border-r-[var(--color-border-raised-dark)]",
    "cursor-pointer select-none",
    "text-[7px] leading-none text-[var(--color-text-primary)]",
    "active:border-t-[var(--color-border-raised-dark)]",
    "active:border-l-[var(--color-border-raised-dark)]",
    "active:border-b-[var(--color-border-raised-light)]",
    "active:border-r-[var(--color-border-raised-light)]"
  );

  return (
    <div
      className={cn(
        "absolute flex flex-col",
        // Raised bevel
        "bg-[var(--color-surface)]",
        "border",
        "border-t-[var(--color-border-raised-light)]",
        "border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)]",
        "border-r-[var(--color-border-raised-dark)]",
        className
      )}
      style={{
        left: isMaximized ? 0 : pos.x,
        top: isMaximized ? 0 : pos.y,
        width: isMaximized && parentBounds ? parentBounds.width : size.w,
        height: isMaximized && parentBounds ? parentBounds.height : size.h,
        zIndex,
      }}
      onPointerDown={() => onFocus?.()}
    >
      {/* Title bar */}
      <div
        className={cn(
          "h-[14px] flex items-center gap-px px-0.5 shrink-0 select-none",
          titleBarBg
        )}
        style={{ touchAction: "none" }}
        onPointerDown={handleTitlePointerDown}
        onDoubleClick={handleMaxToggle}
      >
        {/* Title text */}
        <span
          className={cn(
            "flex-1 truncate",
            "font-[family-name:var(--font-window)] text-xs font-normal tracking-wide",
            "text-[var(--color-titlebar-text)]"
          )}
        >
          {title}
        </span>

        {/* Buttons */}
        <div className="flex items-center gap-px">
          {onMinimize && (
            <button
              className={titleBtnClasses}
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              aria-label="Minimize"
            >
              {"\u25BC"}
            </button>
          )}
          {(onMaximize || onRestore) && (
            <button
              className={titleBtnClasses}
              onClick={(e) => {
                e.stopPropagation();
                handleMaxToggle();
              }}
              aria-label={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? "\u25A0" : "\u25B2"}
            </button>
          )}
          {onClose && (
            <button
              className={titleBtnClasses}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
            >
              {"\u2715"}
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div
        className={cn(
          "flex-1 min-h-0 overflow-auto",
          "bg-[var(--color-surface-inset)]",
          "border",
          "border-t-[var(--color-border-inset-light)]",
          "border-l-[var(--color-border-inset-light)]",
          "border-b-[var(--color-border-inset-dark)]",
          "border-r-[var(--color-border-inset-dark)]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
