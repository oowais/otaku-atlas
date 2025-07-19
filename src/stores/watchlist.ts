import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";

import type { UserScore, UserStatus, WatchlistEntry } from "@/stores/types";

const useWatchlistStore = defineStore("watchlist", () => {
  const watchlist = useLocalStorage<WatchlistEntry[]>("watchlist", []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const animeIds = computed(() =>
    watchlist.value.map((entry) => entry.animeId),
  );

  function _startOperation() {
    isLoading.value = true;
    error.value = null;
  }

  function addToWatchlist(entry: WatchlistEntry): void {
    try {
      _startOperation();

      watchlist.value.push(entry);
    } catch (err) {
      console.log(err instanceof Error);
      error.value =
        err instanceof Error ? err.message : "Failed to add to watchlist";
    } finally {
      isLoading.value = false;
    }
  }

  function updateStatus({
    animeId,
    newStatus,
  }: {
    animeId: number;
    newStatus: UserStatus;
  }): void {
    try {
      _startOperation();

      const entryIndex = watchlist.value.findIndex(
        (entry) => entry.animeId === animeId,
      );
      if (entryIndex === -1) return;

      const updatedEntry = {
        ...watchlist.value[entryIndex],
        status: newStatus,
      };

      watchlist.value[entryIndex] = updatedEntry;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update status";
    } finally {
      isLoading.value = false;
    }
  }

  function updateScore({
    animeId,
    newScore,
  }: {
    animeId: number;
    newScore: UserScore;
  }): void {
    try {
      _startOperation();

      const entryIndex = watchlist.value.findIndex(
        (entry) => entry.animeId === animeId,
      );
      if (entryIndex === -1) return;

      const updatedEntry = {
        ...watchlist.value[entryIndex],
        score: newScore,
      };

      watchlist.value[entryIndex] = updatedEntry;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update status";
    } finally {
      isLoading.value = false;
    }
  }

  function removeFromWatchlist({ animeId }: { animeId: number }): void {
    try {
      _startOperation();

      watchlist.value = watchlist.value.filter(
        (entry) => entry.animeId !== animeId,
      );
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to remove from watchlist";
    } finally {
      isLoading.value = false;
    }
  }

  return {
    watchlist: readonly(watchlist),
    isLoading: readonly(isLoading),
    error: readonly(error),

    animeIds,

    addToWatchlist,
    updateStatus,
    updateScore,
    removeFromWatchlist,
  };
});

export { useWatchlistStore };
