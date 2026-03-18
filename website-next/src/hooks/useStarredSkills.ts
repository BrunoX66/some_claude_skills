"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "some-claude-skills:starred";

/**
 * Hook for managing starred/favorited skill IDs.
 * Persists to localStorage.
 */
export function useStarredSkills() {
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        setStarredIds(new Set(ids));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage whenever set changes
  const persist = useCallback((ids: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, []);

  const toggleStar = useCallback(
    (skillId: string) => {
      setStarredIds((prev) => {
        const next = new Set(prev);
        if (next.has(skillId)) {
          next.delete(skillId);
        } else {
          next.add(skillId);
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isStarred = useCallback(
    (skillId: string) => starredIds.has(skillId),
    [starredIds]
  );

  return { starredIds, toggleStar, isStarred };
}
