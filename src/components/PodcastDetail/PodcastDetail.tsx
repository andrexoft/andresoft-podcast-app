import Link from 'next/link';

import { PodcastSidebar } from '@/components/PodcastSidebar/PodcastSidebar';
import type { Podcast } from '@/types/podcast';
import type { Episode } from '@/types/episode';

import styles from './PodcastDetail.module.css';

function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

export default function PodcastDetail({
  podcast,
  episodes,
}: {
  podcast: Podcast;
  episodes: Episode[];
}) {
  return (
    <div className={styles.container}>
      <PodcastSidebar podcast={podcast} />

      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>

        <div className={styles.episodes}>
          <div className={styles.episodesHeader}>
            <span>Title</span>
            <span>Date</span>
            <span>Duration</span>
          </div>

          {episodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/podcast/${podcast.id}/episode/${episode.id}`}
              className={styles.episode}
            >
              <span className={styles.episodeTitle}>{episode.title}</span>

              <span className={styles.episodeDate}>
                {formatDate(episode.releaseDate)}
              </span>

              <span className={styles.episodeDuration}>
                {formatDuration(episode.duration)}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}