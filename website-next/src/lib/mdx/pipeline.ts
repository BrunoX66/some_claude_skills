import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

import { remarkBlockquoteCallouts } from "./remark/remark-blockquote-callouts";
import { rehypeCodeEnrichment } from "./rehype/rehype-code-enrichment";
import { rehypeLinkEnrichment } from "./rehype/rehype-link-enrichment";

/**
 * Build-time unified pipeline for processing SKILL.md content into HTML.
 *
 * Pipeline stages:
 *   remark-parse          -> parse markdown AST
 *   remark-gfm            -> tables, strikethrough, task lists
 *   remark-frontmatter    -> pass-through YAML frontmatter (already stripped, but safety)
 *   remark-blockquote-callouts -> TIP/WARNING/INFO callout panels
 *   remark-rehype          -> bridge to HTML AST
 *   rehype-slug            -> heading anchor IDs
 *   rehype-highlight       -> syntax highlighting via highlight.js
 *   rehype-code-enrichment -> language badge, copy button, shell detection
 *   rehype-link-enrichment -> external link indicators
 *   rehype-stringify        -> serialize to HTML string
 *
 * Forked from workgroup-ai's dossier pipeline, stripped to only the plugins
 * relevant for skill documentation (no checklists, bento grids, cross-refs, etc.)
 */
export async function processSkillMarkdown(
  markdown: string
): Promise<string> {
  // Build pipeline in stages to avoid TS chain depth limit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pipeline: any = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ["yaml"]);

  // Content detection
  pipeline = pipeline.use(remarkBlockquoteCallouts);

  // Bridge to rehype
  pipeline = pipeline.use(remarkRehype, { allowDangerousHtml: true });

  // Rehype enrichment
  pipeline = pipeline
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true })
    .use(rehypeCodeEnrichment)
    .use(rehypeLinkEnrichment)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await pipeline.process(markdown);
  return String(result);
}
