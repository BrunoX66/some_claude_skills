import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Servers | Some Claude Skills",
  description: "Model Context Protocol servers built for Claude Code — prompt optimization, resume ATS, and more.",
};

export default function McpsPage() {
  return <Desktop initialWindow={{ type: "mcp" }} />;
}
