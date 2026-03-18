import type { Plugin } from "unified";
import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href) || /^\/\//i.test(href);
}

export const rehypeLinkEnrichment: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;
      if (typeof href !== "string") return;

      node.properties = node.properties || {};
      node.properties["data-dossier-plugin"] = "rehype-link-enrichment";

      if (isExternal(href)) {
        node.properties["data-dossier-link"] = "external";
        node.properties.target = "_blank";
        node.properties.rel = "noopener noreferrer";
      } else {
        node.properties["data-dossier-link"] = "local";
      }
    });
  };
};
