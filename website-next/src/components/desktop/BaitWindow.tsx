"use client";

import { useState, useCallback } from "react";
import { Win31Button, Win31Panel } from "@/components/win31";
import { cn } from "@/lib/utils";
import { SpamPopup } from "./SpamPopup";

const SPAM_POPUPS = [
  {
    title: "🎉 Congratulations!!!",
    titleColor: "#000080",
    headline: "YOU ARE THE 1,000,000TH VISITOR!!!",
    cta: "CLAIM YOUR $1,000 GIFT CARD NOW!!!",
    pos: { top: "8%", left: "5%" },
  },
  {
    title: "URGENT: Your computer has a VIRUS!!!",
    titleColor: "#8b0000",
    headline: "12 VIRUSES DETECTED — ACT NOW!!!",
    cta: "DOWNLOAD ANTIVIRUS™ PRO FREE!!!",
    pos: { top: "12%", right: "5%" },
  },
  {
    title: "You have (1) unread message",
    titleColor: "#006600",
    headline: "A NIGERIAN PRINCE NEEDS YOUR HELP",
    cta: "COLLECT YOUR $4.7M INHERITANCE!!!",
    pos: { bottom: "25%", left: "8%" },
  },
  {
    title: "FLASH SALE ENDS IN: 00:00:03",
    titleColor: "#8b4513",
    headline: "AMAZING DEALS!! CLICK NOW OR MISS OUT FOREVER",
    cta: "YES! I WANT TO SAVE 9000% TODAY!!!",
    pos: { bottom: "20%", right: "4%" },
  },
  {
    title: "Windows Security Alert™",
    titleColor: "#4a0080",
    headline: "YOUR COMPUTER IS BROADCASTING YOUR IP!!!",
    cta: "STOP HACKERS — DOWNLOAD OUR VPN FREE!!!",
    pos: { top: "40%", left: "30%", transform: "translateX(-50%)" },
  },
];

/**
 * BaitWindow — phishing-parody "email" that explodes into 5 spam popups.
 * A love letter to the 2000s web.
 */
export function BaitWindow() {
  const [popupsActive, setPopupsActive] = useState(false);
  const [closedCount, setClosedCount] = useState(0);

  const handleClaimClick = useCallback(() => {
    setPopupsActive(true);
    setClosedCount(0);
  }, []);

  const handlePopupClose = useCallback(() => {
    setClosedCount((c) => {
      const next = c + 1;
      if (next >= SPAM_POPUPS.length) {
        // All closed — reset
        setTimeout(() => {
          setPopupsActive(false);
          setClosedCount(0);
        }, 300);
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* Email viewer */}
      <div className="flex flex-col h-full">
        {/* Email header */}
        <Win31Panel variant="inset" className="m-2 p-2 space-y-0.5">
          <div className="flex gap-1 text-[10px] font-[family-name:var(--font-system)]">
            <span className="text-[var(--color-text-muted)] w-14 shrink-0">From:</span>
            <span className="text-[var(--color-text-secondary)]">
              no-reply@someclaudeskills.com.prize-claim.biz
            </span>
          </div>
          <div className="flex gap-1 text-[10px] font-[family-name:var(--font-system)]">
            <span className="text-[var(--color-text-muted)] w-14 shrink-0">To:</span>
            <span className="text-[var(--color-text-secondary)]">you@yourcomputer.net</span>
          </div>
          <div className="flex gap-1 text-[10px] font-[family-name:var(--font-system)]">
            <span className="text-[var(--color-text-muted)] w-14 shrink-0">Subject:</span>
            <span className="font-bold text-[var(--color-text-primary)]">
              Your exclusive prize is waiting!! [ACTION REQUIRED]
            </span>
          </div>
        </Win31Panel>

        {/* Email body */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {/* Fake banner */}
          <div
            className="w-full py-2 text-center text-white font-bold text-sm"
            style={{
              background: "linear-gradient(90deg, #ff0000, #ff8c00, #ffd700, #008000, #0000ff, #8b00ff)",
              fontFamily: "Impact, Arial Black, sans-serif",
              textShadow: "1px 1px 0 #000",
              letterSpacing: "0.1em",
            }}
          >
            SOMECLAUDESKILLS.COM — PRIZE NOTIFICATION DEPT.
          </div>

          <div
            className={cn(
              "text-xs leading-relaxed",
              "font-[family-name:var(--font-system)]",
              "text-[var(--color-text-primary)]"
            )}
          >
            <p className="font-bold text-red-700 mb-1">
              ⚠️ IMPORTANT NOTICE: This message expires in 24 HOURS ⚠️
            </p>
            <p className="mb-2">
              Dear Valued Visitor,
            </p>
            <p className="mb-2">
              Our records indicate that YOU have been selected as the winner of our{" "}
              <strong>EXCLUSIVE GRAND PRIZE DRAWING</strong>! Your IP address (your.ip.here.1)
              was randomly selected from 47,293,841 entries worldwide.
            </p>
            <p className="mb-2">
              To claim your{" "}
              <strong className="text-red-700">$1,000,000 CASH PRIZE</strong>, simply click the
              button below and provide your credit card for &ldquo;identity verification&rdquo;
              (there is absolutely no charge, this is 100% free guaranteed*).
            </p>
            <p className="text-[9px] text-gray-500 mb-3">
              *Standard rates, fees, and subscriptions apply. Prize value may vary. Not available
              in your country. Winner responsible for all taxes, shipping, and processing fees of
              $999,999.99. Compatible with Internet Explorer 6.0 only.
            </p>
          </div>

          {/* THE BUTTON */}
          <div className="flex justify-center py-2">
            <button
              onClick={handleClaimClick}
              disabled={popupsActive}
              className={cn(
                "px-6 py-3 text-white font-bold text-base cursor-pointer",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              style={{
                fontFamily: "Impact, Arial Black, sans-serif",
                background: popupsActive
                  ? "#666"
                  : "linear-gradient(180deg, #ff4500 0%, #cc0000 100%)",
                border: "3px outset #ff6666",
                boxShadow: "3px 3px 0 #000",
                letterSpacing: "0.05em",
                textShadow: "2px 2px 0 #000",
                animation: popupsActive ? "none" : "pulse 1s ease-in-out infinite alternate",
              }}
            >
              {popupsActive ? "LOADING YOUR PRIZE..." : "CLICK HERE TO CLAIM YOUR FREE PRIZE!!"}
            </button>
          </div>

          <p
            className={cn(
              "text-[9px] text-center",
              "font-[family-name:var(--font-system)]",
              "text-[var(--color-text-muted)]"
            )}
          >
            By clicking you consent to installation of the SCS Toolbar™,
            subscription to 47 email lists, and arbitration in the Principality of Sealand.
          </p>
        </div>
      </div>

      {/* Spam popups — rendered in a portal-like fashion via fixed positioning */}
      {popupsActive &&
        SPAM_POPUPS.slice(0, SPAM_POPUPS.length - closedCount).map((popup, idx) => (
          <SpamPopup
            key={idx}
            title={popup.title}
            titleColor={popup.titleColor}
            headline={popup.headline}
            cta={popup.cta}
            animationDelay={idx * 120}
            onClose={handlePopupClose}
            style={popup.pos as React.CSSProperties}
          />
        ))}
    </>
  );
}
