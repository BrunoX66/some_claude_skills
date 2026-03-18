"use client";

import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useFFTData } from "@/hooks/useFFTData";
import { MUSIC_LIBRARY } from "@/data/musicMetadata";
import { cn } from "@/lib/utils";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const BAR_COUNT = 20;

/* ── Sub-components ──────────────────────────────────────────────────────── */

function CtrlBtn({
  label,
  onClick,
  disabled,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex items-center justify-center",
        "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
        "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
        "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
        "font-[family-name:var(--font-system)] text-[9px] font-bold",
        "select-none cursor-pointer active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
        "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
    >
      {label}
    </button>
  );
}

/* ── WinampWindow ────────────────────────────────────────────────────────── */

/**
 * WinampWindow — music player inside the MEDIA program group.
 * Self-contained: manages all audio state via useMusicPlayer hook.
 * Win31 styled: dark LCD display, green FFT bars, 3-band EQ.
 */
export function WinampWindow() {
  const {
    isPlaying,
    isLoading,
    currentTrack,
    currentTrackIndex,
    volume,
    progress,
    eqSettings,
    analyserNode,
    togglePlayPause,
    setVolume,
    setEQ,
    resetEQ,
    switchTrack,
    nextTrack,
    previousTrack,
    seekToPercent,
  } = useMusicPlayer();

  const frequencyData = useFFTData({ analyserNode, binCount: BAR_COUNT, smoothing: 0.7, isPlaying });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1a1a1a]">
        <span
          className="text-[10px] font-[family-name:var(--font-code)]"
          style={{ color: "#00ff41" }}
        >
          LOADING...
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] overflow-hidden">
      {/* ── LCD display ── */}
      <div
        className="shrink-0 p-2 text-center"
        style={{ background: "#0d0d0d", borderBottom: "1px solid #333" }}
      >
        <div
          className="font-[family-name:var(--font-code)] text-[10px] leading-tight"
          style={{ color: "#00ff41" }}
        >
          {currentTrack
            ? `${String(currentTrackIndex + 1).padStart(2, "0")}. ${currentTrack.title} — ${currentTrack.artist}`
            : "NO TRACK"}
        </div>
        <div
          className="font-[family-name:var(--font-code)] text-[9px] mt-0.5"
          style={{ color: "#00aa2a" }}
        >
          {currentTrack ? `${currentTrack.album} · ${currentTrack.year} · ${currentTrack.genre}` : ""}
        </div>
      </div>

      {/* ── FFT visualizer ── */}
      <div
        className="shrink-0 flex items-end gap-px px-2 py-1"
        style={{ height: 52, background: "#0d0d0d", borderBottom: "1px solid #333" }}
      >
        {frequencyData.map((mag, i) => {
          const h = Math.max(2, (mag / 255) * 44);
          const hue = 120 - (i / BAR_COUNT) * 60; // green → yellow
          return (
            <div
              key={i}
              className="flex-1 rounded-[1px]"
              style={{
                height: `${h}px`,
                background: `hsl(${hue}, 100%, 45%)`,
                transition: "height 40ms ease-out",
              }}
            />
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div
        className="shrink-0 cursor-pointer"
        style={{ height: 8, background: "#111", borderBottom: "1px solid #333" }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekToPercent(((e.clientX - rect.left) / rect.width) * 100);
        }}
        title="Click to seek"
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "#00ff41",
            transition: "width 100ms linear",
          }}
        />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── Left: transport + volume + EQ ── */}
        <div
          className="shrink-0 flex flex-col gap-2 p-2"
          style={{ width: 160, borderRight: "1px solid #333" }}
        >
          {/* Transport buttons */}
          <div className="flex gap-1">
            <CtrlBtn label="◄◄" onClick={previousTrack} disabled={isLoading} className="flex-1 py-1.5" />
            <CtrlBtn
              label={isPlaying ? "❚❚" : "▶"}
              onClick={togglePlayPause}
              disabled={isLoading}
              className="flex-1 py-1.5"
            />
            <CtrlBtn label="▶▶" onClick={nextTrack} disabled={isLoading} className="flex-1 py-1.5" />
          </div>

          {/* Album art placeholder */}
          {currentTrack && (
            <div
              className="w-full overflow-hidden"
              style={{
                height: 80,
                border: "1px solid #444",
                background: "#0a0a0a",
              }}
            >
              <img
                src={currentTrack.coverArt}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Volume */}
          <div className="flex items-center gap-1">
            <span
              className="font-[family-name:var(--font-code)] text-[9px] w-8 shrink-0"
              style={{ color: "#00aa2a" }}
            >
              VOL
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-[#00ff41]"
              style={{ height: 12 }}
            />
            <span
              className="font-[family-name:var(--font-code)] text-[9px] w-7 text-right shrink-0"
              style={{ color: "#00ff41" }}
            >
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* EQ */}
          <div
            className="p-1.5 space-y-1.5"
            style={{ border: "1px inset #555", background: "#111" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-[family-name:var(--font-code)] text-[8px] font-bold"
                style={{ color: "#00aa2a" }}
              >
                ▓ EQUALIZER
              </span>
              <button
                onClick={resetEQ}
                className="font-[family-name:var(--font-code)] text-[7px] px-1"
                style={{ color: "#00ff41", background: "none", border: "none", cursor: "pointer" }}
              >
                RESET
              </button>
            </div>
            {(["bass", "mid", "treble"] as const).map((band) => (
              <div key={band} className="flex items-center gap-1">
                <span
                  className="font-[family-name:var(--font-code)] text-[7px] w-9 shrink-0 uppercase"
                  style={{ color: "#00aa2a" }}
                >
                  {band}
                </span>
                <input
                  type="range"
                  min={-12}
                  max={12}
                  step={1}
                  value={eqSettings[band]}
                  onChange={(e) => setEQ(band, parseInt(e.target.value))}
                  className="flex-1 accent-[#00ff41]"
                  style={{ height: 10 }}
                />
                <span
                  className="font-[family-name:var(--font-code)] text-[7px] w-8 text-right shrink-0"
                  style={{ color: "#00ff41" }}
                >
                  {eqSettings[band] > 0 ? `+${eqSettings[band]}` : eqSettings[band]}dB
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: playlist ── */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div
            className="shrink-0 px-2 py-1 font-[family-name:var(--font-code)] text-[9px] font-bold"
            style={{ color: "#00aa2a", background: "#111", borderBottom: "1px solid #333" }}
          >
            PLAYLIST — {MUSIC_LIBRARY.length} TRACKS
          </div>
          <div className="flex-1 overflow-y-auto" style={{ background: "#0d0d0d" }}>
            {MUSIC_LIBRARY.map((track, idx) => {
              const active = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => switchTrack(idx)}
                  className="w-full flex items-center gap-1 px-2 py-0.5 text-left"
                  style={{
                    background: active ? "#002200" : "transparent",
                    borderBottom: "1px solid #1a1a1a",
                  }}
                >
                  <span
                    className="font-[family-name:var(--font-code)] text-[9px] shrink-0 w-5"
                    style={{ color: active ? "#00ff41" : "#556655" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-[family-name:var(--font-code)] text-[9px] flex-1 truncate text-left"
                    style={{ color: active ? "#00ff41" : "#778877" }}
                  >
                    {track.title}
                  </span>
                  <span
                    className="font-[family-name:var(--font-code)] text-[8px] shrink-0"
                    style={{ color: active ? "#00aa2a" : "#445544" }}
                  >
                    {track.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
