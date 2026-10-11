"use client";

import { useEffect, useState } from "react";

import { getCachedData, setCachedData } from "@/lib/cache";
import { getTopPodcasts } from "@/services/podcastService";
import type { Podcast } from "@/types/podcast";

const PODCASTS_CACHE_KEY = "top-podcasts";

interface UsePodcastsResult {
  podcasts: Podcast[];
  isLoading: boolean;
  error: string | null;
}

export function usePodcasts(): UsePodcastsResult {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPodcasts() {
      try {
        const cachedPodcasts =
          getCachedData<Podcast[]>(PODCASTS_CACHE_KEY);

        if (cachedPodcasts) {
          setPodcasts(cachedPodcasts);
          return;
        }

        const fetchedPodcasts = await getTopPodcasts();

        setCachedData(PODCASTS_CACHE_KEY, fetchedPodcasts);
        setPodcasts(fetchedPodcasts);
      } catch (error) {
        console.error("Error al cargar los podcasts:", error);
        setError("No se pudieron cargar los podcasts.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPodcasts();
  }, []);

  return {
    podcasts,
    isLoading,
    error,
  };
}