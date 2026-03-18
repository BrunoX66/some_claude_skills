/**
 * Estimate reading time for technical content.
 * 200 WPM for technical prose (lower than casual 250 WPM).
 * Returns minutes, minimum 1.
 */
export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
