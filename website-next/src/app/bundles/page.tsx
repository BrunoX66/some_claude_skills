import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skill Bundles | Some Claude Skills",
  description: "Curated Claude Code skill bundles for common workflows — AI development, code review, documentation, and more.",
};

export default function BundlesPage() {
  return <Desktop initialWindow={{ type: "bundles" }} />;
}
