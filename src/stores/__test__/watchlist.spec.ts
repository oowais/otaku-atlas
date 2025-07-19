import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserScore, UserStatus, WatchlistEntry } from "@/stores/types";
import { useWatchlistStore } from "@/stores/watchlist";

const mockUseLocalStorage = vi.hoisted(() => vi.fn());

vi.mock("@vueuse/core", () => ({
  useLocalStorage: mockUseLocalStorage,
}));

describe("useWatchlistStore", () => {
  let store: ReturnType<typeof useWatchlistStore>;
  let mockWatchlistRef: { value: WatchlistEntry[] };

  beforeEach(() => {
    vi.clearAllMocks();

    mockWatchlistRef = { value: [] };
    mockUseLocalStorage.mockReturnValue(mockWatchlistRef);

    setActivePinia(createPinia());
    store = useWatchlistStore();
  });

  describe("Initial State", () => {
    it("should initialize with empty watchlist", () => {
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should call useLocalStorage with correct parameters", () => {
      expect(mockUseLocalStorage).toHaveBeenCalledWith("watchlist", []);
    });

    it("should compute animeIds correctly", () => {
      expect(store.animeIds).toEqual([]);
    });
  });

  describe("animeIds computed property", () => {
    it("should return empty array when watchlist is empty", () => {
      expect(store.animeIds).toEqual([]);
    });

    it("should return array of anime IDs from watchlist", () => {
      mockWatchlistRef.value = [
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 2, status: "completed", score: 4 },
      ];

      expect(store.animeIds).toEqual([1, 2]);
    });
  });

  describe("addToWatchlist", () => {
    it("should add new entry to watchlist", () => {
      store.addToWatchlist({ animeId: 123, status: "watching", score: 4 });

      expect(mockWatchlistRef.value).toEqual([
        {
          animeId: 123,
          status: "watching",
          score: 4,
        },
      ]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should add multiple entries", () => {
      store.addToWatchlist({ animeId: 1, status: "watching", score: 5 });
      store.addToWatchlist({ animeId: 2, status: "completed", score: 5 });

      expect(mockWatchlistRef.value).toHaveLength(2);
      expect(mockWatchlistRef.value[0].animeId).toBe(1);
      expect(mockWatchlistRef.value[1].animeId).toBe(2);
    });

    it("should handle different status and score combinations", () => {
      store.addToWatchlist({ animeId: 1, status: "planToWatch", score: 0 });
      store.addToWatchlist({ animeId: 2, status: "onHold", score: 3 });
      store.addToWatchlist({ animeId: 3, status: "dropped", score: 4 });

      expect(mockWatchlistRef.value).toEqual([
        { animeId: 1, status: "planToWatch", score: 0 },
        { animeId: 2, status: "onHold", score: 3 },
        { animeId: 3, status: "dropped", score: 4 },
      ]);
    });

    it("should handle errors during add operation", () => {
      vi.spyOn(mockWatchlistRef.value, "push").mockImplementation(() => {
        throw "Push failed";
      });

      store.addToWatchlist({ animeId: 123, status: "watching", score: 4 });

      expect(store.error).toBe("Failed to add to watchlist");
      expect(store.isLoading).toBe(false);
    });
  });

  describe("updateStatus", () => {
    beforeEach(() => {
      mockWatchlistRef.value = [
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 2, status: "completed", score: 4 },
      ];
    });

    it("should update status of existing entry", () => {
      store.updateStatus({ animeId: 1, newStatus: "completed" });

      expect(mockWatchlistRef.value[0]).toEqual({
        animeId: 1,
        status: "completed",
        score: 3,
      });
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should not affect other entries", () => {
      const originalSecondEntry = { ...mockWatchlistRef.value[1] };

      store.updateStatus({ animeId: 1, newStatus: "onHold" });

      expect(mockWatchlistRef.value[1]).toEqual(originalSecondEntry);
    });

    it("should do nothing if anime not found", () => {
      const originalWatchlist = [...mockWatchlistRef.value];

      store.updateStatus({ animeId: 999, newStatus: "completed" });

      expect(mockWatchlistRef.value).toEqual(originalWatchlist);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should handle all status types", () => {
      const statuses: UserStatus[] = [
        "watching",
        "planToWatch",
        "completed",
        "onHold",
        "dropped",
      ];

      statuses.forEach((status, _) => {
        store.updateStatus({ animeId: 1, newStatus: status });
        expect(mockWatchlistRef.value[0].status).toBe(status);
      });
    });

    it("should handle errors during update", () => {
      vi.spyOn(mockWatchlistRef.value, "findIndex").mockImplementation(() => {
        throw "FindIndex failed";
      });

      store.updateStatus({ animeId: 1, newStatus: "completed" });

      expect(store.error).toBe("Failed to update status");
      expect(store.isLoading).toBe(false);
    });
  });

  describe("updateScore", () => {
    beforeEach(() => {
      mockWatchlistRef.value = [
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 2, status: "completed", score: 4 },
      ];
    });

    it("should update score of existing entry", () => {
      store.updateScore({ animeId: 1, newScore: 4 });

      expect(mockWatchlistRef.value[0]).toEqual({
        animeId: 1,
        status: "watching",
        score: 4,
      });
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should not affect other entries", () => {
      const originalSecondEntry = { ...mockWatchlistRef.value[1] };

      store.updateScore({ animeId: 1, newScore: 3 });

      expect(mockWatchlistRef.value[1]).toEqual(originalSecondEntry);
    });

    it("should do nothing if anime not found", () => {
      const originalWatchlist = [...mockWatchlistRef.value];

      store.updateScore({ animeId: 999, newScore: 5 });

      expect(mockWatchlistRef.value).toEqual(originalWatchlist);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should handle all score values (0-5)", () => {
      for (let score = 0; score <= 5; score++) {
        store.updateScore({ animeId: 1, newScore: score as UserScore });
        expect(mockWatchlistRef.value[0].score).toBe(score);
      }
    });

    it("should handle errors during score update", () => {
      const originalFindIndex = Array.prototype.findIndex;
      Array.prototype.findIndex = vi.fn(() => {
        throw "FindIndex failed";
      });

      store.updateScore({ animeId: 1, newScore: 2 });

      expect(store.error).toBe("Failed to update status");
      expect(store.isLoading).toBe(false);

      Array.prototype.findIndex = originalFindIndex;
    });
  });

  describe("removeFromWatchlist", () => {
    beforeEach(() => {
      mockWatchlistRef.value = [
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 2, status: "completed", score: 4 },
        { animeId: 3, status: "planToWatch", score: 0 },
      ];
    });

    it("should remove entry from watchlist", () => {
      store.removeFromWatchlist({ animeId: 2 });

      expect(mockWatchlistRef.value).toEqual([
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 3, status: "planToWatch", score: 0 },
      ]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should remove first entry correctly", () => {
      store.removeFromWatchlist({ animeId: 1 });

      expect(mockWatchlistRef.value).toEqual([
        { animeId: 2, status: "completed", score: 4 },
        { animeId: 3, status: "planToWatch", score: 0 },
      ]);
    });

    it("should remove last entry correctly", () => {
      store.removeFromWatchlist({ animeId: 3 });

      expect(mockWatchlistRef.value).toEqual([
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 2, status: "completed", score: 4 },
      ]);
    });

    it("should do nothing if anime not in watchlist", () => {
      const originalWatchlist = [...mockWatchlistRef.value];

      store.removeFromWatchlist({ animeId: 999 });

      expect(mockWatchlistRef.value).toEqual(originalWatchlist);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should remove all entries if same ID added multiple times", () => {
      mockWatchlistRef.value = [
        { animeId: 1, status: "watching", score: 3 },
        { animeId: 1, status: "completed", score: 4 },
      ];

      store.removeFromWatchlist({ animeId: 1 });

      expect(mockWatchlistRef.value).toEqual([]);
    });

    it("should handle errors during removal", () => {
      const originalFilter = Array.prototype.filter;
      Array.prototype.filter = vi.fn(() => {
        throw "Filter failed";
      });

      store.removeFromWatchlist({ animeId: 1 });

      expect(store.error).toBe("Failed to remove from watchlist");
      expect(store.isLoading).toBe(false);

      Array.prototype.filter = originalFilter;
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete workflow", () => {
      store.addToWatchlist({ animeId: 1, status: "planToWatch", score: 0 });
      expect(store.animeIds).toEqual([1]);

      store.updateStatus({ animeId: 1, newStatus: "watching" });
      store.updateScore({ animeId: 1, newScore: 3 });

      expect(mockWatchlistRef.value[0]).toEqual({
        animeId: 1,
        status: "watching",
        score: 3,
      });

      store.updateStatus({ animeId: 1, newStatus: "completed" });
      store.updateScore({ animeId: 1, newScore: 4 });

      expect(mockWatchlistRef.value[0]).toEqual({
        animeId: 1,
        status: "completed",
        score: 4,
      });

      store.removeFromWatchlist({ animeId: 1 });
      expect(mockWatchlistRef.value).toEqual([]);
    });

    it("should maintain data integrity across operations", () => {
      store.addToWatchlist({ animeId: 1, status: "watching", score: 2 });
      store.addToWatchlist({ animeId: 2, status: "watching", score: 4 });
      store.addToWatchlist({ animeId: 3, status: "planToWatch", score: 0 });

      store.updateStatus({ animeId: 2, newStatus: "onHold" });
      store.updateScore({ animeId: 2, newScore: 3 });

      expect(mockWatchlistRef.value[0]).toEqual({
        animeId: 1,
        status: "watching",
        score: 2,
      });
      expect(mockWatchlistRef.value[1]).toEqual({
        animeId: 2,
        status: "onHold",
        score: 3,
      });
      expect(mockWatchlistRef.value[2]).toEqual({
        animeId: 3,
        status: "planToWatch",
        score: 0,
      });
    });
  });
});
