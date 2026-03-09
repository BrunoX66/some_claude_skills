"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export interface Win31ProseProps {
  /** Raw markdown string (frontmatter already stripped) */
  content: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Win31Prose -- styled markdown renderer for skill documentation.
 *
 * Uses react-markdown + remark-gfm for client-side rendering.
 * All styling references semantic design tokens (Tier 2) via CSS vars.
 * ZERO hardcoded hex values.
 */
export function Win31Prose({ content, className }: Win31ProseProps) {
  return (
    <div
      className={cn(
        // Base typography
        "font-[family-name:var(--font-body)]",
        "text-[var(--color-text-primary)]",
        "leading-relaxed text-sm",

        // Headings -- h1
        "[&_h1]:font-[family-name:var(--font-window)]",
        "[&_h1]:text-4xl",
        "[&_h1]:text-[var(--color-titlebar-active)]",
        "[&_h1]:border-b-2",
        "[&_h1]:border-[var(--color-titlebar-active)]",
        "[&_h1]:pb-2 [&_h1]:mb-4 [&_h1]:mt-2",

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

        // Inline code
        "[&_code]:font-[family-name:var(--font-code)]",
        "[&_code]:bg-[var(--color-surface)]",
        "[&_code]:border [&_code]:border-[var(--color-border-inset-light)]",
        "[&_code]:px-1.5 [&_code]:py-0.5",
        "[&_code]:text-xs",
        "[&_code]:text-[var(--color-text-code)]",

        // Code blocks (pre > code)
        "[&_pre]:bg-[var(--color-code-bg)]",
        "[&_pre]:text-[var(--color-code-text)]",
        "[&_pre]:border-2 [&_pre]:border-[var(--color-border-raised-dark)]",
        "[&_pre]:p-4 [&_pre]:overflow-x-auto",
        "[&_pre]:my-4 [&_pre]:text-xs [&_pre]:leading-relaxed",
        "[&_pre_code]:bg-transparent [&_pre_code]:border-none",
        "[&_pre_code]:p-0 [&_pre_code]:text-[var(--color-code-text)]",

        // Links
        "[&_a]:text-[var(--color-text-link)]",
        "[&_a]:underline",
        "hover:[&_a]:text-[var(--color-text-accent)]",

        // Blockquotes (Win31 inset panel feel)
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
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
