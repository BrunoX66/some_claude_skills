/**
 * Tool Definitions
 * ================
 * Metadata and icons for each paint tool
 */

import { ToolType } from './types';

export interface ToolDefinition {
  id: ToolType;
  name: string;
  shortcut?: string;
  description: string;
  hasOptions?: boolean;
  optionType?: 'size' | 'brushShape' | 'fillMode' | 'sprayDensity';
}

// Tool definitions in order (2 columns, 8 rows)
export const TOOLS: ToolDefinition[] = [
  // Row 1
  { id: 'freeformSelect', name: 'Free-Form Select', description: 'Select an irregular area' },
  { id: 'rectangleSelect', name: 'Select', description: 'Select a rectangular area' },

  // Row 2
  { id: 'eraser', name: 'Eraser', description: 'Erase with background color', hasOptions: true, optionType: 'size' },
  { id: 'fill', name: 'Fill', description: 'Fill an area with color' },

  // Row 3
  { id: 'colorPicker', name: 'Pick Color', description: 'Pick a color from the image' },
  { id: 'magnifier', name: 'Magnifier', description: 'Zoom in or out' },

  // Row 4
  { id: 'pencil', name: 'Pencil', description: 'Draw 1-pixel lines' },
  { id: 'brush', name: 'Brush', description: 'Draw with various brush shapes', hasOptions: true, optionType: 'brushShape' },

  // Row 5
  { id: 'airbrush', name: 'Airbrush', description: 'Spray paint effect', hasOptions: true, optionType: 'sprayDensity' },
  { id: 'text', name: 'Text', description: 'Insert text' },

  // Row 6
  { id: 'line', name: 'Line', description: 'Draw a straight line', hasOptions: true, optionType: 'size' },
  { id: 'curve', name: 'Curve', description: 'Draw a curved line', hasOptions: true, optionType: 'size' },

  // Row 7
  { id: 'rectangle', name: 'Rectangle', description: 'Draw a rectangle', hasOptions: true, optionType: 'fillMode' },
  { id: 'polygon', name: 'Polygon', description: 'Draw a polygon', hasOptions: true, optionType: 'fillMode' },

  // Row 8
  { id: 'ellipse', name: 'Ellipse', description: 'Draw an ellipse', hasOptions: true, optionType: 'fillMode' },
  { id: 'roundedRectangle', name: 'Rounded Rectangle', description: 'Draw a rounded rectangle', hasOptions: true, optionType: 'fillMode' },

  // Row 9 (extra tools)
  { id: 'gradient', name: 'Gradient', description: 'Fill with a gradient' },
  { id: 'clone', name: 'Clone Stamp', description: 'Clone from another area' },
];

// Get tool by ID
export function getTool(id: ToolType): ToolDefinition | undefined {
  return TOOLS.find(t => t.id === id);
}

// Tool icons as simple pixel art (16x16, encoded as strings for now)
// In production, these would be actual image files or SVGs
export const TOOL_ICONS: Record<ToolType, string> = {
  freeformSelect: '⭐', // Placeholder - will be replaced with actual pixel art
  rectangleSelect: '▢',
  eraser: '🧹',
  fill: '🪣',
  colorPicker: '💉',
  magnifier: '🔍',
  pencil: '✏️',
  brush: '🖌️',
  airbrush: '💨',
  text: 'A',
  line: '╱',
  curve: '〰️',
  rectangle: '▭',
  polygon: '⬠',
  ellipse: '⬭',
  roundedRectangle: '▢',
  gradient: '🌈',
  clone: '📋',
};

// Brush shape options
export const BRUSH_SHAPES = [
  { id: 'circle', name: 'Circle' },
  { id: 'square', name: 'Square' },
  { id: 'diagonalLeft', name: 'Diagonal \\' },
  { id: 'diagonalRight', name: 'Diagonal /' },
] as const;

// Size options (in pixels)
export const SIZE_OPTIONS = [1, 2, 3, 4, 5] as const;

// Fill mode options
export const FILL_MODE_OPTIONS = [
  { id: 'outline', name: 'Outline' },
  { id: 'filled', name: 'Filled' },
  { id: 'both', name: 'Both' },
] as const;

// Spray density options
export const SPRAY_DENSITY_OPTIONS = [
  { id: 'small', name: 'Small', radius: 5, particles: 5 },
  { id: 'medium', name: 'Medium', radius: 10, particles: 10 },
  { id: 'large', name: 'Large', radius: 15, particles: 20 },
] as const;
