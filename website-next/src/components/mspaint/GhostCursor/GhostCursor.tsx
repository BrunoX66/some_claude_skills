'use client';

import React from 'react';
import { ToolType } from '@/lib/mspaint/types';
import { ToolIcon } from '../ToolPalette/ToolIcons';
import styles from './GhostCursor.module.css';

interface GhostCursorProps {
  x: number;
  y: number;
  tool: ToolType;
  color: string;
}

export function GhostCursor({ x, y, tool, color }: GhostCursorProps) {
  return (
    <div
      className={styles.ghostCursor}
      style={{
        left: x,
        top: y,
      }}
    >
      <div className={styles.iconContainer}>
        <ToolIcon tool={tool} className={styles.icon} />
      </div>
      <div
        className={styles.colorIndicator}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
