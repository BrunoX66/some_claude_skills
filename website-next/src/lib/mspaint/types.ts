/**
 * MS Paint Skill - Core Type Definitions
 * ======================================
 */

// Tool types available in the paint program
export type ToolType =
  | 'freeformSelect'
  | 'rectangleSelect'
  | 'eraser'
  | 'fill'
  | 'colorPicker'
  | 'magnifier'
  | 'pencil'
  | 'brush'
  | 'airbrush'
  | 'text'
  | 'line'
  | 'curve'
  | 'rectangle'
  | 'polygon'
  | 'ellipse'
  | 'roundedRectangle'
  | 'gradient'
  | 'clone';

// Shape fill modes
export type FillMode = 'outline' | 'filled' | 'both';

// Brush shapes
export type BrushShape = 'circle' | 'square' | 'diagonalLeft' | 'diagonalRight';

// Brush/tool sizes
export type ToolSize = 1 | 2 | 3 | 4 | 5;

// Airbrush spray density
export type SprayDensity = 'small' | 'medium' | 'large';

/**
 * Paint Commands
 * ==============
 * These are the commands that Claude can emit to control the paint program.
 * Each command represents a discrete action.
 */

export type PaintCommand =
  // Color commands
  | { type: 'setForegroundColor'; color: string }
  | { type: 'setBackgroundColor'; color: string }

  // Tool selection
  | { type: 'selectTool'; tool: ToolType }
  | { type: 'setToolSize'; size: ToolSize }
  | { type: 'setBrushShape'; shape: BrushShape }
  | { type: 'setFillMode'; mode: FillMode }
  | { type: 'setSprayDensity'; density: SprayDensity }

  // Basic drawing
  | { type: 'drawPixel'; x: number; y: number }
  | { type: 'drawLine'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'drawFreehand'; points: Array<{ x: number; y: number }> }

  // Shapes
  | { type: 'drawRectangle'; x: number; y: number; width: number; height: number; fillMode?: FillMode }
  | { type: 'drawEllipse'; x: number; y: number; width: number; height: number; fillMode?: FillMode }
  | { type: 'drawRoundedRectangle'; x: number; y: number; width: number; height: number; radius?: number; fillMode?: FillMode }
  | { type: 'drawPolygon'; points: Array<{ x: number; y: number }>; fillMode?: FillMode }
  | { type: 'drawCurve'; startX: number; startY: number; endX: number; endY: number; controlX1: number; controlY1: number; controlX2?: number; controlY2?: number }

  // Fill
  | { type: 'floodFill'; x: number; y: number }

  // Airbrush
  | { type: 'spray'; x: number; y: number; duration?: number }
  | { type: 'sprayPath'; points: Array<{ x: number; y: number }> }

  // Text
  | { type: 'placeText'; x: number; y: number; text: string; fontSize?: number; fontFamily?: string; bold?: boolean; italic?: boolean }

  // Eraser
  | { type: 'erase'; x: number; y: number }
  | { type: 'erasePath'; points: Array<{ x: number; y: number }> }

  // Canvas operations
  | { type: 'clearCanvas' }
  | { type: 'wait'; milliseconds: number }

  // Gradient fill
  | { type: 'gradientFill'; x1: number; y1: number; x2: number; y2: number; startColor: string; endColor: string; gradientType: 'linear' | 'radial' }

  // Clone/stamp tool
  | { type: 'setCloneSource'; x: number; y: number }
  | { type: 'stamp'; x: number; y: number }

  // Magnifier/zoom
  | { type: 'setZoom'; level: number; centerX?: number; centerY?: number }

  // History
  | { type: 'undo' }
  | { type: 'redo' };

/**
 * Command Sequence
 * ================
 * A complete sequence of commands from Claude, with metadata.
 */
export interface CommandSequence {
  version: string;
  description: string;
  commands: PaintCommand[];
}

/**
 * Canvas State
 * ============
 * Represents the current state of the canvas for checkpointing.
 */
export interface CanvasState {
  width: number;
  height: number;
  imageData: string; // base64 PNG
  foregroundColor: string;
  backgroundColor: string;
  selectedTool: ToolType;
  toolSize: ToolSize;
  brushShape: BrushShape;
  fillMode: FillMode;
}

/**
 * Playback State
 * ==============
 * State for the animated command playback.
 */
export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentCommandIndex: number;
  totalCommands: number;
  speed: number; // 0.5, 1, 2, 4
  ghostCursorPosition: { x: number; y: number } | null;
  ghostCursorTool: ToolType | null;
  ghostCursorColor: string | null;
  // Lerping state for smooth ghost cursor movement
  isLerping?: boolean;
  lerpProgress?: number;
  lerpFrom?: { x: number; y: number } | null;
  lerpTo?: { x: number; y: number } | null;
}

/**
 * History Node
 * ============
 * A node in the history tree (not stack - we preserve digressions).
 */
export interface HistoryNode {
  id: string;
  imageData: string; // base64 snapshot
  timestamp: number;
  action: string; // Description of what was done
  parentId: string | null;
  children: string[]; // IDs of child nodes (for branches/digressions)
}

/**
 * History State
 * =============
 * Full history tree with current position.
 */
export interface HistoryState {
  nodes: Map<string, HistoryNode>;
  currentNodeId: string;
  rootId: string;
}

/**
 * Zoom State
 * ==========
 * State for magnifier/zoom functionality.
 */
export interface ZoomState {
  level: number; // 1, 2, 4, 8
  panX: number; // Offset from canvas origin
  panY: number;
  isZoomed: boolean;
}

/**
 * Evaluation Result
 * =================
 * Result from evaluating a generated drawing.
 */
export interface EvaluationResult {
  prompt: string;
  commands: PaintCommand[];
  resultImage: string; // base64 PNG
  timestamp: string;

  // Scores
  qualityScore: number; // 1-10
  promptAlignmentScore: number; // 1-10
  clipScore?: number; // 0-1

  // Feedback
  issues: string[];
  successes: string[];
  suggestions: string[];
}

/**
 * Skill Version
 * =============
 * Metadata from skill.yaml
 */
export interface SkillVersion {
  version: string;
  date: string;
  changes: string[];
}

export interface SkillMetadata {
  name: string;
  version: string;
  author: string;
  description: string;
  model: string;
  changelog: SkillVersion[];
}
