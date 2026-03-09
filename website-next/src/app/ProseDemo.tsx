"use client";

import { Win31Window, Win31Prose } from "@/components/win31";

interface ProseDemoProps {
  /** Window title text */
  title: string;
  /** Raw markdown to render */
  content: string;
}

/**
 * Renders a skill document inside a Win31Window using Win31Prose.
 * Accepts content as a prop so the server component can pass real skill data.
 */
export function ProseDemo({ title, content }: ProseDemoProps) {
  return (
    <Win31Window
      title={title}
      initialWidth={640}
      initialHeight={560}
      isActive
    >
      <div className="p-4 overflow-y-auto max-h-[480px]">
        <Win31Prose content={content} />
      </div>
    </Win31Window>
  );
}
