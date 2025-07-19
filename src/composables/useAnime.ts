import { storeToRefs } from "pinia";

import { getAnimeByIds } from "@/graphql/queries";
import type { AnimeWatchlist } from "@/stores/types";
import { useWatchlistStore } from "@/stores/watchlist";

const useAnime = () => {
  async function getWatchlistedAnime(): Promise<AnimeWatchlist[] | null> {
    const { animeIds, watchlist } = storeToRefs(useWatchlistStore());
    if (!animeIds.value.length) return [];

    const response = await getAnimeByIds(animeIds.value);
    if (!response.success) return null;

    const animeWatchlistList = watchlist.value
      .map((entry) => {
        const anime = response.data.find((a) => a.id === entry.animeId);
        if (!anime) return null;

        const animeWatchlist: AnimeWatchlist = {
          anime,
          watchlistEntry: {
            status: entry.status,
            score: entry.score,
          },
        };

        return animeWatchlist;
      })
      .filter((item): item is AnimeWatchlist => item !== null);

    return animeWatchlistList;
  }

  return { getWatchlistedAnime };
};

export { useAnime };
