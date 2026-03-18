"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface BrowserWindowProps {
  initialUrl?: string;
}

export function BrowserWindow({ initialUrl = "https://classic.someclaudeskills.com" }: BrowserWindowProps) {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (target: string) => {
    let normalized = target.trim();
    if (normalized && !normalized.startsWith("http")) {
      normalized = "https://" + normalized;
    }
    setUrl(normalized);
    setInputUrl(normalized);
    setLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navigate(inputUrl);
  };

  const btnClass = cn(
    "px-2 py-0.5 text-[10px] font-bold font-[family-name:var(--font-system)] cursor-pointer shrink-0",
    "bg-[var(--color-surface-raised)]",
    "border border-t-[var(--color-border-raised-light)] border-l-[var(--color-border-raised-light)]",
    "border-b-[var(--color-border-raised-dark)] border-r-[var(--color-border-raised-dark)]",
    "active:border-t-[var(--color-border-raised-dark)] active:border-l-[var(--color-border-raised-dark)]",
    "active:border-b-[var(--color-border-raised-light)] active:border-r-[var(--color-border-raised-light)]",
    "disabled:opacity-40 disabled:cursor-default"
  );

  return (
    <div className="h-full flex flex-col bg-[var(--color-surface-inset)]">
      {/* Address bar */}
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 shrink-0",
        "bg-[var(--color-surface)]",
        "border-b border-b-[var(--color-border-inset-dark)]"
      )}>
        <button className={btnClass} onClick={() => navigate(initialUrl)} title="Home">
          Home
        </button>
        <button
          className={btnClass}
          onClick={() => iframeRef.current?.contentWindow?.history.back()}
          title="Back"
        >
          Back
        </button>
        <button
          className={btnClass}
          onClick={() => iframeRef.current?.contentWindow?.history.forward()}
          title="Forward"
        >
          Fwd
        </button>

        {/* URL input */}
        <div className="flex-1 flex items-center gap-1">
          <span className="text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)] shrink-0">
            Address:
          </span>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 px-1.5 py-0.5 text-[10px] font-[family-name:var(--font-code)]",
              "bg-[var(--color-content-bg)] text-[var(--color-text-primary)]",
              "border border-t-[var(--color-border-inset-dark)] border-l-[var(--color-border-inset-dark)]",
              "border-b-[var(--color-border-raised-light)] border-r-[var(--color-border-raised-light)]",
              "outline-none"
            )}
          />
          <button className={btnClass} onClick={() => navigate(inputUrl)}>
            Go
          </button>
        </div>

        {loading && (
          <span className="text-[9px] text-[var(--color-text-muted)] font-[family-name:var(--font-system)] animate-pulse shrink-0">
            Loading...
          </span>
        )}
      </div>

      {/* Iframe */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src={url}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          onLoad={() => setLoading(false)}
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
      </div>

      {/* Status bar */}
      <div className={cn(
        "flex items-center px-2 py-0.5 shrink-0",
        "bg-[var(--color-surface)]",
        "border-t border-t-[var(--color-border-raised-light)]",
        "text-[9px] font-[family-name:var(--font-system)] text-[var(--color-text-muted)]"
      )}>
        {url}
      </div>
    </div>
  );
}
