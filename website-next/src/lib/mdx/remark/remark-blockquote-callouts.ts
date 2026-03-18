import type { Plugin } from "unified";
import type { Root, Blockquote, Paragraph, Text } from "mdast";
import { visit } from "unist-util-visit";

type CalloutVariant = "info" | "warning" | "tip" | "danger" | "quote";

const PREFIX_MAP: Record<string, CalloutVariant> = {
  TIP: "tip",
  WARNING: "warning",
  INFO: "info",
  NOTE: "info",
  DANGER: "danger",
  CRITICAL: "danger",
};

function getFirstText(blockquote: Blockquote): string {
  const para = blockquote.children.find(
    (c): c is Paragraph => c.type === "paragraph"
  );
  if (!para) return "";
  const text = para.children.find((c): c is Text => c.type === "text");
  return text?.value || "";
}

function detectVariant(text: string): CalloutVariant {
  const match = text.match(/^(TIP|WARNING|INFO|NOTE|DANGER|CRITICAL):\s*/i);
  if (match) {
    return PREFIX_MAP[match[1].toUpperCase()] || "quote";
  }
  return "quote";
}

export const remarkBlockquoteCallouts: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      if (!parent || index === undefined) return;

      const firstText = getFirstText(node);
      const variant = detectVariant(firstText);

      const wrapper = {
        type: "dossierCallout" as const,
        children: [node],
        data: {
          hName: "div",
          hProperties: {
            "data-dossier-plugin": "remark-blockquote-callouts",
            "data-dossier-type": "callout",
            "data-dossier-variant": variant,
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (parent.children as any[])[index] = wrapper;
    });
  };
};
