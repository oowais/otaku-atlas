/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAnimeById } from "@/graphql/queries";
import { client } from "@/graphql/urql-client";

vi.mock("@/graphql/urql-client", () => ({
  client: {
    query: vi.fn(),
  },
}));

vi.spyOn(console, "error").mockImplementation(() => {});

const createMockQueryResult = (data: any, error?: any) => ({
  data,
  error,
  operation: {} as any,
  stale: false,
  hasNext: false,
});

describe("getAnimeById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return successful result with anime data", async () => {
    const mockData = {
      Media: {
        id: 1,
        title: {
          romaji: "Shingeki no Kyojin",
          english: "Attack on Titan",
        },
        description: "Humanity fights for survival against giants",
      },
    };

    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));
    const result = await getAnimeById(1);

    expect(client.query).toHaveBeenCalledWith(expect.any(Object), { id: 1 });
    expect(result).toEqual({
      success: true,
      data: mockData.Media,
    });
  });

  it("should return null when anime not found", async () => {
    const mockData = { Media: null };
    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(mockData));

    const result = await getAnimeById(99999);

    expect(result).toEqual({
      success: true,
      data: null,
    });
  });

  it("should handle undefined data", async () => {
    vi.mocked(client.query).mockResolvedValue(createMockQueryResult(undefined));
    const result = await getAnimeById(1);

    expect(result).toEqual({
      success: true,

      data: null,
    });
  });

  it("should handle query errors", async () => {
    const queryError = new Error("GraphQL error");
    vi.mocked(client.query).mockRejectedValue(queryError);
    const result = await getAnimeById(1);

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
    const result = await getAnimeById(1);

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

    await getAnimeById(0);
    expect(client.query).toHaveBeenCalledWith(expect.any(Object), { id: 0 });
    await getAnimeById(-1);
    expect(client.query).toHaveBeenCalledWith(expect.any(Object), { id: -1 });
  });
});
