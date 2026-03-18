import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Some Claude Skills",
  description: "About Some Claude Skills — a curated gallery of 192+ Claude Code skills built by Erich Owens.",
};

export default function AboutPage() {
  return <Desktop initialWindow={{ type: "about" }} />;
}
