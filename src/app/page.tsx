"use client";

import { useMemo, useState } from "react";
import { PodcastGrid } from "@/components/PodcastGrid/PodcastGrid";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { usePodcasts } from "@/hooks/usePodcasts";
import { Loading } from '@/components/Loading/Loading';
import styles from "./page.module.css";

export default function Home() {
  const { podcasts, isLoading, error } = usePodcasts();
  const [search, setSearch] = useState("");

  const filteredPodcasts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return podcasts;
    }

    return podcasts.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(normalizedSearch) ||
        podcast.author.toLowerCase().includes(normalizedSearch),
    );
  }, [podcasts, search]);

  if (isLoading) {
    return <Loading message="Loading podcast..." />;
  }

  if (error) {
    return <main className={styles.page}>{error}</main>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.toolbar}>
        <p className={styles.count}>{filteredPodcasts.length}</p>

        <SearchBar value={search} onChange={setSearch} />
      </div>
      
      <PodcastGrid podcasts={filteredPodcasts} />
    </main>
 
  );
}