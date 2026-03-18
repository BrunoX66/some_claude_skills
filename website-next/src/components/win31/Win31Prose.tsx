"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

export interface Win31ProseProps {
  /** Pre-rendered HTML from the unified pipeline (build-time processed) */
  contentHtml: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Win31Prose -- styled HTML renderer for skill documentation.
 *
 * Renders pre-processed HTML from the build-time unified pipeline.
 * Content is sanitized via DOMPurify as defense-in-depth (source is trusted
 * SKILL.md from our own repo, never user input).
 *
 * Hydrates copy buttons on code blocks after mount.
 */
export function Win31Prose({ contentHtml, className }: Win31ProseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hydrate copy buttons on code blocks
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const codeBlocks = container.querySelectorAll<HTMLPreElement>(
      "pre[data-dossier-copyable]"
    );

    for (const pre of codeBlocks) {
      // Skip if already hydrated
      if (pre.querySelector(".copy-btn")) continue;

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "COPY";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        if (!code) return;
        navigator.clipboard.writeText(code.textContent || "").then(() => {
          btn.textContent = "OK!";
          btn.setAttribute("data-copied", "true");
          setTimeout(() => {
            btn.textContent = "COPY";
            btn.removeAttribute("data-copied");
          }, 2000);
        });
      });
      pre.appendChild(btn);
    }
  }, [contentHtml]);

  // DOMPurify sanitization as defense-in-depth.
  // Content source is our own SKILL.md files processed at build time, never user input.
  const sanitized = DOMPurify.sanitize(contentHtml, {
    ADD_ATTR: [
      "data-dossier-plugin",
      "data-dossier-type",
      "data-dossier-variant",
      "data-dossier-language",
      "data-dossier-copyable",
      "data-dossier-shell",
      "data-dossier-link",
      "target",
    ],
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "win31-prose",

        // Base typography
        "font-[family-name:var(--font-body)]",
        "text-[var(--color-text-primary)]",
        "leading-relaxed text-sm",

        // Headings -- h1 (VT323 at large size, matches original someclaudeskills)
        "[&_h1]:font-[family-name:var(--font-window)]",
        "[&_h1]:text-5xl",
        "[&_h1]:text-[var(--color-titlebar-active)]",
        "[&_h1]:border-b-2",
        "[&_h1]:border-[var(--color-titlebar-active)]",
        "[&_h1]:pb-2 [&_h1]:mb-4 [&_h1]:mt-2",
        "[&_h1]:leading-tight",

        // Headings -- h2
        "[&_h2]:font-[family-name:var(--font-window)]",
        "[&_h2]:text-2xl",
        "[&_h2]:text-[var(--color-text-accent)]",
        "[&_h2]:mt-6 [&_h2]:mb-3",

        // Headings -- h3
        "[&_h3]:font-[family-name:var(--font-system)]",
        "[&_h3]:text-base [&_h3]:font-semibold",
        "[&_h3]:uppercase [&_h3]:tracking-wider",
        "[&_h3]:mt-5 [&_h3]:mb-2",
        "[&_h3]:text-[var(--color-text-primary)]",

        // Headings -- h4
        "[&_h4]:font-[family-name:var(--font-system)]",
        "[&_h4]:text-sm [&_h4]:font-bold",
        "[&_h4]:mt-4 [&_h4]:mb-1",
        "[&_h4]:text-[var(--color-text-secondary)]",

        // Paragraphs and lists
        "[&_p]:mb-3",
        "[&_ul]:ml-6 [&_ul]:mb-3 [&_ul]:list-disc",
        "[&_ol]:ml-6 [&_ol]:mb-3 [&_ol]:list-decimal",
        "[&_li]:mb-1",

        // Inline code (not inside pre)
        "[&_:not(pre)>code]:font-[family-name:var(--font-code)]",
        "[&_:not(pre)>code]:bg-[var(--color-surface)]",
        "[&_:not(pre)>code]:border [&_:not(pre)>code]:border-[var(--color-border-inset-light)]",
        "[&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5",
        "[&_:not(pre)>code]:text-xs",
        "[&_:not(pre)>code]:text-[var(--color-text-code)]",

        // Code blocks (pre > code) -- terminal: lime-on-black with lime border
        "[&_pre]:bg-[var(--color-code-bg)]",
        "[&_pre]:text-[var(--color-code-text)]",
        "[&_pre]:border-2 [&_pre]:border-[var(--color-code-border)]",
        "[&_pre]:p-4 [&_pre]:overflow-x-auto",
        "[&_pre]:my-4 [&_pre]:text-xs [&_pre]:leading-relaxed",
        "[&_pre_code]:bg-transparent [&_pre_code]:border-none",
        "[&_pre_code]:p-0 [&_pre_code]:text-[var(--color-code-text)]",

        // Links
        "[&_a]:text-[var(--color-text-link)]",
        "[&_a]:underline",
        "hover:[&_a]:text-[var(--color-text-accent)]",

        // Blockquotes (Win31 inset panel feel) — base style for non-callout blockquotes
        "[&_blockquote]:border-l-4",
        "[&_blockquote]:border-[var(--color-titlebar-active)]",
        "[&_blockquote]:bg-[var(--color-surface)]",
        "[&_blockquote]:p-3 [&_blockquote]:my-4",
        "[&_blockquote]:italic",
        "[&_blockquote]:text-[var(--color-text-secondary)]",

        // Tables (Win31 style with navy header)
        "[&_table]:border-collapse [&_table]:w-full",
        "[&_table]:my-4 [&_table]:text-xs",
        "[&_th]:bg-[var(--color-titlebar-active)]",
        "[&_th]:text-[var(--color-titlebar-text)]",
        "[&_th]:p-2 [&_th]:text-left",
        "[&_th]:font-[family-name:var(--font-system)] [&_th]:font-bold",
        "[&_td]:border [&_td]:border-[var(--color-border-inset-light)]",
        "[&_td]:p-2 [&_td]:bg-[var(--color-surface-inset)]",
        "[&_tr:nth-child(even)_td]:bg-[var(--color-surface)]",

        // Horizontal rules (beveled Win31 divider)
        "[&_hr]:border-t [&_hr]:border-t-[var(--color-border-inset-light)]",
        "[&_hr]:border-b [&_hr]:border-b-[var(--color-border-inset-dark)]",
        "[&_hr]:my-6",

        // Strong and emphasis
        "[&_strong]:font-bold [&_strong]:text-[var(--color-text-primary)]",
        "[&_em]:italic",

        className
      )}
      // SECURITY: Content is DOMPurify-sanitized above. Source is our own
      // SKILL.md files processed at build time, never user input.
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
