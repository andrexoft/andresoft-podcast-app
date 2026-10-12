'use client';

import { useParams } from 'next/navigation';
import PodcastDetail from '@/components/PodcastDetail/PodcastDetail';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';
import { Loading } from '@/components/Loading/Loading';

export default function PodcastDetailPage() {
  const params = useParams<{ id: string }>();
  const { podcast, isLoading } = usePodcastDetail(params.id);

  if (isLoading) {
    return <Loading message="Loading podcast detail..." />;
  }

  if (!podcast) {
    return <main>Podcast not found</main>;
  }

  return <PodcastDetail podcast={podcast} episodes={podcast.episodes} />;
}
