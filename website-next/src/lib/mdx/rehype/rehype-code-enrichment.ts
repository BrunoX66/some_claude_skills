import type { Plugin } from "unified";
import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";

const SHELL_LANGS = new Set(["bash", "sh", "zsh", "shell"]);

function getLanguage(codeEl: Element): string | null {
  const className = codeEl.properties?.className;
  if (!Array.isArray(className)) return null;

  for (const cls of className) {
    if (typeof cls === "string" && cls.startsWith("language-")) {
      return cls.slice(9);
    }
  }
  return null;
}

export const rehypeCodeEnrichment: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;

      const codeChild = node.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "code"
      );

      if (!codeChild) return;

      const lang = getLanguage(codeChild);

      node.properties = node.properties || {};
      node.properties["data-dossier-plugin"] = "rehype-code-enrichment";
      node.properties["data-dossier-copyable"] = "true";

      if (lang) {
        node.properties["data-dossier-language"] = lang;

        if (SHELL_LANGS.has(lang)) {
          node.properties["data-dossier-shell"] = "true";
        }
      }
    });
  };
};
