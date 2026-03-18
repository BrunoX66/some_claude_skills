'use client';

import React from 'react';
import { PALETTE_GRID } from '@/lib/mspaint/colors';
import styles from './ColorPalette.module.css';

interface ColorPaletteProps {
  foregroundColor: string;
  backgroundColor: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

export function ColorPalette({
  foregroundColor,
  backgroundColor,
  onForegroundChange,
  onBackgroundChange,
}: ColorPaletteProps) {
  const handleColorClick = (color: string, event: React.MouseEvent) => {
    // Left click = foreground, right click = background
    if (event.button === 2) {
      event.preventDefault();
      onBackgroundChange(color);
    } else {
      onForegroundChange(color);
    }
  };

  const handleContextMenu = (color: string, event: React.MouseEvent) => {
    event.preventDefault();
    onBackgroundChange(color);
  };

  return (
    <div className={styles.container}>
      {/* Foreground/Background selector */}
      <div className={styles.fgBgSelector}>
        <div
          className={styles.fgColor}
          style={{ backgroundColor: foregroundColor }}
          title={`Foreground: ${foregroundColor}`}
        />
        <div
          className={styles.bgColor}
          style={{ backgroundColor: backgroundColor }}
          title={`Background: ${backgroundColor}`}
        />
      </div>

      {/* Color grid */}
      <div className={styles.colorGrid}>
        {PALETTE_GRID.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.colorRow}>
            {row.map((color) => (
              <button
                key={color.hex}
                className={`${styles.colorSwatch} ${
                  foregroundColor === color.hex ? styles.selectedFg : ''
                } ${backgroundColor === color.hex ? styles.selectedBg : ''}`}
                style={{ backgroundColor: color.hex }}
                onClick={(e) => handleColorClick(color.hex, e)}
                onContextMenu={(e) => handleContextMenu(color.hex, e)}
                title={`${color.name} (${color.hex})\nLeft click: foreground\nRight click: background`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
