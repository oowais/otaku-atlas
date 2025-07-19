import { graphql } from "gql.tada";

import {
  type Anime,
  animeFieldsFragment,
  type SearchResult,
} from "@/graphql/types";
import { client } from "@/graphql/urql-client";

const searchAnimeQuery = graphql(
  `
    query ($search: String!) {
      Page {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          ...AnimeFields
        }
      }
    }
  `,
  [animeFieldsFragment],
);

async function searchAnime(search: string): Promise<SearchResult<Anime[]>> {
  try {
    const result = await client.query(searchAnimeQuery, { search });
    const anime = result.data?.Page?.media ?? [];
    const filteredAnime = anime.filter((item) => item !== null);
    return {
      success: true,
      data: filteredAnime,
    };
  } catch (error) {
    console.error("Error occurred while searching for anime:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

const getAnimeByIdsQuery = graphql(
  `
    query ($ids: [Int!]!) {
      Page {
        media(id_in: $ids, type: ANIME) {
          ...AnimeFields
        }
      }
    }
  `,
  [animeFieldsFragment],
);

async function getAnimeByIds(ids: number[]): Promise<SearchResult<Anime[]>> {
  try {
    const result = await client.query(getAnimeByIdsQuery, { ids });
    const anime = result.data?.Page?.media ?? [];
    const filteredAnime = anime.filter((item) => item !== null);
    return {
      success: true,
      data: filteredAnime,
    };
  } catch (error) {
    console.error("Error occurred while fetching anime by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

export { getAnimeByIds, searchAnime };
