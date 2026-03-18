"use client";

import { MSPaintAppContent } from "./MSPaintAppContent";

/**
 * MSPaintWindow — renders the full ms_paint_skill app inside the Win31Window shell.
 * The outer window chrome (titlebar, resize, drag) is handled by Win31Window in windowManager.
 */
export function MSPaintWindow() {
  return <MSPaintAppContent />;
}
