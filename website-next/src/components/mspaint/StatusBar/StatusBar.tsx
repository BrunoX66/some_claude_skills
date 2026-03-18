'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ToolType, PlaybackState } from '@/lib/mspaint/types';
import { getTool } from '@/lib/mspaint/tools';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  mousePos: { x: number; y: number } | null;
  selectedTool: ToolType;
  playbackState: PlaybackState;
}

interface HealthStatus {
  server: string;
  lmStudio: { available: boolean; model?: string };
  uptime: number;
}

export function StatusBar({ mousePos, selectedTool, playbackState }: StatusBarProps) {
  const tool = getTool(selectedTool);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const pollHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) setHealth(await res.json());
    } catch {
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    pollHealth();
    const interval = setInterval(pollHealth, 30_000);
    return () => clearInterval(interval);
  }, [pollHealth]);

  const lmAvailable = health?.lmStudio?.available ?? false;
  const lmModel = health?.lmStudio?.model;

  return (
    <div className={styles.statusbar}>
      {/* Tool description */}
      <div className={styles.section} style={{ flex: 1 }}>
        {playbackState.isPlaying && !playbackState.isPaused
          ? `Playing command ${playbackState.currentCommandIndex + 1} of ${playbackState.totalCommands}`
          : tool?.description || 'Ready'}
      </div>

      {/* LM Studio indicator */}
      <div
        className={styles.section}
        style={{ width: 120, cursor: 'default', position: 'relative' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span
          className={styles.indicator}
          style={{ background: lmAvailable ? '#00AA00' : '#CC0000' }}
        />
        <span style={{ marginLeft: 4 }}>
          {lmAvailable ? 'VQ-R1' : 'No Scorer'}
        </span>
        {showTooltip && (
          <div className={styles.tooltip}>
            {lmAvailable
              ? `LM Studio connected\nModel: ${lmModel || 'unknown'}\nVQ-R1 scoring active`
              : 'LM Studio offline\nAesthetic scoring unavailable\nStart LM Studio to enable VQ-R1'}
          </div>
        )}
      </div>

      {/* Coordinates */}
      <div className={styles.section} style={{ width: 80 }}>
        {mousePos ? `${mousePos.x}, ${mousePos.y}` : ''}
      </div>

      {/* Playback info */}
      {playbackState.totalCommands > 0 && (
        <div className={styles.section} style={{ width: 60 }}>
          {playbackState.speed}x
        </div>
      )}
    </div>
  );
}
