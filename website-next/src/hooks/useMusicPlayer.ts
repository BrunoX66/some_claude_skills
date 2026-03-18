"use client";

import { useEffect, useRef, useState } from "react";
import { MUSIC_LIBRARY, type TrackMetadata } from "@/data/musicMetadata";

// Dynamic imports to avoid SSR issues
let MidiPlayerLib: any = null;
let SoundfontLib: any = null;

interface EQSettings {
  bass: number;   // -12 to +12 dB
  mid: number;
  treble: number;
}

const DEFAULT_EQ: EQSettings = { bass: 0, mid: 0, treble: 0 };

export interface MusicPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: TrackMetadata | null;
  currentTrackIndex: number;
  volume: number;
  progress: number;
  eqSettings: EQSettings;
  analyserNode: AnalyserNode | null;
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  totalTracks: number;

  togglePlayPause: () => void;
  setVolume: (v: number) => void;
  setEQ: (band: "bass" | "mid" | "treble", value: number) => void;
  resetEQ: () => void;
  switchTrack: (index: number) => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  seekToPercent: (pct: number) => void;
}

/**
 * useMusicPlayer — self-contained audio engine for WinampWindow.
 * Plays MIDI (via midi-player-js + soundfont-player) and MP3.
 * Audio chain: Source → Gain → EQ (3 bands) → Compressor → Analyser → Output
 */
export function useMusicPlayer(): MusicPlayerState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [eqSettings, setEqSettings] = useState<EQSettings>(DEFAULT_EQ);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [audioContextState, setAudioContextState] = useState<AudioContext | null>(null);
  const [gainNodeState, setGainNodeState] = useState<GainNode | null>(null);

  // Refs — avoid stale closures in callbacks
  const isPlayingRef = useRef(false);
  const isMP3TrackRef = useRef(false);
  const currentTrackIndexRef = useRef(0);

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const eqNodesRef = useRef<{ bass: BiquadFilterNode | null; mid: BiquadFilterNode | null; treble: BiquadFilterNode | null }>({ bass: null, mid: null, treble: null });
  const analyserRef = useRef<AnalyserNode | null>(null);
  const playerRef = useRef<any>(null); // midi-player-js Player
  const instrumentsRef = useRef<Map<number, any>>(new Map());
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const progressRafRef = useRef<number | null>(null);

  // Keep refs in sync
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { currentTrackIndexRef.current = currentTrackIndex; }, [currentTrackIndex]);

  /* ── Audio chain init ─────────────────────────────────────────────── */

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Dynamic imports for SSR safety
        if (!MidiPlayerLib) {
          const m = await import("midi-player-js");
          MidiPlayerLib = m.default || m;
        }
        if (!SoundfontLib) {
          const s = await import("soundfont-player");
          SoundfontLib = s.default || s;
        }

        if (!mounted) return;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        setAudioContextState(audioCtx);

        // Gain
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(Math.pow(0.7, 2), audioCtx.currentTime);
        gainNodeRef.current = gain;
        setGainNodeState(gain);

        // EQ filters
        const bass = audioCtx.createBiquadFilter();
        bass.type = "lowshelf";
        bass.frequency.setValueAtTime(200, audioCtx.currentTime);
        eqNodesRef.current.bass = bass;

        const mid = audioCtx.createBiquadFilter();
        mid.type = "peaking";
        mid.frequency.setValueAtTime(1000, audioCtx.currentTime);
        mid.Q.setValueAtTime(1, audioCtx.currentTime);
        eqNodesRef.current.mid = mid;

        const treble = audioCtx.createBiquadFilter();
        treble.type = "highshelf";
        treble.frequency.setValueAtTime(3000, audioCtx.currentTime);
        eqNodesRef.current.treble = treble;

        // Compressor
        const comp = audioCtx.createDynamicsCompressor();
        comp.threshold.setValueAtTime(-24, audioCtx.currentTime);
        comp.knee.setValueAtTime(30, audioCtx.currentTime);
        comp.ratio.setValueAtTime(12, audioCtx.currentTime);
        comp.attack.setValueAtTime(0.003, audioCtx.currentTime);
        comp.release.setValueAtTime(0.25, audioCtx.currentTime);

        // Analyser
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
        setAnalyserNode(analyser);

        // Chain: gain → bass → mid → treble → comp → analyser → out
        gain.connect(bass);
        bass.connect(mid);
        mid.connect(treble);
        treble.connect(comp);
        comp.connect(analyser);
        analyser.connect(audioCtx.destination);

        // MIDI player
        const player = new MidiPlayerLib.Player((event: any) => {
          if (event.name === "Note on" && event.velocity > 0) {
            playNote(event.noteNumber, event.velocity, event.track);
          }
        });

        player.on("endOfFile", () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setProgress(0);
          const next = (currentTrackIndexRef.current + 1) % MUSIC_LIBRARY.length;
          setCurrentTrackIndex(next);
          currentTrackIndexRef.current = next;
        });

        playerRef.current = player;

        await loadTrack(0);
        if (mounted) setIsLoading(false);
      } catch (err) {
        console.error("[useMusicPlayer] init failed:", err);
        if (mounted) setIsLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      if (playerRef.current) { try { playerRef.current.stop(); } catch {} }
      if (audioElementRef.current) { audioElementRef.current.pause(); audioElementRef.current.src = ""; }
      if (audioContextRef.current) { try { audioContextRef.current.close(); } catch {} }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Instrument loading ───────────────────────────────────────────── */

  const INSTRUMENT_NAMES = [
    "acoustic_grand_piano", "bright_acoustic_piano", "electric_grand_piano",
    "honkytonk_piano", "electric_piano_1", "electric_piano_2", "harpsichord",
    "clavinet", "celesta", "glockenspiel", "music_box", "vibraphone",
    "marimba", "xylophone", "tubular_bells", "dulcimer", "drawbar_organ",
  ];

  const loadInstrument = async (program: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    if (instrumentsRef.current.has(program)) return;
    try {
      const name = INSTRUMENT_NAMES[program % INSTRUMENT_NAMES.length] || "acoustic_grand_piano";
      const instr = await SoundfontLib.instrument(audioContextRef.current, name, {
        gain: 1,
        destination: gainNodeRef.current,
      });
      instrumentsRef.current.set(program, instr);
    } catch {}
  };

  const playNote = async (note: number, velocity: number, track: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    const programMap: Record<number, number> = { 0: 0, 1: 0, 2: 33, 3: 0 };
    const program = programMap[track] ?? 0;
    if (!instrumentsRef.current.has(program)) await loadInstrument(program);
    const instr = instrumentsRef.current.get(program);
    if (!instr) return;
    const noteNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const octave = Math.floor(note / 12) - 1;
    const fullNote = `${noteNames[note % 12]}${octave}`;
    try {
      instr.play(fullNote, audioContextRef.current.currentTime, {
        gain: velocity / 127,
        duration: 0.5,
      });
    } catch {}
  };

  /* ── Track loading ────────────────────────────────────────────────── */

  const loadTrack = async (idx: number) => {
    if (!audioContextRef.current) return;
    const track = MUSIC_LIBRARY[idx];
    const isMP3 = /\.(mp3|wav|ogg)$/i.test(track.file);
    isMP3TrackRef.current = isMP3;
    setProgress(0);

    // Stop existing
    if (audioElementRef.current) { audioElementRef.current.pause(); audioElementRef.current.src = ""; }
    if (playerRef.current) { try { playerRef.current.stop(); } catch {} }

    if (isMP3) {
      if (!audioElementRef.current) {
        const el = new Audio();
        el.crossOrigin = "anonymous";
        audioElementRef.current = el;
      }
      audioElementRef.current.src = track.file;
      audioElementRef.current.load();

      if (!audioSourceNodeRef.current && gainNodeRef.current) {
        audioSourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElementRef.current);
        audioSourceNodeRef.current.connect(gainNodeRef.current);
      }

      audioElementRef.current.onended = () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setProgress(0);
        const next = (currentTrackIndexRef.current + 1) % MUSIC_LIBRARY.length;
        setCurrentTrackIndex(next);
        currentTrackIndexRef.current = next;
      };
    } else {
      if (!playerRef.current) return;
      const res = await fetch(track.file);
      const buf = await res.arrayBuffer();
      playerRef.current.loadArrayBuffer(new Uint8Array(buf));
      await loadInstrument(0);
      await loadInstrument(33);
    }
  };

  /* ── Playback controls ────────────────────────────────────────────── */

  const play = async () => {
    if (!audioContextRef.current) return;
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (isMP3TrackRef.current && audioElementRef.current) {
      try {
        await audioElementRef.current.play();
        setIsPlaying(true);
        isPlayingRef.current = true;
        const tick = () => {
          if (audioElementRef.current && !audioElementRef.current.paused) {
            const pct = (audioElementRef.current.currentTime / (audioElementRef.current.duration || 1)) * 100;
            setProgress(pct);
            progressRafRef.current = requestAnimationFrame(tick);
          }
        };
        progressRafRef.current = requestAnimationFrame(tick);
      } catch {}
    } else if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
      isPlayingRef.current = true;
      const tick = () => {
        if (playerRef.current && isPlayingRef.current) {
          const remaining = playerRef.current.getSongPercentRemaining() ?? 0;
          setProgress(100 - remaining);
          progressRafRef.current = requestAnimationFrame(tick);
        }
      };
      progressRafRef.current = requestAnimationFrame(tick);
    }
  };

  const pause = () => {
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    if (isMP3TrackRef.current && audioElementRef.current) {
      audioElementRef.current.pause();
    } else if (playerRef.current) {
      try { playerRef.current.pause(); } catch {}
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  };

  const togglePlayPause = () => { isPlayingRef.current ? pause() : play(); };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        Math.pow(clamped, 2),
        audioContextRef.current.currentTime,
        0.02
      );
    }
  };

  const setEQ = (band: "bass" | "mid" | "treble", value: number) => {
    const clamped = Math.max(-12, Math.min(12, value));
    const node = eqNodesRef.current[band];
    if (node && audioContextRef.current) {
      node.gain.setTargetAtTime(clamped, audioContextRef.current.currentTime, 0.02);
    }
    setEqSettings((prev) => ({ ...prev, [band]: clamped }));
  };

  const resetEQ = () => { setEQ("bass", 0); setEQ("mid", 0); setEQ("treble", 0); };

  const seekToPercent = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    if (isMP3TrackRef.current && audioElementRef.current) {
      const dur = audioElementRef.current.duration || 0;
      if (dur > 0) audioElementRef.current.currentTime = (clamped / 100) * dur;
    } else if (playerRef.current) {
      try { playerRef.current.skipToPercent(clamped); } catch {}
    }
    setProgress(clamped);
  };

  const switchTrack = async (idx: number) => {
    const wasPlaying = isPlayingRef.current;
    if (wasPlaying) pause();
    setCurrentTrackIndex(idx);
    currentTrackIndexRef.current = idx;
    await loadTrack(idx);
    if (wasPlaying) setTimeout(() => play(), 100);
  };

  const nextTrack = () => {
    switchTrack((currentTrackIndexRef.current + 1) % MUSIC_LIBRARY.length);
  };
  const previousTrack = () => {
    switchTrack((currentTrackIndexRef.current - 1 + MUSIC_LIBRARY.length) % MUSIC_LIBRARY.length);
  };

  return {
    isPlaying,
    isLoading,
    currentTrack: MUSIC_LIBRARY[currentTrackIndex] || null,
    currentTrackIndex,
    volume,
    progress,
    eqSettings,
    analyserNode,
    audioContext: audioContextState,
    gainNode: gainNodeState,
    totalTracks: MUSIC_LIBRARY.length,
    togglePlayPause,
    setVolume,
    setEQ,
    resetEQ,
    switchTrack,
    nextTrack,
    previousTrack,
    seekToPercent,
  };
}
