/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchStore } from "@/stores/search";

const mockQuery = vi.hoisted(() => vi.fn());

vi.mock("@/graphql/urql-client", () => ({
  client: {
    query: mockQuery,
  },
}));

vi.mock("@/graphql/queries", () => ({
  searchAnimeQuery: "mockSearchQuery",
  PER_PAGE: 12,
}));

describe("useSearchStore - searchAnime", () => {
  let store: ReturnType<typeof useSearchStore>;

  beforeEach(async () => {
    setActivePinia(createPinia());
    store = useSearchStore();
    vi.clearAllMocks();
  });

  it("should clear results and return early for empty search term", async () => {
    store.searchResults = [{ id: 1 }] as any;

    await store.searchAnime("");

    expect(store.searchResults).toEqual([]);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("should clear results and return early for whitespace-only search term", async () => {
    store.searchResults = [{ id: 1 }] as any;

    await store.searchAnime("   ");

    expect(store.searchResults).toEqual([]);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("should set loading states correctly during successful search", async () => {
    const mockData = {
      Page: {
        media: [{ id: 1, title: "Test Anime" }],
        pageInfo: {
          currentPage: 1,
          hasNextPage: true,
          total: 100,
        },
      },
    };
    mockQuery.mockResolvedValue({ data: mockData });

    const searchPromise = store.searchAnime("test");

    expect(store.loading).toBe(true);
    expect(store.error).toBe(false);

    await searchPromise;

    expect(store.loading).toBe(false);
  });

  it("should update search results and pagination info on successful search", async () => {
    const mockData = {
      Page: {
        media: [
          { id: 1, title: "Test Anime 1" },
          { id: 2, title: "Test Anime 2" },
        ],
        pageInfo: {
          currentPage: 1,
          hasNextPage: true,
          total: 50,
        },
      },
    };
    mockQuery.mockResolvedValue({ data: mockData });

    await store.searchAnime("test anime");

    expect(store.searchResults).toEqual(mockData.Page.media);
    expect(store.currentPage).toBe(1);
    expect(store.hasNextPage).toBe(true);
    expect(store.totalResults).toBe(50);
    expect(store.currentSearchTerm).toBe("test anime");
    expect(store.error).toBe(false);
  });

  it("should clear results when API returns no data", async () => {
    store.searchResults = [{ id: 1 }] as any;
    mockQuery.mockResolvedValue({ data: null });

    await store.searchAnime("test");

    expect(store.searchResults).toEqual([]);
  });

  it("should clear results when API returns no media data", async () => {
    store.searchResults = [{ id: 1 }] as any;
    mockQuery.mockResolvedValue({
      data: { Page: { media: null } },
    });

    await store.searchAnime("test");

    expect(store.searchResults).toEqual([]);
  });

  it("should handle API errors correctly", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockQuery.mockRejectedValue(new Error("API Error"));

    await store.searchAnime("test");

    expect(store.error).toBe(true);
    expect(store.loading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Search error:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("should use default pagination values when pageInfo is missing", async () => {
    const mockData = {
      Page: {
        media: [{ id: 1, title: "Test Anime" }],
        pageInfo: null,
      },
    };

    mockQuery.mockResolvedValue({ data: mockData });

    await store.searchAnime("test", 3);

    expect(store.currentPage).toBe(3);
    expect(store.hasNextPage).toBe(false);
    expect(store.totalResults).toBe(0);
  });

  it("should call client.query with correct parameters", async () => {
    const mockData = {
      Page: {
        media: [{ id: 1, title: "Test Anime" }],
        pageInfo: {
          currentPage: 2,
          hasNextPage: true,
          total: 100,
        },
      },
    };

    mockQuery.mockResolvedValue({ data: mockData });

    await store.searchAnime("naruto", 2, 20);

    expect(mockQuery).toHaveBeenCalledWith("mockSearchQuery", {
      search: "naruto",
      page: 2,
      perPage: 20,
    });
  });

  it("should use default perPage value when not provided", async () => {
    const mockData = {
      Page: {
        media: [{ id: 1, title: "Test Anime" }],
        pageInfo: {
          currentPage: 1,
          hasNextPage: false,
          total: 1,
        },
      },
    };

    mockQuery.mockResolvedValue({ data: mockData });

    await store.searchAnime("test");

    expect(mockQuery).toHaveBeenCalledWith("mockSearchQuery", {
      search: "test",
      page: 1,
      perPage: 12,
    });
  });
});
