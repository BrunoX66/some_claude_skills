import { useWindowManager } from "@/state/windowManager";

export function openSkillWindow(skillId: string, title: string) {
  useWindowManager.getState().openWindow({
    id: `skill-${skillId}`,
    title: `${title} - SKILL.MD`,
    x: 60,
    y: 40,
    width: 600,
    height: 450,
    isMinimized: false,
    isMaximized: false,
    content: { type: "skill", skillId },
  });
}

export function openChangelogWindow() {
  useWindowManager.getState().openWindow({
    id: "changelog",
    title: "WHATSNEW.TXT",
    x: 80,
    y: 60,
    width: 550,
    height: 400,
    isMinimized: false,
    isMaximized: false,
    content: { type: "changelog" },
  });
}

export function openSearchWindow() {
  useWindowManager.getState().openWindow({
    id: "search",
    title: "Find Skills",
    x: 100,
    y: 80,
    width: 450,
    height: 350,
    isMinimized: false,
    isMaximized: false,
    content: { type: "search" },
  });
}
