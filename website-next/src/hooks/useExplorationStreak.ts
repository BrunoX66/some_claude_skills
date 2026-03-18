"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "scs:streak";

interface StreakData {
  weekStart: string; // ISO date of Monday, e.g. "2026-03-16"
  count: number;
}

/** Get the Monday of the current week as ISO date string. */
function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return monday.toISOString().slice(0, 10);
}

/**
 * Weekly exploration counter — forgiving, no shame.
 * Resets on new week (Monday boundary). Display: "5 this week".
 * Never says "streak broken" or "you missed...".
 */
export function useExplorationStreak() {
  const [weeklyCount, setWeeklyCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: StreakData = JSON.parse(raw);
        const currentWeek = getCurrentWeekStart();
        if (data.weekStart === currentWeek) {
          setWeeklyCount(data.count);
        } else {
          // New week — fresh start, no judgment
          const fresh: StreakData = { weekStart: currentWeek, count: 0 };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          setWeeklyCount(0);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const incrementStreak = useCallback(() => {
    setWeeklyCount((prev) => {
      const next = prev + 1;
      try {
        const data: StreakData = {
          weekStart: getCurrentWeekStart(),
          count: next,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { weeklyCount, incrementStreak };
}
