import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founding Council Agents | Some Claude Skills",
  description: "The 9 meta-orchestrating agents that build and maintain the Some Claude Skills ecosystem.",
};

export default function AgentsPage() {
  return <Desktop initialWindow={{ type: "agents" }} />;
}
