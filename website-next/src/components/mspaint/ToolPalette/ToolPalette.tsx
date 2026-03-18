'use client';

import React from 'react';
import { ToolType, FillMode, BrushShape, ToolSize } from '@/lib/mspaint/types';
import { TOOLS, getTool } from '@/lib/mspaint/tools';
import { ToolIcon } from './ToolIcons';
import styles from './ToolPalette.module.css';

interface ToolPaletteProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  toolSize: ToolSize;
  onToolSizeChange: (size: ToolSize) => void;
  brushShape: BrushShape;
  onBrushShapeChange: (shape: BrushShape) => void;
  fillMode: FillMode;
  onFillModeChange: (mode: FillMode) => void;
  recommendedTools?: string[];
  promptClassification?: { category: string; subcategories: string[] } | null;
}

export function ToolPalette({
  selectedTool,
  onToolSelect,
  toolSize,
  onToolSizeChange,
  brushShape,
  onBrushShapeChange,
  fillMode,
  onFillModeChange,
  recommendedTools,
  promptClassification,
}: ToolPaletteProps) {
  const currentTool = TOOLS.find(t => t.id === selectedTool);

  return (
    <div className={styles.container}>
      {/* Tool Grid */}
      <div className={styles.toolGrid}>
        {TOOLS.map((tool) => {
          const isDimmed = recommendedTools && recommendedTools.length > 0 && !recommendedTools.includes(tool.id);
          return (
            <button
              key={tool.id}
              className={`${styles.toolBtn} ${selectedTool === tool.id ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''}`}
              onClick={() => onToolSelect(tool.id)}
              title={tool.name}
            >
              <ToolIcon tool={tool.id} />
            </button>
          );
        })}
      </div>

      {/* Classification Info */}
      {promptClassification && recommendedTools && recommendedTools.length > 0 && (
        <div className={styles.classificationPanel}>
          <div className={styles.classificationCategory}>
            {promptClassification.category}
          </div>
          <div className={styles.classificationTools}>
            {recommendedTools.map(toolId => (
              <span key={toolId} className={styles.classificationToolTag}>
                {getTool(toolId as ToolType)?.name || toolId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tool Options */}
      <div className={styles.options}>
        {/* Size options for applicable tools */}
        {currentTool?.optionType === 'size' && (
          <div className={styles.sizeOptions}>
            {[1, 2, 3, 4, 5].map((size) => (
              <button
                key={size}
                className={`${styles.sizeBtn} ${toolSize === size ? styles.selected : ''}`}
                onClick={() => onToolSizeChange(size as ToolSize)}
                title={`Size ${size}`}
              >
                <div
                  className={styles.sizeDot}
                  style={{
                    width: size * 2 + 2,
                    height: size * 2 + 2,
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Brush shape options */}
        {currentTool?.optionType === 'brushShape' && (
          <div className={styles.brushOptions}>
            {(['circle', 'square', 'diagonalLeft', 'diagonalRight'] as BrushShape[]).map((shape) => (
              <button
                key={shape}
                className={`${styles.brushBtn} ${brushShape === shape ? styles.selected : ''}`}
                onClick={() => onBrushShapeChange(shape)}
                title={shape}
              >
                <div className={`${styles.brushPreview} ${styles[shape]}`} />
              </button>
            ))}
          </div>
        )}

        {/* Fill mode options for shape tools */}
        {currentTool?.optionType === 'fillMode' && (
          <div className={styles.fillOptions}>
            <button
              className={`${styles.fillBtn} ${fillMode === 'outline' ? styles.selected : ''}`}
              onClick={() => onFillModeChange('outline')}
              title="Outline only"
            >
              <div className={styles.fillOutline} />
            </button>
            <button
              className={`${styles.fillBtn} ${fillMode === 'both' ? styles.selected : ''}`}
              onClick={() => onFillModeChange('both')}
              title="Outline and fill"
            >
              <div className={styles.fillBoth} />
            </button>
            <button
              className={`${styles.fillBtn} ${fillMode === 'filled' ? styles.selected : ''}`}
              onClick={() => onFillModeChange('filled')}
              title="Fill only"
            >
              <div className={styles.fillFilled} />
            </button>
          </div>
        )}

        {/* Spray density options */}
        {currentTool?.optionType === 'sprayDensity' && (
          <div className={styles.sprayOptions}>
            <button className={styles.sprayBtn} title="Small spray">
              <div className={styles.spraySmall} />
            </button>
            <button className={styles.sprayBtn} title="Medium spray">
              <div className={styles.sprayMedium} />
            </button>
            <button className={styles.sprayBtn} title="Large spray">
              <div className={styles.sprayLarge} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
