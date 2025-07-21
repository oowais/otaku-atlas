import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { PER_PAGE, searchAnimeQuery } from "@/graphql/queries";
import type { Anime } from "@/graphql/types";
import { client } from "@/graphql/urql-client";

const useSearchStore = defineStore("search", () => {
  const searchResults = ref<Anime[]>([]);
  const loading = ref(false);
  const error = ref(false);
  const currentPage = ref(1);
  const hasNextPage = ref(false);
  const totalResults = ref(0);
  const currentSearchTerm = ref("");

  async function searchAnime(searchTerm: string, page = 1, perPage = PER_PAGE) {
    currentSearchTerm.value = searchTerm;
    if (!searchTerm.trim()) {
      searchResults.value = [];
      return;
    }

    loading.value = true;
    error.value = false;

    try {
      const { data } = await client.query(searchAnimeQuery, {
        search: searchTerm,
        page,
        perPage,
      });

      if (!data || !data.Page || !data.Page.media) {
        searchResults.value = [];
        return;
      }

      const animeList = data.Page.media.filter((item) => item !== null);

      if (page === 1) searchResults.value = animeList;
      else searchResults.value.push(...animeList);

      currentPage.value = data.Page.pageInfo?.currentPage ?? page;
      hasNextPage.value = data.Page.pageInfo?.hasNextPage ?? false;
      totalResults.value = data.Page.pageInfo?.total ?? 0;
    } catch (err) {
      error.value = true;
      console.error("Search error:", err);
    } finally {
      loading.value = false;
    }
  }

  const loadMore = async () => {
    if (!hasNextPage.value || loading.value) return;
    await searchAnime(currentSearchTerm.value, currentPage.value + 1);
  };

  const clearResults = () => {
    searchResults.value = [];
    currentPage.value = 1;
    hasNextPage.value = false;
    totalResults.value = 0;
    error.value = false;
    currentSearchTerm.value = "";
  };

  const hasResults = computed(() => searchResults.value.length > 0);

  return {
    searchResults,
    loading,
    error,
    currentPage,
    hasNextPage,
    totalResults,
    hasResults,
    currentSearchTerm,
    searchAnime,
    loadMore,
    clearResults,
  };
});

export { useSearchStore };
