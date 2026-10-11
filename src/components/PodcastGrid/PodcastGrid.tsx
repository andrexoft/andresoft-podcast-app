import type { Podcast } from "@/types/podcast";

import styles from "./PodcastGrid.module.css";

interface PodcastGridProps {
  podcasts: Podcast[];
}

export function PodcastGrid({ podcasts }: PodcastGridProps) {
  return (
    <div className={styles.grid}>
      {podcasts.map((podcast) => (
        <article key={podcast.id}>
          <img
            src={podcast.image}
            alt={`Portada de ${podcast.title}`}
            loading="lazy"
          />

          <h2>{podcast.title}</h2>
          <p>{podcast.author}</p>
        </article>
      ))}
    </div>
  );
}