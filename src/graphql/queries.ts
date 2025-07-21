import { graphql } from "gql.tada";

import {
  type Anime,
  animeFieldsFragment,
  type SearchResult,
} from "@/graphql/types";
import { client } from "@/graphql/urql-client";

const PER_PAGE = window.innerWidth < 768 ? 12 : 16;

const searchAnimeQuery = graphql(
  `
    query ($search: String!, $page: Int!, $perPage: Int!) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
          currentPage
          total
          perPage
        }
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          ...AnimeFields
        }
      }
    }
  `,
  [animeFieldsFragment],
);

const getAnimeByIdsQuery = graphql(
  `
    query ($ids: [Int!]!, $page: Int!, $perPage: Int!) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
          currentPage
          total
          perPage
        }
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
    const result = await client.query(getAnimeByIdsQuery, {
      ids,
      page: 1,
      perPage: 5,
    });
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

const getAnimeByIdQuery = graphql(
  `
    query ($id: Int!) {
      Media(id: $id, type: ANIME) {
        ...AnimeFields
      }
    }
  `,
  [animeFieldsFragment],
);

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

export {
  getAnimeById,
  getAnimeByIds,
  getAnimeByIdsQuery,
  PER_PAGE,
  searchAnimeQuery,
};
