import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | Some Claude Skills",
  description: "What's new in Some Claude Skills — feature updates, UI improvements, and new skills.",
};

export default function ChangelogPage() {
  return <Desktop initialWindow={{ type: "changelog" }} />;
}
