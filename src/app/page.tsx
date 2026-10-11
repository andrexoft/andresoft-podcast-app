"use client";

import { usePodcasts } from "@/hooks/usePodcasts";
import styles from "./page.module.css";

export default function Home() {
  const { podcasts, isLoading, error } = usePodcasts();

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

      <section className={styles.catalog} aria-label="Podcasts populares">
        {podcasts.map((podcast) => (
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
    </main>
  );
}