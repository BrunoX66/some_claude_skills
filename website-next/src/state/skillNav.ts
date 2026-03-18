import { create } from "zustand";

/**
 * skillNav — navigation history for the SKILL_DETAILS program.
 *
 * Only one skill can be "open" in SKILL_DETAILS at a time.
 * The three linked windows (details, filetree, install) all read
 * currentSkillId from this store and update in sync.
 */
interface SkillNavState {
  history: string[];       // skill IDs in navigation order
  currentIndex: number;    // -1 = nothing open
  currentSkillId: string | null;

  navigateTo: (skillId: string) => void;
  goBack:     () => void;
  goForward:  () => void;
  canGoBack:  () => boolean;
  canGoForward: () => boolean;
}

export const useSkillNav = create<SkillNavState>((set, get) => ({
  history:       [],
  currentIndex:  -1,
  currentSkillId: null,

  navigateTo: (skillId) =>
    set((state) => {
      // Truncate forward history, append new entry
      const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        skillId,
      ];
      return {
        history:        newHistory,
        currentIndex:   newHistory.length - 1,
        currentSkillId: skillId,
      };
    }),

  goBack: () =>
    set((state) => {
      if (state.currentIndex <= 0) return state;
      const idx = state.currentIndex - 1;
      return { currentIndex: idx, currentSkillId: state.history[idx] };
    }),

  goForward: () =>
    set((state) => {
      if (state.currentIndex >= state.history.length - 1) return state;
      const idx = state.currentIndex + 1;
      return { currentIndex: idx, currentSkillId: state.history[idx] };
    }),

  canGoBack:    () => get().currentIndex > 0,
  canGoForward: () => get().currentIndex < get().history.length - 1,
}));
