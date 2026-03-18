"use client";

import { useState, useEffect, useMemo } from "react";

/**
 * Layout modes for the Win31 shell.
 * - pocket: <400px — single fullscreen window, bottom nav
 * - pda:    400-640px — single fullscreen window, slightly wider grid
 * - tablet: 640-1024px — floating windows with larger touch targets
 * - desktop: >1024px — classic Win31 experience
 */
export type LayoutMode = "pocket" | "pda" | "tablet" | "desktop";

const BREAKPOINTS = {
  pda: "(min-width: 400px)",
  tablet: "(min-width: 640px)",
  desktop: "(min-width: 1024px)",
} as const;

const TOUCH_QUERY = "(pointer: coarse)";

function getLayoutMode(
  isPda: boolean,
  isTablet: boolean,
  isDesktop: boolean
): LayoutMode {
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  if (isPda) return "pda";
  return "pocket";
}

/**
 * Reactive viewport hook using matchMedia listeners.
 * SSR-safe: defaults to desktop (server renders the full layout,
 * client corrects on hydration).
 */
export function useViewport() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("desktop");
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    // Guard for SSR
    if (typeof window === "undefined") return;

    const mqPda = window.matchMedia(BREAKPOINTS.pda);
    const mqTablet = window.matchMedia(BREAKPOINTS.tablet);
    const mqDesktop = window.matchMedia(BREAKPOINTS.desktop);
    const mqTouch = window.matchMedia(TOUCH_QUERY);

    const update = () => {
      setLayoutMode(
        getLayoutMode(mqPda.matches, mqTablet.matches, mqDesktop.matches)
      );
      setHasTouch(mqTouch.matches);
    };

    // Set initial values
    update();

    // Listen for threshold crossings
    mqPda.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    mqDesktop.addEventListener("change", update);
    mqTouch.addEventListener("change", update);

    return () => {
      mqPda.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
      mqDesktop.removeEventListener("change", update);
      mqTouch.removeEventListener("change", update);
    };
  }, []);

  const isMobile = layoutMode === "pocket" || layoutMode === "pda";
  const isTabletOrBelow = isMobile || layoutMode === "tablet";

  return useMemo(
    () => ({ layoutMode, hasTouch, isMobile, isTabletOrBelow }),
    [layoutMode, hasTouch, isMobile, isTabletOrBelow]
  );
}
