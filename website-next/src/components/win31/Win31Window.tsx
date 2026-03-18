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

/* ─── Types ──────────────────────────────────────────────────────────────── */

type ResizeEdge =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw"
  | null;

export interface Win31WindowProps {
  /** Window title text displayed in the title bar */
  title: string;
  /** Window content */
  children: ReactNode;
  /** Initial X position (px from left) */
  initialX?: number;
  /** Initial Y position (px from top) */
  initialY?: number;
  /** Initial width in px */
  initialWidth?: number;
  /** Initial height in px */
  initialHeight?: number;
  /** Minimum width (default 200) */
  minWidth?: number;
  /** Minimum height (default 150) */
  minHeight?: number;
  /** Whether this window is the active/focused one */
  isActive?: boolean;
  /** z-index layer */
  zIndex?: number;
  /** Whether the window is currently minimized */
  isMinimized?: boolean;
  /** Whether the window is currently maximized */
  isMaximized?: boolean;
  /** Override position/size externally */
  forceX?: number;
  forceY?: number;
  forceW?: number;
  forceH?: number;
  /** Callbacks */
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onFocus?: () => void;
  onMove?: (x: number, y: number) => void;
  onResize?: (w: number, h: number) => void;
  /** Whether the window can be dragged (default true) */
  draggable?: boolean;
  /** Whether the window can be resized (default true) */
  resizable?: boolean;
  /** Whether to show the system menu icon (default true) */
  showSystemMenu?: boolean;
  /** Additional className for the outer container */
  className?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const RESIZE_HANDLE = 8;

function getEdge(
  e: ReactPointerEvent | { clientX: number; clientY: number },
  rect: DOMRect,
  resizable: boolean
): ResizeEdge {
  if (!resizable) return null;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = rect.width;
  const h = rect.height;

  const top = y < RESIZE_HANDLE;
  const bottom = y > h - RESIZE_HANDLE;
  const left = x < RESIZE_HANDLE;
  const right = x > w - RESIZE_HANDLE;

  if (top && left) return "nw";
  if (top && right) return "ne";
  if (bottom && left) return "sw";
  if (bottom && right) return "se";
  if (top) return "n";
  if (bottom) return "s";
  if (left) return "w";
  if (right) return "e";
  return null;
}

function cursorForEdge(edge: ResizeEdge): string {
  switch (edge) {
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "nw":
    case "se":
      return "nwse-resize";
    default:
      return "default";
  }
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Win31Window - A fully interactive Windows 3.1 style window.
 *
 * Features:
 * - Draggable via title bar
 * - Resizable from all edges and corners
 * - Minimize / Maximize / Restore / Close
 * - System menu (double-click icon or single-click to toggle)
 * - Active/inactive title bar styling
 * - All colors via semantic design tokens (theme-aware)
 *
 * @example
 * ```tsx
 * <Win31Window
 *   title="README.TXT"
 *   initialX={100}
 *   initialY={80}
 *   initialWidth={500}
 *   initialHeight={350}
 *   isActive={true}
 *   onClose={() => {}}
 * >
 *   <p>Hello from Win31!</p>
 * </Win31Window>
 * ```
 */
export function Win31Window({
  title,
  children,
  initialX = 50,
  initialY = 50,
  initialWidth = 400,
  initialHeight = 300,
  minWidth = 200,
  minHeight = 150,
  isActive = true,
  zIndex = 10,
  isMinimized = false,
  isMaximized = false,
  forceX,
  forceY,
  forceW,
  forceH,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onFocus,
  onMove,
  onResize: onResizeCb,
  draggable = true,
  resizable = true,
  showSystemMenu = true,
  className,
}: Win31WindowProps) {
  /* ─── State ──────────────────────────────────────────────────────────── */

  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight });
  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const [hoverEdge, setHoverEdge] = useState<ResizeEdge>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const resizeEdgeRef = useRef<ResizeEdge>(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  // Store pre-maximize geometry for restore
  const preMaxRef = useRef({ x: initialX, y: initialY, w: initialWidth, h: initialHeight });

  // Apply forced overrides
  const x = forceX ?? pos.x;
  const y = forceY ?? pos.y;
  const w = forceW ?? size.w;
  const h = forceH ?? size.h;

  /* ─── Dragging ───────────────────────────────────────────────────────── */

  const handleTitleBarPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (!draggable || isMaximized) return;
      // Ignore if clicking buttons
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: pos.x,
        posY: pos.y,
      };
    },
    [draggable, isMaximized, pos.x, pos.y]
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Resize takes priority over drag (prevents conflict at title bar top edge)
      if (isResizingRef.current) {
        const edge = resizeEdgeRef.current;
        if (!edge) return;
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;
        const s = resizeStartRef.current;

        let newX = s.x;
        let newY = s.y;
        let newW = s.w;
        let newH = s.h;

        if (edge.includes("e")) newW = Math.max(minWidth, s.w + dx);
        if (edge.includes("s")) newH = Math.max(minHeight, s.h + dy);
        if (edge.includes("w")) {
          newW = Math.max(minWidth, s.w - dx);
          if (newW > minWidth) newX = s.x + dx;
        }
        if (edge.includes("n")) {
          newH = Math.max(minHeight, s.h - dy);
          if (newH > minHeight) newY = s.y + dy;
        }

        setPos({ x: newX, y: newY });
        setSize({ w: newW, h: newH });
        onMove?.(newX, newY);
        onResizeCb?.(newW, newH);
      } else if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const newX = dragStartRef.current.posX + dx;
        const newY = Math.max(0, dragStartRef.current.posY + dy);
        setPos({ x: newX, y: newY });
        onMove?.(newX, newY);
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
      resizeEdgeRef.current = null;
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [minWidth, minHeight, onMove, onResizeCb]);

  /* ─── Resizing ───────────────────────────────────────────────────────── */

  const handleWindowPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      onFocus?.();

      if (!resizable || isMaximized) return;
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;
      const edge = getEdge(e, rect, resizable);
      if (!edge) return;

      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = false; // Cancel drag if resize takes priority
      isResizingRef.current = true;
      resizeEdgeRef.current = edge;
      resizeStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        x: pos.x,
        y: pos.y,
        w: size.w,
        h: size.h,
      };
    },
    [resizable, isMaximized, pos.x, pos.y, size.w, size.h, onFocus]
  );

  const handleWindowPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!resizable || isMaximized || isDraggingRef.current || isResizingRef.current) return;
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;
      setHoverEdge(getEdge(e, rect, resizable));
    },
    [resizable, isMaximized]
  );

  /* ─── Escape key: close active window ───────────────────────────────── */

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onClose]);

  /* ─── System Menu ────────────────────────────────────────────────────── */

  const toggleSystemMenu = useCallback(() => {
    setSystemMenuOpen((prev) => !prev);
  }, []);

  // Close system menu on outside click
  useEffect(() => {
    if (!systemMenuOpen) return;
    const handler = (e: globalThis.PointerEvent | globalThis.MouseEvent) => {
      if (!windowRef.current?.contains(e.target as Node)) {
        setSystemMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [systemMenuOpen]);

  const handleSystemMenuAction = useCallback(
    (action: string) => {
      setSystemMenuOpen(false);
      switch (action) {
        case "restore":
          onRestore?.();
          break;
        case "move":
          // No-op for now, just closes menu
          break;
        case "size":
          // No-op for now
          break;
        case "minimize":
          onMinimize?.();
          break;
        case "maximize":
          if (!isMaximized) {
            preMaxRef.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
          }
          onMaximize?.();
          break;
        case "close":
          onClose?.();
          break;
      }
    },
    [onRestore, onMinimize, onMaximize, onClose, isMaximized, pos, size]
  );

  /* ─── Title bar double click → toggle maximize ───────────────────────── */

  const handleTitleDoubleClick = useCallback(() => {
    if (isMaximized) {
      onRestore?.();
    } else {
      preMaxRef.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
      onMaximize?.();
    }
  }, [isMaximized, onRestore, onMaximize, pos, size]);

  /* ─── Render ─────────────────────────────────────────────────────────── */

  if (isMinimized) return null;

  // Active titlebar uses a gradient (matches original someclaudeskills.com)
  const titleBarBg = isActive ? "" : "bg-[var(--color-titlebar-inactive)]";
  const titleBarStyle = isActive
    ? { background: "linear-gradient(90deg, var(--color-titlebar-active), var(--color-titlebar-end, #4040c0))" }
    : undefined;

  const titleBarTextColor = "text-[var(--color-titlebar-text)]";

  // Title bar button: small raised button in the title bar
  const titleBtnClasses = cn(
    "flex items-center justify-center",
    "w-[var(--win31-titlebar-btn)] h-[var(--win31-titlebar-btn)]",
    "text-[length:var(--win31-titlebar-btn-font)] leading-none",
    "bg-[var(--color-surface)]",
    "border",
    "border-t-[var(--color-border-raised-light)]",
    "border-l-[var(--color-border-raised-light)]",
    "border-b-[var(--color-border-raised-dark)]",
    "border-r-[var(--color-border-raised-dark)]",
    "cursor-pointer select-none",
    "text-[var(--color-text-primary)]",
    "active:border-t-[var(--color-border-raised-dark)]",
    "active:border-l-[var(--color-border-raised-dark)]",
    "active:border-b-[var(--color-border-raised-light)]",
    "active:border-r-[var(--color-border-raised-light)]"
  );

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-label={title}
      aria-modal="false"
      className={cn(
        "absolute flex flex-col",
        // Outer raised bevel
        "bg-[var(--color-surface)]",
        "border-2",
        "border-t-[var(--color-border-raised-light)]",
        "border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)]",
        "border-r-[var(--color-border-raised-dark)]",
        // Inner shadow for extra depth
        "shadow-[inset_1px_1px_0_var(--color-border-raised-light),inset_-1px_-1px_0_var(--color-border-inset-light),2px_2px_4px_rgba(0,0,0,0.3)]",
        className
      )}
      style={
        isMaximized
          ? { inset: 0, zIndex }
          : { left: x, top: y, width: w, height: h, zIndex, cursor: hoverEdge ? cursorForEdge(hoverEdge) : undefined }
      }
      onPointerDown={handleWindowPointerDown}
      onPointerMove={handleWindowPointerMove}
    >
      {/* ─── Title bar ───────────────────────────────────────────────── */}
      <div
        className={cn(
          "h-[var(--win31-titlebar-height)] flex items-center gap-0.5 px-0.5 shrink-0 select-none",
          titleBarBg
        )}
        style={{ ...titleBarStyle, touchAction: "none" }}
        onPointerDown={handleTitleBarPointerDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        {/* System menu icon */}
        {showSystemMenu && (
          <div className="relative">
            <button
              className={cn(
                "flex items-center justify-center",
                "w-[var(--win31-titlebar-btn)] h-[var(--win31-titlebar-btn)]",
                "text-[length:var(--win31-titlebar-btn-font)] leading-none",
                "bg-[var(--color-surface)]",
                "border",
                "border-t-[var(--color-border-raised-light)]",
                "border-l-[var(--color-border-raised-light)]",
                "border-b-[var(--color-border-raised-dark)]",
                "border-r-[var(--color-border-raised-dark)]"
              )}
              onClick={(e) => {
                e.stopPropagation();
                toggleSystemMenu();
              }}
              aria-label="System menu"
            >
              <span className="text-[length:var(--win31-titlebar-btn-font)] leading-none text-[var(--color-text-primary)] font-bold">
                {"\u2500"}
              </span>
            </button>

            {/* System menu dropdown */}
            {systemMenuOpen && (
              <div
                role="menu"
                aria-label={`${title} system menu`}
                className={cn(
                  "absolute left-0 top-full mt-px z-50",
                  "min-w-[140px]",
                  "bg-[var(--color-surface)]",
                  "border-2",
                  "border-t-[var(--color-border-raised-light)]",
                  "border-l-[var(--color-border-raised-light)]",
                  "border-b-[var(--color-border-raised-dark)]",
                  "border-r-[var(--color-border-raised-dark)]",
                  "shadow-[2px_2px_4px_rgba(0,0,0,0.3)]",
                  "py-0.5"
                )}
              >
                {[
                  {
                    label: "Restore",
                    action: "restore",
                    disabled: !isMaximized,
                  },
                  { label: "Move", action: "move", disabled: isMaximized },
                  { label: "Size", action: "size", disabled: isMaximized },
                  {
                    label: "Minimize",
                    action: "minimize",
                    disabled: !onMinimize,
                  },
                  {
                    label: "Maximize",
                    action: "maximize",
                    disabled: isMaximized || !onMaximize,
                  },
                  { type: "separator" as const },
                  {
                    label: "Close",
                    action: "close",
                    shortcut: "Alt+F4",
                    disabled: !onClose,
                  },
                ].map((item, idx) =>
                  "type" in item && item.type === "separator" ? (
                    <div
                      key={idx}
                      className="mx-1 my-0.5 border-t border-t-[var(--color-border-inset-light)] border-b border-b-[var(--color-border-inset-dark)]"
                    />
                  ) : (
                    <button
                      key={idx}
                      role="menuitem"
                      className={cn(
                        "w-full text-left px-4 py-0.5 flex justify-between items-center",
                        "font-[family-name:var(--font-system)] text-xs",
                        "text-[var(--color-text-primary)]",
                        "disabled:text-[var(--color-text-muted)]",
                        "hover:not-disabled:bg-[var(--color-titlebar-active)]",
                        "hover:not-disabled:text-[var(--color-text-on-titlebar)]"
                      )}
                      disabled={"disabled" in item ? !!item.disabled : false}
                      onClick={() =>
                        "action" in item &&
                        handleSystemMenuAction(item.action as string)
                      }
                    >
                      <span>{"label" in item ? item.label : ""}</span>
                      {"shortcut" in item && (
                        <span className="ml-4 text-[10px]">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Title text */}
        <span
          className={cn(
            "flex-1 truncate",
            "font-[family-name:var(--font-window)] text-sm font-normal tracking-wide",
            titleBarTextColor
          )}
        >
          {title}
        </span>

        {/* Window buttons */}
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
                if (isMaximized) {
                  onRestore?.();
                } else {
                  preMaxRef.current = {
                    x: pos.x,
                    y: pos.y,
                    w: size.w,
                    h: size.h,
                  };
                  onMaximize?.();
                }
              }}
              aria-label={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? "\u25A0" : "\u25B2"}
            </button>
          )}
        </div>
      </div>

      {/* ─── Menu bar placeholder (optional, via children) ────────────── */}

      {/* ─── Window body ─────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 min-h-0 overflow-auto",
          "bg-[var(--color-surface)]",
          // Inset border around content area
          "border",
          "border-t-[var(--color-border-inset-light)]",
          "border-l-[var(--color-border-inset-light)]",
          "border-b-[var(--color-border-inset-dark)]",
          "border-r-[var(--color-border-inset-dark)]",
          "mx-0.5 mb-0.5"
        )}
      >
        {children}
      </div>

      {/* ─── Resize handles (invisible) ──────────────────────────────── */}
      {resizable && !isMaximized && (
        <>
          {/* Corner grips - visual indicators */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
            style={{ zIndex: zIndex + 1 }}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
            style={{ zIndex: zIndex + 1 }}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
            style={{ zIndex: zIndex + 1 }}
          />
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
            style={{ zIndex: zIndex + 1 }}
          />
        </>
      )}
    </div>
  );
}
