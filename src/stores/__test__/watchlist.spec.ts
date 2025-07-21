import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserStatus } from "@/stores/types";
import { useWatchlistStore } from "@/stores/watchlist";

const mockUseLocalStorage = vi.hoisted(() => vi.fn());

vi.mock("@vueuse/core", () => ({
  useLocalStorage: mockUseLocalStorage,
}));

describe("useWatchlistStore", () => {
  let store: ReturnType<typeof useWatchlistStore>;
  let mockWatchlistRef: { value: Record<number, UserStatus> };

  beforeEach(() => {
    vi.clearAllMocks();

    mockWatchlistRef = { value: {} };
    mockUseLocalStorage.mockReturnValue(mockWatchlistRef);

    setActivePinia(createPinia());
    store = useWatchlistStore();
  });

  describe("animeIds computed property", () => {
    it("should return empty array when watchlist is empty", () => {
      expect(store.animeIds).toEqual([]);
    });

    it("should return array of anime IDs from watchlist", () => {
      mockWatchlistRef.value = {
        1: "watching",
        2: "completed",
      };

      expect(store.animeIds).toEqual([1, 2]);
    });
  });

  describe("removeFromWatchlist", () => {
    beforeEach(() => {
      mockWatchlistRef.value = {
        1: "watching",
        2: "completed",
        3: "planToWatch",
      };
    });

    it("should remove entry from watchlist", () => {
      store.removeFromWatchlist({ animeId: 2 });

      expect(mockWatchlistRef.value).toEqual({
        1: "watching",
        3: "planToWatch",
      });
    });

    it("should handle removal of non-existing entry", () => {
      const originalWatchlist = { ...mockWatchlistRef.value };

      store.removeFromWatchlist({ animeId: 999 });

      expect(mockWatchlistRef.value).toEqual(originalWatchlist);
    });

    it("should handle errors during removal", () => {
      const originalDelete = Reflect.deleteProperty;
      Reflect.deleteProperty = vi.fn(() => {
        throw new Error("Delete failed");
      });

      store.removeFromWatchlist({ animeId: 1 });

      Reflect.deleteProperty = originalDelete;
    });
  });
});
