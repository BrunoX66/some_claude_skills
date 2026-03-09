import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

/**
 * Extract YAML frontmatter key-value pairs from raw markdown.
 * Simple regex-based parser -- handles flat key: value lines only.
 * Strips surrounding quotes from values.
 */
export function extractFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const pairs: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();
    // Strip surrounding single or double quotes
    pairs[key] = val.replace(/^['"]|['"]$/g, "");
  }
  return pairs;
}

/**
 * Remove the `---` frontmatter block from markdown, returning just the body.
 */
export function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

/**
 * Server-side unified pipeline: markdown -> HTML string.
 *
 * Pipeline:
 *   remark-parse -> remark-gfm -> remark-rehype -> rehype-slug
 *   -> rehype-highlight -> rehype-stringify
 *
 * Used for API routes and server components that need pre-rendered HTML.
 * For client-side rendering, use Win31Prose with react-markdown instead.
 */
export async function renderMarkdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)
    .process(content);

  return String(result);
}
