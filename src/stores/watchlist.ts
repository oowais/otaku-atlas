import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

import { getAnimeByIdsQuery, PER_PAGE } from "@/graphql/queries";
import type { Anime } from "@/graphql/types";
import { client } from "@/graphql/urql-client";
import type { UserStatus } from "@/stores/types";

const useWatchlistStore = defineStore("watchlist", () => {
  const watchlist = useLocalStorage<Record<number, UserStatus>>(
    "watchlist",
    {},
  );
  const results = ref<Anime[]>([]);
  const loading = ref(false);
  const error = ref(false);
  const currentPage = ref(1);
  const hasNextPage = ref(false);
  const totalResults = ref(0);

  const animeIds = computed(() =>
    Object.keys(watchlist.value).map((id) => Number(id)),
  );

  function removeFromWatchlist({ animeId }: { animeId: number }): void {
    try {
      delete watchlist.value[animeId];
    } catch {
      toast.error("Failed to remove from watchlist");
    }
  }

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
    watchlist,
    animeIds,
    removeFromWatchlist,

    results,
    loading,
    error,
    currentPage,
    hasNextPage,
    totalResults,
    loadAnime,
    loadMore,
  };
});

export { useWatchlistStore };
