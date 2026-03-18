/**
 * Windows 3.1 Paintbrush Color Palette
 * ====================================
 * 28 colors arranged in 2 rows of 14
 */

export interface PaletteColor {
  name: string;
  hex: string;
}

// Row 1: Standard colors + primaries
const ROW_1: PaletteColor[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'Dark Gray', hex: '#808080' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Dark Green', hex: '#008000' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Dark Cyan', hex: '#008B8B' },
  { name: 'Dark Olive', hex: '#556B2F' },
  { name: 'Saddle Brown', hex: '#8B4513' },
  { name: 'Dark Slate', hex: '#483D8B' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Midnight Blue', hex: '#191970' },
];

// Row 2: Bright colors + light shades
const ROW_2: PaletteColor[] = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Gray', hex: '#C0C0C0' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Lime', hex: '#00FF00' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Light Green', hex: '#90EE90' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Peach', hex: '#FFDAB9' },
];

// Combined palette (28 colors)
export const PALETTE: PaletteColor[] = [...ROW_1, ...ROW_2];

// Get palette as 2D array for grid rendering
export const PALETTE_GRID: [PaletteColor[], PaletteColor[]] = [ROW_1, ROW_2];

// Default colors
export const DEFAULT_FOREGROUND = '#000000';
export const DEFAULT_BACKGROUND = '#FFFFFF';

// Utility functions
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function colorsMatch(color1: string, color2: string): boolean {
  return color1.toLowerCase() === color2.toLowerCase();
}

// Find the closest palette color to a given hex
export function findClosestPaletteColor(hex: string): PaletteColor {
  const rgb = hexToRgb(hex);
  if (!rgb) return PALETTE[0];

  let closest = PALETTE[0];
  let minDistance = Infinity;

  for (const color of PALETTE) {
    const paletteRgb = hexToRgb(color.hex);
    if (!paletteRgb) continue;

    // Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(rgb.r - paletteRgb.r, 2) +
      Math.pow(rgb.g - paletteRgb.g, 2) +
      Math.pow(rgb.b - paletteRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest;
}
