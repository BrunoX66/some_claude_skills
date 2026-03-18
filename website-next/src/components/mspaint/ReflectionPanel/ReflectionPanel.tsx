'use client';

import React, { useState } from 'react';
import styles from './ReflectionPanel.module.css';

interface ReflectionData {
  assessment?: {
    overallScore?: number;
    whatWorkedWell?: string[];
    whatDidntWork?: string[];
    technicalIssues?: string[];
  };
  reflection?: {
    wishIKnew?: string;
    wouldMakeEasier?: string;
    doOverDifferently?: string;
  };
  suggestions?: {
    forNextTime?: string[];
    toolsNeeded?: string[];
    promptAdvice?: string;
  };
}

interface AestheticData {
  overallScore: number;
  reasoning?: string[];
  rawScores?: number[];
  model?: string;
  latencyMs?: number;
}

interface ReflectionPanelProps {
  reflection: ReflectionData | null;
  aestheticAssessment?: AestheticData | null;
  isReflecting: boolean;
  savedPaths?: { log?: string; image?: string; gif?: string; frameCount?: number } | null;
  onSave?: () => void;
  onClear?: () => void;
}

/**
 * Maps a 1–5 score to a Windows 3.1 VGA-inspired color,
 * interpolated through OKLCH to avoid the muddy brown
 * midpoint you'd get in sRGB.
 */
function getScoreColor(score: number): string {
  // Win 3.1 VGA palette anchors in OKLCH (approximate)
  // Green: #00FF00 → oklch(0.8664 0.2948 142.5)
  // Yellow: #FFFF00 → oklch(0.9680 0.2119 109.8)
  // Red:   #FF0000 → oklch(0.6279 0.2577 29.2)
  const stops = [
    { t: 1, L: 0.6279, C: 0.2577, H: 29.2 },  // VGA red   (worst)
    { t: 3, L: 0.9680, C: 0.2119, H: 109.8 }, // VGA yellow (average)
    { t: 5, L: 0.8664, C: 0.2948, H: 142.5 }, // VGA green  (best)
  ];

  const clamped = Math.max(1, Math.min(5, score));

  // Find which segment we're in
  let a = stops[0], b = stops[1];
  if (clamped >= 3) {
    a = stops[1];
    b = stops[2];
  }

  const t = (clamped - a.t) / (b.t - a.t);

  const L = a.L + t * (b.L - a.L);
  const C = a.C + t * (b.C - a.C);
  const H = a.H + t * (b.H - a.H);

  return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)})`;
}

export function ReflectionPanel({
  reflection,
  aestheticAssessment,
  isReflecting,
  savedPaths,
  onSave,
  onClear,
}: ReflectionPanelProps) {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

  // Don't render if no reflection and not loading
  if (!reflection && !isReflecting) {
    return null;
  }

  return (
    <div className={styles.reflectionPanel}>
      <div className={styles.header}>
        <h3>Self-Assessment</h3>
        {reflection?.assessment?.overallScore && (
          <span className={styles.score}>{reflection.assessment.overallScore}/10</span>
        )}
      </div>

      {/* Loading state */}
      {isReflecting && (
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>🤔</div>
          <div className={styles.loadingText}>Claude is reflecting on the drawing...</div>
        </div>
      )}

      {/* Aesthetic Assessment from VisualQuality-R1 */}
      {aestheticAssessment && !isReflecting && (
        <div className={styles.content}>
          <div className={styles.aestheticSection}>
            <div className={styles.aestheticHeader}>
              <span>🎨 Aesthetic Quality</span>
              <span className={styles.aestheticModel}>
                {aestheticAssessment.model || 'VQ-R1'} · {aestheticAssessment.latencyMs ? `${(aestheticAssessment.latencyMs / 1000).toFixed(1)}s` : ''}
              </span>
            </div>

            {/* Overall score - big display */}
            <div className={styles.overallScore}>
              <div
                className={styles.overallScoreValue}
                style={{ color: getScoreColor(aestheticAssessment.overallScore) }}
              >
                {aestheticAssessment.overallScore.toFixed(2)}
              </div>
              <div className={styles.overallScoreLabel}>/ 5.00</div>
            </div>

            {/* Overall score bar */}
            <div className={styles.scoreBar}>
              <span className={styles.scoreLabel}>Overall</span>
              <div className={styles.scoreTrack}>
                <div
                  className={styles.scoreFill}
                  style={{
                    width: `${(aestheticAssessment.overallScore / 5) * 100}%`,
                    backgroundColor: getScoreColor(aestheticAssessment.overallScore),
                  }}
                />
              </div>
              <span className={styles.scoreValue}>{aestheticAssessment.overallScore.toFixed(1)}</span>
            </div>

            {/* K-sample individual scores */}
            {aestheticAssessment.rawScores && aestheticAssessment.rawScores.length > 1 && (
              <div className={styles.kScores}>
                <div className={styles.kScoresLabel}>
                  K={aestheticAssessment.rawScores.length} samples:
                </div>
                <div className={styles.kScoresValues}>
                  {aestheticAssessment.rawScores.map((score, i) => (
                    <span
                      key={i}
                      className={styles.kScore}
                      style={{ color: getScoreColor(score) }}
                    >
                      {score.toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reasoning toggle */}
            {aestheticAssessment.reasoning && aestheticAssessment.reasoning.length > 0 && (
              <div className={styles.reasoningSection}>
                <button
                  className={styles.reasoningToggle}
                  onClick={() => setReasoningExpanded(!reasoningExpanded)}
                >
                  {reasoningExpanded ? '▼' : '▶'} VQ-R1 Reasoning ({aestheticAssessment.reasoning.length} sample{aestheticAssessment.reasoning.length > 1 ? 's' : ''})
                </button>
                {reasoningExpanded && (
                  <div className={styles.reasoningContent}>
                    {aestheticAssessment.reasoning.map((text, i) => (
                      <div key={i} className={styles.reasoningSample}>
                        <div className={styles.reasoningSampleHeader}>Sample {i + 1}</div>
                        <div className={styles.reasoningText}>{text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reflection content */}
      {reflection && !isReflecting && (
        <div className={styles.content}>
          {/* What worked well */}
          {reflection.assessment?.whatWorkedWell && reflection.assessment.whatWorkedWell.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>✅ What worked well</div>
              <ul className={styles.list}>
                {reflection.assessment.whatWorkedWell.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* What didn't work */}
          {reflection.assessment?.whatDidntWork && reflection.assessment.whatDidntWork.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>❌ What didn&apos;t work</div>
              <ul className={styles.list}>
                {reflection.assessment.whatDidntWork.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical issues */}
          {reflection.assessment?.technicalIssues && reflection.assessment.technicalIssues.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>⚙️ Technical issues</div>
              <ul className={styles.list}>
                {reflection.assessment.technicalIssues.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Wish I knew */}
          {reflection.reflection?.wishIKnew && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>💡 Wish I knew</div>
              <p className={styles.text}>{reflection.reflection.wishIKnew}</p>
            </div>
          )}

          {/* Would do differently */}
          {reflection.reflection?.doOverDifferently && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>🔄 Would do differently</div>
              <p className={styles.text}>{reflection.reflection.doOverDifferently}</p>
            </div>
          )}

          {/* Would make easier */}
          {reflection.reflection?.wouldMakeEasier && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>🛠️ Would make easier</div>
              <p className={styles.text}>{reflection.reflection.wouldMakeEasier}</p>
            </div>
          )}

          {/* For next time */}
          {reflection.suggestions?.forNextTime && reflection.suggestions.forNextTime.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>📝 For next time</div>
              <ul className={styles.list}>
                {reflection.suggestions.forNextTime.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tools needed */}
          {reflection.suggestions?.toolsNeeded && reflection.suggestions.toolsNeeded.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>🔧 Tools needed</div>
              <ul className={styles.list}>
                {reflection.suggestions.toolsNeeded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Saved paths */}
      {savedPaths && (
        <div className={styles.savedSection}>
          <div className={styles.savedHeader}>📁 Session saved</div>
          {savedPaths.frameCount && savedPaths.frameCount > 0 && (
            <div className={styles.savedItem}>{savedPaths.frameCount} frames captured</div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        {onSave && (
          <button className={styles.actionButton} onClick={onSave}>
            💾 Save PNG
          </button>
        )}
        {onClear && (
          <button className={styles.actionButton} onClick={onClear}>
            🗑️ Clear & New
          </button>
        )}
      </div>
    </div>
  );
}
