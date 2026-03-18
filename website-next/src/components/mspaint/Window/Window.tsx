'use client';

import React, { useState, ReactNode } from 'react';
import styles from './Window.module.css';

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function Window({ title, children, onClose, onMinimize, onMaximize }: WindowProps) {
  const [isActive] = useState(true);

  return (
    <div className={`win31 ${styles.window}`}>
      {/* Title Bar */}
      <div className={`${styles.titlebar} ${!isActive ? styles.inactive : ''}`}>
        {/* System Menu Icon */}
        <div className={styles.titlebarIcon}>
          <div className={styles.systemIcon}>
            <span>🎨</span>
          </div>
        </div>

        {/* Title Text */}
        <div className={styles.titlebarText}>{title}</div>

        {/* Window Buttons */}
        <div className={styles.titlebarButtons}>
          <button
            className={styles.titlebarBtn}
            onClick={onMinimize}
            title="Minimize"
          >
            ▼
          </button>
          <button
            className={styles.titlebarBtn}
            onClick={onMaximize}
            title="Maximize"
          >
            ▲
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
