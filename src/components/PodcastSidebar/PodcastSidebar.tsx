import Image from 'next/image';
import Link from 'next/link';

import type { Podcast } from '@/types/podcast';

import styles from './PodcastSidebar.module.css';

interface PodcastSidebarProps {
  podcast: Podcast;
  showBackLink?: boolean;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .trim();
}

export function PodcastSidebar({
  podcast,
  showBackLink = false,
}: PodcastSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Link href={`/podcast/${podcast.id}`} className={styles.imageLink}>
        <Image
          className={styles.image}
          src={podcast.image}
          alt={podcast.title}
          width={300}
          height={300}
        />
      </Link>

      <div className={styles.sidebarContent}>
        <h1 className={styles.title}>{podcast.title}</h1>

        <p className={styles.author}>by {podcast.author}</p>

        <div className={styles.description}>
          <p className={styles.descriptionTitle}>Description:</p>
          {stripHtml(podcast.description)}
        </div>

        {showBackLink && (
          <Link href={`/podcast/${podcast.id}`} className={styles.backLink}>
            ← Return to podcast
          </Link>
        )}
      </div>
    </aside>
  );
}