'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PaintCommand } from '@/lib/mspaint/types';
import styles from './CommandLog.module.css';

interface CommandLogEntry {
  index: number;
  command: PaintCommand;
  thumbnail?: string;
}

interface CommandLogProps {
  thinking: string | null;
  description: string | null;
  commands: PaintCommand[];
  currentCommandIndex: number;
  commandThumbnails: Map<number, string>;
}

export function CommandLog({
  thinking,
  description,
  commands,
  currentCommandIndex,
  commandThumbnails,
}: CommandLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current command
  useEffect(() => {
    if (logRef.current) {
      const currentItem = logRef.current.querySelector(`[data-index="${currentCommandIndex}"]`);
      if (currentItem) {
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentCommandIndex]);

  const formatCommand = (cmd: PaintCommand): string => {
    switch (cmd.type) {
      case 'setForegroundColor':
        return `Set color: ${cmd.color}`;
      case 'setBackgroundColor':
        return `Set bg: ${cmd.color}`;
      case 'drawPixel':
        return `Pixel at (${cmd.x}, ${cmd.y})`;
      case 'drawLine':
        return `Line (${cmd.x1},${cmd.y1}) → (${cmd.x2},${cmd.y2})`;
      case 'drawRectangle':
        return `Rect ${cmd.width}×${cmd.height} at (${cmd.x},${cmd.y}) [${cmd.fillMode}]`;
      case 'drawEllipse':
        return `Ellipse ${cmd.width}×${cmd.height} at (${cmd.x},${cmd.y}) [${cmd.fillMode}]`;
      case 'drawPolygon':
        return `Polygon ${cmd.points?.length || 0} points [${cmd.fillMode}]`;
      case 'floodFill':
        return `Fill at (${cmd.x}, ${cmd.y})`;
      case 'placeText':
        return `Text: "${cmd.text?.substring(0, 20)}..."`;
      case 'clearCanvas':
        return 'Clear canvas';
      case 'selectTool':
        return `Tool: ${cmd.tool}`;
      default:
        return JSON.stringify(cmd).substring(0, 50);
    }
  };

  const getColorPreview = (cmd: PaintCommand): string | null => {
    if (cmd.type === 'setForegroundColor' || cmd.type === 'setBackgroundColor') {
      return cmd.color;
    }
    return null;
  };

  if (commands.length === 0) {
    return null;
  }

  return (
    <div className={styles.commandLog}>
      <div className={styles.header}>
        <h3>AI Command Log</h3>
        <span className={styles.progress}>
          {currentCommandIndex} / {commands.length}
        </span>
      </div>

      {/* Claude's thinking */}
      {thinking && (
        <div className={styles.thinkingSection}>
          <div className={styles.thinkingHeader}>🎨 Claude's Plan:</div>
          <div className={styles.thinkingContent}>{thinking}</div>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className={styles.description}>
          <strong>Drawing:</strong> {description}
        </div>
      )}

      {/* Command list with thumbnails */}
      <div className={styles.commandList} ref={logRef}>
        {commands.map((cmd, index) => {
          const isExecuted = index < currentCommandIndex;
          const isCurrent = index === currentCommandIndex;
          const thumbnail = commandThumbnails.get(index);
          const colorPreview = getColorPreview(cmd);

          return (
            <div
              key={index}
              data-index={index}
              className={`${styles.commandItem} ${isExecuted ? styles.executed : ''} ${isCurrent ? styles.current : ''}`}
            >
              <div className={styles.commandIndex}>{index + 1}</div>

              {/* Thumbnail */}
              <div className={styles.thumbnailContainer}>
                {thumbnail ? (
                  <img src={thumbnail} alt={`Step ${index + 1}`} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnailPlaceholder}>
                    {colorPreview ? (
                      <div
                        className={styles.colorSwatch}
                        style={{ backgroundColor: colorPreview }}
                      />
                    ) : (
                      '...'
                    )}
                  </div>
                )}
              </div>

              {/* Command description */}
              <div className={styles.commandText}>
                {formatCommand(cmd)}
              </div>

              {/* Status indicator */}
              <div className={styles.statusIndicator}>
                {isExecuted && '✓'}
                {isCurrent && '▶'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
