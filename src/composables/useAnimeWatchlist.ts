import { storeToRefs } from "pinia";
import { ref } from "vue";

import { getAnimeByIdsQuery, PER_PAGE } from "@/graphql/queries";
import type { Anime } from "@/graphql/types";
import { client } from "@/graphql/urql-client";
import { useWatchlistStore } from "@/stores/watchlist";

const useAnimeWatchlist = () => {
  const results = ref<Anime[]>([]);
  const loading = ref(false);
  const error = ref(false);
  const currentPage = ref(1);
  const hasNextPage = ref(false);
  const totalResults = ref(0);

  const { animeIds } = storeToRefs(useWatchlistStore());

  async function loadAnime(page = 1, perPage = PER_PAGE) {
    loading.value = true;
    error.value = false;

    if (!animeIds.value.length) {
      loading.value = false;
      results.value = [];
      return;
    }

    try {
      const { data } = await client.query(getAnimeByIdsQuery, {
        ids: animeIds.value,
        page,
        perPage,
      });
      if (!data || !data.Page || !data.Page.media) {
        results.value = [];
        return;
      }
      const animeList = data.Page.media.filter((item) => item !== null);

      if (page === 1) results.value = animeList;
      else results.value.push(...animeList);

      currentPage.value = data.Page.pageInfo?.currentPage ?? page;
      hasNextPage.value = data.Page.pageInfo?.hasNextPage ?? false;
      totalResults.value = data.Page.pageInfo?.total ?? 0;
    } catch {
      error.value = true;
    } finally {
      loading.value = false;
    }
  }

  const loadMore = async () => {
    if (!hasNextPage.value || loading.value) return;
    await loadAnime(currentPage.value + 1);
  };

  return {
    loadAnime,
    loadMore,
    error,
    loading,
    results,
    hasNextPage,
  };
};

export { useAnimeWatchlist };
