"use client";

import { Win31Window, Win31Prose } from "@/components/win31";

interface ProseDemoProps {
  /** Window title text */
  title: string;
  /** Pre-rendered HTML to display */
  contentHtml: string;
}

/**
 * Renders a skill document inside a Win31Window using Win31Prose.
 * Accepts pre-rendered HTML as a prop so the server component can pass real skill data.
 */
export function ProseDemo({ title, contentHtml }: ProseDemoProps) {
  return (
    <Win31Window
      title={title}
      initialWidth={640}
      initialHeight={560}
      isActive
    >
      <div className="p-4 overflow-y-auto max-h-[480px]">
        <Win31Prose contentHtml={contentHtml} />
      </div>
    </Win31Window>
  );
}
