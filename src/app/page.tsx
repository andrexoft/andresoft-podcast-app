"use client";

import { useMemo, useState } from "react";
import { PodcastGrid } from "@/components/PodcastGrid/PodcastGrid";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { usePodcasts } from "@/hooks/usePodcasts";

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
    return <main className={styles.page}>Cargando podcasts...</main>;
  }

  if (error) {
    return <main className={styles.page}>{error}</main>;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>PODCAST EXPLORER</p>

        <h1>Descubre tu próximo podcast</h1>

        <p className={styles.description}>
          Explora los podcasts más populares y encuentra tu próxima escucha.
        </p>
      </header>

      <section aria-label="Buscar podcasts">
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <p aria-live="polite">
        {filteredPodcasts.length}{" "}
        {filteredPodcasts.length === 1
          ? "podcast encontrado"
          : "podcasts encontrados"}
      </p>

      {filteredPodcasts.length === 0 ? (
        <p>No se han encontrado podcasts que coincidan con tu búsqueda.</p>
      ) : (
        <PodcastGrid podcasts={filteredPodcasts} />
      )}
    </main>
  );
}