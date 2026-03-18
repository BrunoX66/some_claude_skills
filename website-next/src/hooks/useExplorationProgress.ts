"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "scs:explored-skills";

/**
 * Tracks which skills the user has visited.
 * Persists to localStorage with the same try/catch pattern as useStarredSkills.
 */
export function useExplorationProgress() {
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        setExploredIds(new Set(ids));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const persist = useCallback((ids: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      // ignore storage errors
    }
  }, []);

  /** Mark a skill as explored. Returns true if newly added (first visit). */
  const markExplored = useCallback(
    (skillId: string): boolean => {
      let isNew = false;
      setExploredIds((prev) => {
        if (prev.has(skillId)) return prev;
        isNew = true;
        const next = new Set(prev);
        next.add(skillId);
        persist(next);
        return next;
      });
      return isNew;
    },
    [persist]
  );

  const isExplored = useCallback(
    (skillId: string) => exploredIds.has(skillId),
    [exploredIds]
  );

  return {
    exploredIds,
    exploredCount: exploredIds.size,
    markExplored,
    isExplored,
  };
}
