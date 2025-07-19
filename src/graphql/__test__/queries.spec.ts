import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAnimeByIds, searchAnime } from "@/graphql/queries";
import { client } from "@/graphql/urql-client";

vi.mock("@/graphql/urql-client", () => ({
  client: {
    query: vi.fn(),
  },
}));

vi.spyOn(console, "error").mockImplementation(() => {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockQueryResult = (data: any, error?: any) => ({
  data,
  error,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operation: {} as any,
  stale: false,
  hasNext: false,
});

describe("searchAnime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return successful result with anime data", async () => {
    const mockData = {
      Page: {
        media: [
          {
            id: 1,
            title: {
              romaji: "Shingeki no Kyojin",
              english: "Attack on Titan",
            },
          },
          {
            id: 2,
            title: {
              romaji: "Shingeki no Kyojin Season 2",
              english: "Attack on Titan Season 2",
            },
          },
        ],
      },
    };

    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    const result = await searchAnime("Attack");

    expect(client.query).toHaveBeenCalledWith(expect.any(Object), {
      search: "Attack",
    });
    expect(result).toEqual({
      success: true,
      data: mockData.Page.media,
    });
  });

  it("should return empty array when no media found", async () => {
    const mockData = {
      Page: {
        media: [],
      },
    };

    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    const result = await searchAnime("NonexistentAnime");

    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it("should handle null/undefined media gracefully", async () => {
    const mockData = {
      Page: {
        media: null,
      },
    };

    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    const result = await searchAnime("test");

    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it("should handle undefined data gracefully", async () => {
    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(undefined));

    const result = await searchAnime("test");

    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it("should handle network/query errors", async () => {
    const networkError = new Error("Network error");
    vi.mocked(client.query).mockRejectedValue(networkError);

    const result = await searchAnime("test");

    expect(console.error).toHaveBeenCalledWith(
      "Error occurred while searching for anime:",
      networkError,
    );
    expect(result).toEqual({
      success: false,
      error: networkError,
    });
  });

  it("should handle unknown error types", async () => {
    const networkError = new Error("some network error");
    vi.mocked(client.query).mockRejectedValue(networkError);

    const result = await searchAnime("test");

    expect(console.error).toHaveBeenCalledWith(
      "Error occurred while searching for anime:",
      networkError,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("some network error");
    }
  });
});

describe("getAnimeByIds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return successful result with anime data", async () => {
    const mockData = {
      Page: {
        media: [
          {
            id: 1,
            title: {
              romaji: "Shingeki no Kyojin",
              english: "Attack on Titan",
            },
            description: "Humanity fights for survival against giants",
          },
          {
            id: 2,
            title: {
              romaji: "Shingeki no Kyojin",
              english: "Attack on Titan",
            },
            description: "Humanity fights for survival against giants",
          },
        ],
      },
    };

    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    const result = await getAnimeByIds([1, 2]);

    expect(client.query).toHaveBeenCalledWith(expect.any(Object), {
      ids: [1, 2],
    });
    expect(result).toEqual({
      success: true,
      data: mockData.Page.media,
    });
  });

  it("should return null when anime not found", async () => {
    const mockData = {
      Page: {
        media: null,
      },
    };

    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    const result = await getAnimeByIds([99999]);

    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it("should handle undefined data", async () => {
    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(undefined));

    const result = await getAnimeByIds([1]);

    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it("should handle query errors", async () => {
    const queryError = new Error("GraphQL error");
    vi.mocked(client.query).mockRejectedValue(queryError);

    const result = await getAnimeByIds([1]);

    expect(console.error).toHaveBeenCalledWith(
      "Error occurred while fetching anime by ID:",
      queryError,
    );
    expect(result).toEqual({
      success: false,
      error: queryError,
    });
  });

  it("should handle unknown error types", async () => {
    const unknownError = { message: "Some object error" };
    vi.mocked(client.query).mockRejectedValue(unknownError);

    const result = await getAnimeByIds([1]);

    expect(console.error).toHaveBeenCalledWith(
      "Error occurred while fetching anime by ID:",
      unknownError,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("Unknown error");
    }
  });

  it("should handle edge case IDs", async () => {
    const mockData = { Media: null };
    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    await getAnimeByIds([0]);
    expect(client.query).toHaveBeenCalledWith(expect.any(Object), { id: 0 });

    await getAnimeByIds([-1]);
    expect(client.query).toHaveBeenCalledWith(expect.any(Object), { id: -1 });
  });
});
