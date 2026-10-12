'use client';

import { useParams } from 'next/navigation';
import PodcastEpisodeDetail from '@/components/PodcastEpisodeDetail/PodcastEpisodeDetail';
import { usePodcastDetail } from '@/hooks/usePodcastDetail';
import { Loading } from '@/components/Loading/Loading';

export default function PodcastEpisodeDetailPage() {
  const params = useParams<{
    id: string;
    episodeId: string;
  }>();

  const { podcast, isLoading } = usePodcastDetail(params.id);

  if (isLoading) {
    return <Loading message="Loading episode detail..." />;
  }

  if (!podcast) {
    return <main>Episode not found</main>;
  }

  const episode = podcast.episodes.find((item) => item.id === params.episodeId);

  if (!episode) {
    return <main>Episodio no encontrado</main>;
  }

  return <PodcastEpisodeDetail podcast={podcast} episode={episode} />;
}
