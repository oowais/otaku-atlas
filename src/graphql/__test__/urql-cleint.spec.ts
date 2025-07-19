import { describe, expect, it, vi } from "vitest";

import { client } from "@/graphql/urql-client";

vi.mock("@urql/vue", () => {
  return {
    Client: vi.fn(() => ({
      query: vi.fn(() => ({
        toPromise: vi.fn().mockResolvedValue({
          data: {
            Page: {
              media: [
                { id: 1, title: { romaji: "Mocked Title 1" } },
                { id: 2, title: { romaji: "Mocked Title 2" } },
              ],
            },
          },
        }),
      })),
    })),
    cacheExchange: vi.fn(() => "cacheExchange"),
    fetchExchange: vi.fn(() => "fetchExchange"),
  };
});

describe("GraphQL Client", () => {
  it("should export a working client instance", () => {
    expect(client).toBeDefined();
    expect(client.query).toBeDefined();
  });

  it("should be able to make a simple query", async () => {
    const query = `
      query {
        Page {
          media {
            id
            title {
              romaji
            }
          }
        }
      }
    `;

    const response = await client.query(query, {}).toPromise();

    expect(response.data.Page.media).toEqual([
      { id: 1, title: { romaji: "Mocked Title 1" } },
      { id: 2, title: { romaji: "Mocked Title 2" } },
    ]);
  });
});
