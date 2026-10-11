import type { Episode } from "./episode";
import type { Podcast } from "./podcast";

export interface PodcastDetail extends Podcast {
  episodes: Episode[];
}