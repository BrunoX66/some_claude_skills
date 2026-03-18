import { Desktop } from "@/components/desktop/Desktop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Starred Skills | Some Claude Skills",
  description: "Your personally starred Claude Code skills, saved for quick access.",
};

export default function FavoritesPage() {
  return <Desktop initialWindow={{ type: "favorites" }} />;
}
