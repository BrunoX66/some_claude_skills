'use client';

import React, { useState } from 'react';
import styles from './ReferencePanel.module.css';

export interface ReferenceImageData {
  url: string;
  query: string;
  photographer?: string;
  photographerUrl?: string;
}

interface ReferencePanelProps {
  referenceImages: ReferenceImageData[];
}

export function ReferencePanel({ referenceImages }: ReferencePanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (referenceImages.length === 0) return null;

  return (
    <div className={styles.referencePanel}>
      <div className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <h3>Reference Images</h3>
        <button
          className={styles.collapseButton}
          onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); }}
        >
          {collapsed ? '+' : '\u2013'}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.content}>
          <div className={styles.searchQuery}>
            <strong>Search:</strong> &ldquo;{referenceImages[0]?.query}&rdquo;
          </div>

          <div className={styles.thumbnailGrid}>
            {referenceImages.map((img, i) => (
              <div key={i} className={styles.thumbnailWrapper}>
                <img
                  src={img.url}
                  alt={`Reference: ${img.query}`}
                  className={styles.thumbnailImage}
                  loading="lazy"
                />
                {img.photographer && (
                  <div className={styles.attribution}>
                    {img.photographerUrl ? (
                      <a href={img.photographerUrl} target="_blank" rel="noopener noreferrer">
                        {img.photographer}
                      </a>
                    ) : (
                      img.photographer
                    )}{' '}
                    / Pexels
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
