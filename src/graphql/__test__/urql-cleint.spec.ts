import { describe, it, expect } from "vitest";
import { client } from "@/graphql/urql-client";

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

    expect(response.data).toBeDefined();
    expect(response.data.Page).toBeDefined();
    expect(response.data.Page.media).toBeInstanceOf(Array);
  });
});
