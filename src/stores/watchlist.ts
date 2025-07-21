import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import { toast } from "vue-sonner";

import type { UserStatus } from "@/stores/types";

const useWatchlistStore = defineStore("watchlist", () => {
  const watchlist = useLocalStorage<Record<number, UserStatus>>(
    "watchlist",
    {},
  );

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

  return {
    watchlist,
    animeIds,

    removeFromWatchlist,
  };
});

export { useWatchlistStore };
