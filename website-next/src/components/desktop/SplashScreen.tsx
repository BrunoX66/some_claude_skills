"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Palette ──────────────────────────────────────────────────────────────── */

const BG      = "#272727";   // dark terminal grey — the whole screen
const ANSI    = "#39ff14";   // neon terminal green — all borders
const DIM     = "#1a5c08";   // dim green — secondary text
const TEXT_HI = "#ccffcc";   // near-white with green tint — important text
const TEXT_LO = "#4d8840";   // muted green — dim text

/* ── BBS boot lines ───────────────────────────────────────────────────────── */

const BBS_LINES = [
  "SKILLSYS v3.1 (c) 1993 Curiositech Corporation",
  "Loading ANTHROPIC.DRV...........................OK",
  "Initializing CLAUDE.EXE v4.6.0..................OK",
  "Mounting SKILLS.VHD (192 entries)...............OK",
  "Loading WIN31.SYS...............................OK",
  "AGENT COUNCIL: 9 founding agents detected.......OK",
  "BUNDLE.EXE: 14 bundles found....................OK",
  "MCP gateway: 10 servers connected...............OK",
  "FAVORITES.DAT: initializing localStorage.......OK",
  "DESKTOP.SYS: starting Program Manager..........OK",
  "",
  "C:\\SKILLS> dir /p",
  "Volume in drive C is SOMECLAUDESKILLS",
  "Volume Serial Number is 1993-4C4C",
  "",
  " Directory of C:\\SKILLS",
  "",
  "AI           <DIR>    06-15-93   9:43a",
  "DESIGN       <DIR>    06-15-93   9:43a",
  "DEVOPS       <DIR>    06-15-93   9:43a",
  "CODE         <DIR>    06-15-93   9:43a",
  "LIFESTYLE    <DIR>    06-15-93   9:43a",
  "PRODUCTIVITY <DIR>    06-15-93   9:43a",
  "             192 File(s)    3,141,592 bytes",
  "",
  "C:\\SKILLS> win31 /skills /beauty /cyberspace",
  "Starting Windows 3.1 Skills Manager...",
  "Loading desktop wallpaper...",
  "Rendering folder icons...",
  "Ready.",
];

/* ── ANSI box utility ─────────────────────────────────────────────────────── */

/**
 * Renders a box with a CSS border for straight lines plus actual Unicode
 * box-drawing characters at the four corners (same background colour so
 * they blend with the border).  Accepts single (┌┐└┘) or double (╔╗╚╝)
 * line style.
 */
function AnsiBox({
  children,
  double = false,
  style,
  className,
}: {
  children: React.ReactNode;
  double?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const c = double
    ? { tl: "╔", tr: "╗", bl: "╚", br: "╝" }
    : { tl: "┌", tr: "┐", bl: "└", br: "┘" };

  // Corner spans cover the CSS-border corner so the char appears to BE the corner.
  const corner = (char: string, pos: React.CSSProperties): React.ReactNode => (
    <span
      aria-hidden="true"
      style={{
        position:   "absolute",
        background: BG,
        color:      ANSI,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize:   "13px",
        lineHeight: "13px",
        width:      "9px",
        display:    "inline-block",
        textAlign:  "center",
        zIndex:     2,
        userSelect: "none",
        ...pos,
      }}
    >
      {char}
    </span>
  );

  return (
    <div
      className={className}
      style={{
        position: "relative",
        border:   `1px solid ${ANSI}`,
        ...style,
      }}
    >
      {corner(c.tl, { top: "-1px",  left:  "-1px" })}
      {corner(c.tr, { top: "-1px",  right: "-1px" })}
      {corner(c.bl, { bottom: "-1px", left: "-1px" })}
      {corner(c.br, { bottom: "-1px", right: "-1px" })}
      {children}
    </div>
  );
}

/* ── Horizontal separator (full-width line inside an AnsiBox) ─────────────── */

function AnsiSep() {
  return (
    <div
      aria-hidden="true"
      style={{
        height:      "1px",
        background:  ANSI,
        marginLeft:  "-1px",   // bleed into the parent box border
        marginRight: "-1px",
      }}
    />
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */

interface SplashScreenProps {
  onDismiss: () => void;
}

export function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [isDismissing, setIsDismissing] = useState(false);
  const [scrollY,      setScrollY]      = useState(0);
  const [hasTouch,     setHasTouch]     = useState(false);
  const animRef    = useRef<number | null>(null);
  const startRef   = useRef<number | null>(null);
  const dismissed  = useRef(false);

  // Detect touch device via pointer:coarse media query
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  /* ── Scrolling boot text ─────────────────────────────────────────────────── */

  const LINE_H       = 15;   // px per line
  const SPEED        = 0.035; // lines per ms
  const totalPx      = BBS_LINES.length * LINE_H;

  useEffect(() => {
    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const py = ((ts - startRef.current) * SPEED * LINE_H) % totalPx;
      setScrollY(py);
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current !== null) cancelAnimationFrame(animRef.current); };
  }, [totalPx]);

  /* ── Dismiss ─────────────────────────────────────────────────────────────── */

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    setIsDismissing(true);
    setTimeout(onDismiss, 650);
  }, [onDismiss]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      dismiss();
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  /* ── Font shorthand ──────────────────────────────────────────────────────── */

  const mono: React.CSSProperties = {
    fontFamily: "'Courier New', Courier, monospace",
  };

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Some Claude Skills — Splash Screen"
      onClick={dismiss}
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     9999,
        background: BG,
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor:     "pointer",
        userSelect: "none",
        touchAction: "manipulation",
        opacity:    isDismissing ? 0 : 1,
        transition: "opacity 650ms ease",
      }}
    >
      {/* ── Outer ANSI frame — centered dialog, ~half viewport ── */}
      <AnsiBox
        double
        style={{
          width:    "min(640px, 90vw)",
          height:   "min(440px, 65vh)",
          display:  "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header: CLICK ANYWHERE ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            ...mono,
            color:      ANSI,
            textAlign:  "center",
            padding:    "10px 16px",
            fontSize:   "13px",
            letterSpacing: "0.12em",
          }}>
            ═══[ <span style={{ color: TEXT_HI, fontWeight: "bold" }}>{hasTouch ? "TAP ANYWHERE TO CONTINUE" : "CLICK ANYWHERE TO CONTINUE"}</span> ]═══
          </div>
          <AnsiSep />
        </div>

        {/* ── Content ── */}
        <div style={{
          flex:          1,
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
          padding:       "12px 16px",
          gap:           "10px",
        }}>
          {/* ── Splash image — no border, touches edges ── */}
          <div style={{ flexShrink: 0, maxHeight: "35%", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/splash_art.webp"
              alt="Some Claude Skills"
              draggable={false}
              style={{ display: "block", width: "100%", objectFit: "contain" }}
            />
          </div>

          {/* ── Boot text — grows to fill remaining height ── */}
          <AnsiBox style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
            <div style={{ height: "100%", overflow: "hidden", position: "relative", background: BG }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: `-${scrollY}px`, padding: "6px 12px" }}>
                {[...BBS_LINES, ...BBS_LINES].map((line, i) => {
                  let color = TEXT_LO;
                  if (line.includes("...OK") || line.startsWith("Ready"))              color = ANSI;
                  else if (line.startsWith("C:\\"))                                     color = TEXT_HI;
                  else if (line.startsWith("Volume") || line.startsWith(" Directory")) color = DIM;
                  else if (line.includes("<DIR>"))                                      color = TEXT_LO;
                  else if (line.startsWith("SKILLSYS"))                                color = TEXT_HI;

                  return (
                    <div
                      key={i}
                      aria-hidden="true"
                      style={{ ...mono, color, fontSize: "11px", lineHeight: `${LINE_H}px`, whiteSpace: "pre" }}
                    >
                      {line || " "}
                    </div>
                  );
                })}
              </div>

              <div style={{ position: "absolute", inset: "0 0 auto", height: "20px", background: `linear-gradient(to bottom, ${BG}, transparent)`, pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: "auto 0 0", height: "20px", background: `linear-gradient(to top, ${BG}, transparent)`, pointerEvents: "none" }} />
            </div>
          </AnsiBox>

          {/* ── Copyright ── */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <p style={{ ...mono, color: TEXT_HI, fontSize: "12px", fontWeight: "bold", letterSpacing: "0.05em", margin: 0 }}>
              Over 200 Free and Fun Skills, Right Here in Cyberspace
            </p>
            <p style={{ ...mono, color: TEXT_LO, fontSize: "10px", marginTop: "4px", marginBottom: 0 }}>
              Site by Curiositech&nbsp;&nbsp;·&nbsp;&nbsp;Claude &amp; all works by Anthropic&nbsp;&nbsp;·&nbsp;&nbsp;Not affiliated with Anthropic
            </p>
          </div>
        </div>

        {/* ── Footer: PRESS ANY KEY ── */}
        <div style={{ flexShrink: 0 }}>
          <AnsiSep />
          <div style={{
            ...mono,
            color:       ANSI,
            textAlign:   "center",
            padding:     "10px 16px",
            fontSize:    "13px",
            letterSpacing: "0.12em",
          }}>
            ░░░[{" "}
            <span
              style={{
                color:     TEXT_HI,
                fontWeight: "bold",
                animation: "splashBlink 1.1s step-end infinite",
              }}
            >
              {hasTouch ? "TAP ANYWHERE" : "PRESS ANY KEY"}
            </span>
            {" "}]░░░
          </div>
        </div>
      </AnsiBox>

      {/* Blink keyframe injected inline — avoids needing a global CSS file edit */}
      <style>{`
        @keyframes splashBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
