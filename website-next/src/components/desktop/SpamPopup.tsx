"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface SpamPopupProps {
  title: string;
  titleColor: string;
  headline: string;
  cta: string;
  animationDelay?: number;
  onClose: () => void;
  style?: React.CSSProperties;
}

/**
 * SpamPopup — individual 2000s-era spam popup window.
 * Uses pure CSS pop-explode animation. Not a Win31Window — simpler raw div.
 */
export function SpamPopup({
  title,
  titleColor,
  headline,
  cta,
  animationDelay = 0,
  onClose,
  style,
}: SpamPopupProps) {
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  return (
    <>
      <style>{`
        @keyframes popExplode {
          0%   { transform: scale(0.15) rotate(-8deg); opacity: 0; }
          60%  { transform: scale(1.08) rotate(1deg); opacity: 1; }
          80%  { transform: scale(0.97) rotate(-0.5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes popClose {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.1) rotate(10deg); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed z-[9999] select-none"
        style={{
          ...style,
          animation: closing
            ? "popClose 0.25s ease-in forwards"
            : `popExplode 0.35s cubic-bezier(0.22,1,0.36,1) ${animationDelay}ms both`,
        }}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Window chrome */}
        <div
          className="flex flex-col"
          style={{
            border: "2px solid #000",
            boxShadow: "4px 4px 0 #000",
            background: "#c0c0c0",
            minWidth: 220,
            maxWidth: 320,
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center justify-between px-1.5 py-0.5"
            style={{ background: titleColor }}
          >
            <span
              className="text-white text-[10px] font-bold truncate"
              style={{ fontFamily: "MS Sans Serif, Arial, sans-serif" }}
            >
              {title}
            </span>
            <button
              onClick={handleClose}
              className="text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center hover:bg-black/20"
              aria-label="Close popup"
              style={{
                border: "1px solid #fff",
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-3 text-center">
            <div
              className="font-bold text-sm text-red-700 mb-2"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              {headline}
            </div>

            {/* Fake prize graphic */}
            <div
              className="mx-auto mb-2 flex items-center justify-center text-2xl"
              style={{
                width: 60,
                height: 60,
                background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                border: "3px solid #8b6914",
                borderRadius: 4,
                boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #8b6914",
                fontFamily: "serif",
                color: "#8b0000",
                fontWeight: "bold",
              }}
            >
              $$$
            </div>

            <button
              onClick={handleClose}
              className="w-full py-1.5 text-[11px] font-bold cursor-pointer"
              style={{
                fontFamily: "Impact, Arial Black, sans-serif",
                background: "linear-gradient(180deg, #ff4500, #cc0000)",
                color: "#fff",
                border: "2px outset #ff6666",
                letterSpacing: "0.05em",
                textShadow: "1px 1px 0 #000",
              }}
            >
              {cta}
            </button>

            <p
              className="text-[7px] text-gray-500 mt-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Click X to close this ad. By closing you agree to our cookie policy,
              arbitration clause, and authorize IE 6.0 toolbar installation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
