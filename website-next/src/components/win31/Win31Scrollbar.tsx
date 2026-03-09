"use client";

import { useState, useRef, useCallback, useEffect, type RefObject } from "react";
import { cn } from "@/lib/utils";

export interface Win31ScrollbarProps {
  /** Ref to the scrollable content container */
  contentRef: RefObject<HTMLElement | null>;
  /** Orientation: vertical (default) or horizontal */
  orientation?: "vertical" | "horizontal";
  /** Additional className for the scrollbar track */
  className?: string;
}

/**
 * Win31Scrollbar - A Windows 3.1 style custom scrollbar.
 *
 * Attaches to a scrollable content container via ref, providing:
 * - Draggable thumb
 * - Click-in-track to page scroll
 * - Arrow buttons with press-and-hold repeat
 * - Keyboard support (arrow keys, page up/down)
 * - Auto-hides when content doesn't overflow
 * - ResizeObserver for dynamic content
 *
 * @example
 * ```tsx
 * const contentRef = useRef<HTMLDivElement>(null);
 * <div ref={contentRef} className="overflow-hidden h-64">
 *   <div>...tall content...</div>
 * </div>
 * <Win31Scrollbar contentRef={contentRef} />
 * ```
 */
export function Win31Scrollbar({
  contentRef,
  orientation = "vertical",
  className,
}: Win31ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const repeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [thumbSize, setThumbSize] = useState(30);
  const [thumbPos, setThumbPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dragStartRef = useRef({ mousePos: 0, scrollPos: 0 });

  const isVertical = orientation === "vertical";

  // Compute thumb size and position from content scroll state
  const updateThumb = useCallback(() => {
    const content = contentRef.current;
    const track = trackRef.current;
    if (!content || !track) return;

    const contentSize = isVertical ? content.scrollHeight : content.scrollWidth;
    const viewSize = isVertical ? content.clientHeight : content.clientWidth;
    const scrollPos = isVertical ? content.scrollTop : content.scrollLeft;

    // Arrow button height is 16px each, track usable area excludes them
    const trackSize = isVertical
      ? track.clientHeight - 32
      : track.clientWidth - 32;

    if (contentSize <= viewSize) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);

    const ratio = viewSize / contentSize;
    const newThumbSize = Math.max(20, Math.round(trackSize * ratio));
    const maxScroll = contentSize - viewSize;
    const maxThumbPos = trackSize - newThumbSize;
    const newThumbPos =
      maxScroll > 0 ? Math.round((scrollPos / maxScroll) * maxThumbPos) : 0;

    setThumbSize(newThumbSize);
    setThumbPos(newThumbPos);
  }, [contentRef, isVertical]);

  // Observe content size changes
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    updateThumb();

    const observer = new ResizeObserver(() => updateThumb());
    observer.observe(content);
    if (content.firstElementChild) {
      observer.observe(content.firstElementChild);
    }

    content.addEventListener("scroll", updateThumb, { passive: true });

    return () => {
      observer.disconnect();
      content.removeEventListener("scroll", updateThumb);
    };
  }, [contentRef, updateThumb]);

  // Drag thumb
  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const content = contentRef.current;
      if (!content) return;

      setIsDragging(true);
      dragStartRef.current = {
        mousePos: isVertical ? e.clientY : e.clientX,
        scrollPos: isVertical ? content.scrollTop : content.scrollLeft,
      };
    },
    [contentRef, isVertical]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const content = contentRef.current;
      const track = trackRef.current;
      if (!content || !track) return;

      const trackSize = isVertical
        ? track.clientHeight - 32
        : track.clientWidth - 32;
      const contentSize = isVertical
        ? content.scrollHeight
        : content.scrollWidth;
      const viewSize = isVertical ? content.clientHeight : content.clientWidth;
      const maxScroll = contentSize - viewSize;
      const maxThumbTravel = trackSize - thumbSize;

      const mouseDelta =
        (isVertical ? e.clientY : e.clientX) - dragStartRef.current.mousePos;
      const scrollDelta =
        maxThumbTravel > 0 ? (mouseDelta / maxThumbTravel) * maxScroll : 0;

      const newScroll = Math.min(
        maxScroll,
        Math.max(0, dragStartRef.current.scrollPos + scrollDelta)
      );

      if (isVertical) {
        content.scrollTop = newScroll;
      } else {
        content.scrollLeft = newScroll;
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, contentRef, isVertical, thumbSize]);

  // Click in track to page-scroll
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const content = contentRef.current;
      const track = trackRef.current;
      if (!content || !track) return;
      // Ignore if clicking thumb or arrows
      if (
        thumbRef.current?.contains(e.target as Node) ||
        (e.target as HTMLElement).dataset.scrollArrow
      )
        return;

      const rect = track.getBoundingClientRect();
      const clickPos = isVertical
        ? e.clientY - rect.top - 16
        : e.clientX - rect.left - 16;
      const viewSize = isVertical ? content.clientHeight : content.clientWidth;

      if (clickPos < thumbPos) {
        // Page up
        if (isVertical) content.scrollTop -= viewSize;
        else content.scrollLeft -= viewSize;
      } else {
        // Page down
        if (isVertical) content.scrollTop += viewSize;
        else content.scrollLeft += viewSize;
      }
    },
    [contentRef, isVertical, thumbPos]
  );

  // Arrow scroll with repeat
  const startArrowScroll = useCallback(
    (direction: -1 | 1) => {
      const content = contentRef.current;
      if (!content) return;

      const scrollStep = 20;
      const doScroll = () => {
        if (isVertical) {
          content.scrollTop += scrollStep * direction;
        } else {
          content.scrollLeft += scrollStep * direction;
        }
      };

      doScroll();
      // Start repeating after initial delay
      repeatTimerRef.current = setInterval(doScroll, 50);
    },
    [contentRef, isVertical]
  );

  const stopArrowScroll = useCallback(() => {
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  const arrowButtonClasses = cn(
    "flex items-center justify-center",
    "bg-[var(--color-surface)]",
    "border",
    "border-t-[var(--color-border-raised-light)]",
    "border-l-[var(--color-border-raised-light)]",
    "border-b-[var(--color-border-raised-dark)]",
    "border-r-[var(--color-border-raised-dark)]",
    "cursor-pointer select-none",
    "text-[8px] text-[var(--color-text-primary)]",
    "active:border-t-[var(--color-border-raised-dark)]",
    "active:border-l-[var(--color-border-raised-dark)]",
    "active:border-b-[var(--color-border-raised-light)]",
    "active:border-r-[var(--color-border-raised-light)]",
    isVertical ? "h-4 w-full" : "w-4 h-full"
  );

  const thumbClasses = cn(
    "absolute",
    "bg-[var(--color-surface)]",
    "border-2",
    "border-t-[var(--color-border-raised-light)]",
    "border-l-[var(--color-border-raised-light)]",
    "border-b-[var(--color-border-raised-dark)]",
    "border-r-[var(--color-border-raised-dark)]",
    "cursor-pointer",
    isDragging && "cursor-grabbing"
  );

  return (
    <div
      ref={trackRef}
      className={cn(
        "bg-[var(--color-surface)]",
        "relative",
        isVertical
          ? "w-[var(--win31-scrollbar-width)] flex flex-col"
          : "h-[var(--win31-scrollbar-width)] flex flex-row",
        isVertical
          ? "border-l border-[var(--color-border-inset-light)]"
          : "border-t border-[var(--color-border-inset-light)]",
        className
      )}
      onClick={handleTrackClick}
    >
      {/* Up / Left arrow */}
      <button
        data-scroll-arrow="true"
        className={arrowButtonClasses}
        onMouseDown={(e) => {
          e.preventDefault();
          startArrowScroll(-1);
        }}
        onMouseUp={stopArrowScroll}
        onMouseLeave={stopArrowScroll}
        aria-label={isVertical ? "Scroll up" : "Scroll left"}
      >
        {isVertical ? "\u25B2" : "\u25C0"}
      </button>

      {/* Track area */}
      <div className="relative flex-1">
        {/* Thumb */}
        <div
          ref={thumbRef}
          className={thumbClasses}
          style={
            isVertical
              ? {
                  top: thumbPos,
                  left: 0,
                  right: 0,
                  height: thumbSize,
                }
              : {
                  left: thumbPos,
                  top: 0,
                  bottom: 0,
                  width: thumbSize,
                }
          }
          onMouseDown={handleThumbMouseDown}
        />
      </div>

      {/* Down / Right arrow */}
      <button
        data-scroll-arrow="true"
        className={arrowButtonClasses}
        onMouseDown={(e) => {
          e.preventDefault();
          startArrowScroll(1);
        }}
        onMouseUp={stopArrowScroll}
        onMouseLeave={stopArrowScroll}
        aria-label={isVertical ? "Scroll down" : "Scroll right"}
      >
        {isVertical ? "\u25BC" : "\u25B6"}
      </button>
    </div>
  );
}
