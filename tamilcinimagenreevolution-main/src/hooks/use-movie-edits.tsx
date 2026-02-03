import { useEffect, useState, useCallback } from "react";

export type MovieEdit = {
  director?: string;
  actor?: string; // comma-separated
};

const STORAGE_KEY = "movieEdits_v1";

function loadEdits(): Record<string, MovieEdit> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load movie edits from localStorage", e);
    return {};
  }
}

function saveEdits(edits: Record<string, MovieEdit>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
  } catch (e) {
    console.error("Failed to save movie edits to localStorage", e);
  }
}

export function useMovieEdits() {
  const [edits, setEdits] = useState<Record<string, MovieEdit>>(() => {
    if (typeof window === "undefined") return {};
    return loadEdits();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    saveEdits(edits);
  }, [edits]);

  const setMovieEdit = useCallback((movieId: string, partial: MovieEdit) => {
    setEdits((prev) => ({
      ...prev,
      [movieId]: {
        ...(prev[movieId] || {}),
        ...partial,
      },
    }));
  }, []);

  const clearMovieEdit = useCallback((movieId: string) => {
    setEdits((prev) => {
      const copy = { ...prev } as Record<string, MovieEdit>;
      delete copy[movieId];
      return copy;
    });
  }, []);

  const resetAll = useCallback(() => setEdits({}), []);

  return {
    edits,
    setMovieEdit,
    clearMovieEdit,
    resetAll,
  } as const;
}
