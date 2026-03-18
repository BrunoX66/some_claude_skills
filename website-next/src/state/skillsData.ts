import { create } from "zustand";
import type { Skill } from "@/types/skill";

/**
 * skillsData — global read-only cache of all skills + category structure.
 *
 * Two initialization paths:
 *   1. `init(data)` — called with pre-loaded data (e.g., from server props)
 *   2. `load()`     — fetches /data/skills.json client-side (preferred for
 *                      static export to avoid duplicating data in RSC payloads)
 *
 * Window components read from this store via selectors.
 */
interface SkillsDataState {
  skills:            Skill[];
  categories:        string[];
  skillsByCategory:  Record<string, Skill[]>;
  initialized:       boolean;
  loading:           boolean;

  init: (data: {
    skills: Skill[];
    categories: string[];
    skillsByCategory: Record<string, Skill[]>;
  }) => void;

  /** Fetch skills data from the static JSON file. No-op if already loaded. */
  load: () => Promise<void>;
}

export const useSkillsData = create<SkillsDataState>((set, get) => ({
  skills:           [],
  categories:       [],
  skillsByCategory: {},
  initialized:      false,
  loading:          false,

  init: ({ skills, categories, skillsByCategory }) =>
    set({ skills, categories, skillsByCategory, initialized: true, loading: false }),

  load: async () => {
    const { initialized, loading } = get();
    if (initialized || loading) return;

    set({ loading: true });

    try {
      const res = await fetch("/data/skills.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      set({
        skills:           data.skills ?? [],
        categories:       data.categories ?? [],
        skillsByCategory: data.skillsByCategory ?? {},
        initialized:      true,
        loading:          false,
      });
    } catch (err) {
      console.error("Failed to load skills data:", err);
      set({ loading: false });
    }
  },
}));
