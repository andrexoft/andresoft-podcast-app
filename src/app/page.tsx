"use client";

import { useMemo, useState } from "react";

import { usePodcasts } from "@/hooks/usePodcasts";
import { SearchBar } from "@/components/SearchBar/SearchBar";
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
        {filteredPodcasts.length === 1 ? "podcast encontrado" : "podcasts encontrados"}
      </p>

      {filteredPodcasts.length === 0 ? (
        <p>No se han encontrado podcasts que coincidan con tu búsqueda.</p>
      ) : (
        <section className={styles.catalog} aria-label="Podcasts populares">
          {filteredPodcasts.map((podcast) => (
            <article className={styles.card} key={podcast.id}>
              <img
                className={styles.image}
                src={podcast.image}
                alt={`Portada de ${podcast.title}`}
                loading="lazy"
              />

              <div className={styles.cardContent}>
                <h2 className={styles.title}>{podcast.title}</h2>
                <p className={styles.author}>{podcast.author}</p>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}