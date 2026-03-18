'use client';

import React from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { PlaybackState } from '@/lib/mspaint/types';
import styles from './PlaybackControls.module.css';

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSkip: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 2, 4];

export function PlaybackControls({
  playbackState,
  onPlay,
  onPause,
  onRestart,
  onSkip,
  onSpeedChange,
}: PlaybackControlsProps) {
  const { isPlaying, isPaused, currentCommandIndex, totalCommands, speed } = playbackState;
  const isFinished = currentCommandIndex >= totalCommands;

  return (
    <div className={styles.container}>
      {/* Progress indicator */}
      <div className={styles.progress}>
        <div
          className={styles.progressFill}
          style={{ width: `${(currentCommandIndex / Math.max(totalCommands, 1)) * 100}%` }}
        />
      </div>

      <div className={styles.controls}>
        {/* Restart */}
        <button
          className={styles.controlBtn}
          onClick={onRestart}
          title="Restart"
          disabled={currentCommandIndex === 0}
        >
          <RotateCcw size={14} />
        </button>

        {/* Play/Pause */}
        {isPlaying && !isPaused ? (
          <button className={styles.controlBtn} onClick={onPause} title="Pause">
            <Pause size={14} />
          </button>
        ) : (
          <button
            className={styles.controlBtn}
            onClick={onPlay}
            title="Play"
            disabled={isFinished}
          >
            <Play size={14} />
          </button>
        )}

        {/* Skip to end */}
        <button
          className={styles.controlBtn}
          onClick={onSkip}
          title="Skip to end"
          disabled={isFinished}
        >
          <FastForward size={14} />
        </button>

        {/* Speed selector */}
        <select
          className={styles.speedSelect}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>

        {/* Command counter */}
        <span className={styles.counter}>
          {currentCommandIndex} / {totalCommands}
        </span>
      </div>
    </div>
  );
}
