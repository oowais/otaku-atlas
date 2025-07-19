import { graphql } from "gql.tada";

import type { Anime, SearchResult } from "@/graphql/types";
import { client } from "@/graphql/urql-client";

const searchAnimeQuery = graphql(`
  query ($search: String!) {
    Page {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
        }
      }
    }
  }
`);

const getAnimeByIdQuery = graphql(`
  query ($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      # Proably need to add more fields here
      title {
        romaji
        english
      }
      description
      coverImage {
        large
        medium
      }
    }
  }
`);

async function searchAnime(search: string): Promise<SearchResult<Anime[]>> {
  try {
    const result = await client.query(searchAnimeQuery, { search });
    return {
      success: true,
      data: result.data?.Page?.media ?? [],
    };
  } catch (error) {
    console.error("Error occurred while searching for anime:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

async function getAnimeById(id: number): Promise<SearchResult<Anime | null>> {
  try {
    const result = await client.query(getAnimeByIdQuery, { id });
    return {
      success: true,
      data: result.data?.Media ?? null,
    };
  } catch (error) {
    console.error("Error occurred while fetching anime by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export { searchAnimeQuery, searchAnime, getAnimeById };
