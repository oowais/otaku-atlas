import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAnime } from "@/composables/useAnime";

// Mock dependencies
vi.mock("pinia", () => ({
  storeToRefs: vi.fn(),
}));

vi.mock("@/graphql/queries", () => ({
  getAnimeByIds: vi.fn(),
}));

vi.mock("@/stores/watchlist", () => ({
  useWatchlistStore: vi.fn(),
}));

describe("useAnime", async () => {
  const mockStoreToRefs = vi.mocked(await import("pinia")).storeToRefs;
  const mockGetAnimeByIds = vi.mocked(
    await import("@/graphql/queries"),
  ).getAnimeByIds;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWatchlistedAnime", () => {
    it("should return empty array when animeIds is empty", async () => {
      mockStoreToRefs.mockReturnValue({
        animeIds: { value: [] },
        watchlist: { value: [] },
      });

      const { getWatchlistedAnime } = useAnime();
      const result = await getWatchlistedAnime();

      expect(result).toEqual([]);
      expect(mockGetAnimeByIds).not.toHaveBeenCalled();
    });

    it("should return null when API call fails", async () => {
      mockStoreToRefs.mockReturnValue({
        animeIds: { value: [1, 2] },
        watchlist: { value: [] },
      });
      mockGetAnimeByIds.mockResolvedValue({ success: false });

      const { getWatchlistedAnime } = useAnime();
      const result = await getWatchlistedAnime();

      expect(result).toBeNull();
      expect(mockGetAnimeByIds).toHaveBeenCalledWith([1, 2]);
    });

    it("should return watchlisted anime with proper transformation", async () => {
      const mockAnime = [
        { id: 1, title: "Anime 1" },
        { id: 2, title: "Anime 2" },
      ];
      const mockWatchlist = [
        { animeId: 1, status: "watching", score: 8 },
        { animeId: 2, status: "completed", score: 9 },
      ];

      mockStoreToRefs.mockReturnValue({
        animeIds: { value: [1, 2] },
        watchlist: { value: mockWatchlist },
      });
      mockGetAnimeByIds.mockResolvedValue({
        success: true,
        data: mockAnime,
      });

      const { getWatchlistedAnime } = useAnime();
      const result = await getWatchlistedAnime();

      expect(result).toEqual([
        {
          anime: { id: 1, title: "Anime 1" },
          watchlistEntry: { status: "watching", score: 8 },
        },
        {
          anime: { id: 2, title: "Anime 2" },
          watchlistEntry: { status: "completed", score: 9 },
        },
      ]);
    });

    it("should filter out watchlist entries without matching anime", async () => {
      const mockAnime = [{ id: 1, title: "Anime 1" }];
      const mockWatchlist = [
        { animeId: 1, status: "watching", score: 8 },
        { animeId: 3, status: "completed", score: 9 },
      ];

      mockStoreToRefs.mockReturnValue({
        animeIds: { value: [1, 3] },
        watchlist: { value: mockWatchlist },
      });
      mockGetAnimeByIds.mockResolvedValue({
        success: true,
        data: mockAnime,
      });

      const { getWatchlistedAnime } = useAnime();
      const result = await getWatchlistedAnime();

      expect(result).toEqual([
        {
          anime: { id: 1, title: "Anime 1" },
          watchlistEntry: { status: "watching", score: 8 },
        },
      ]);
    });

    it("should return empty array when no anime matches watchlist entries", async () => {
      const mockAnime = [{ id: 5, title: "Anime 5" }];
      const mockWatchlist = [
        { animeId: 1, status: "watching", score: 8 },
        { animeId: 2, status: "completed", score: 9 },
      ];

      mockStoreToRefs.mockReturnValue({
        animeIds: { value: [1, 2] },
        watchlist: { value: mockWatchlist },
      });
      mockGetAnimeByIds.mockResolvedValue({
        success: true,
        data: mockAnime,
      });

      const { getWatchlistedAnime } = useAnime();
      const result = await getWatchlistedAnime();

      expect(result).toEqual([]);
    });
  });
});
